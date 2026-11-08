
const { createSession, resetSession } = require("./SessionState");

const {
    getFallbackResponse,
    resetFallbackCount
} = require("./Fallback");

const MENU = {
    burgers: [
        { name: "Classic Burger", price: 6.99 },
        { name: "Cheeseburger", price: 7.99 },
        { name: "Veggie Burger", price: 6.49 }
    ],
    pizza: [
        { name: "Margherita Pizza", price: 8.99 },
        { name: "Pepperoni Pizza", price: 10.99 },
        { name: "Veggie Pizza", price: 9.49 }
    ],
    pasta: [
        { name: "Tomato Pasta", price: 7.99 },
        { name: "Creamy Mushroom Pasta", price: 9.49 }
    ],
    sides: [
        { name: "French Fries", price: 2.99 },
        { name: "Garlic Bread", price: 3.49 }
    ],
    drinks: [
        { name: "Water", price: 1.50 },
        { name: "Cola", price: 2.00 }
    ],
    desserts: [
        { name: "Chocolate Brownie", price: 3.99 },
        { name: "Ice Cream", price: 2.99 }
    ]
};

function formatMenu(category) {
    const items = MENU[category];

    if (!items) {
        return "Sorry, I couldn't find that menu category.";
    }

    const title = category.charAt(0).toUpperCase() + category.slice(1);

    const itemLines = items.map(
        item => `${item.name} - €${item.price.toFixed(2)}`
    );

    return `${title} Menu:\n${itemLines.join("\n")}`;
}

function findMenuItem(itemText) {
    const searchText = itemText.toLowerCase();

    for (const [category, items] of Object.entries(MENU)) {
        const item = items.find(menuItem =>
            searchText.includes(menuItem.name.toLowerCase())
        );

        if (item) {
            return { ...item, category };
        }
    }

    return null;
}

function calculateTotal(order) {
    return order.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
}

function formatOrder(order) {
    if (order.length === 0) {
        return "Your cart is empty. Ask me to add something from our menu!";
    }

    const lines = order.map(item =>
        `${item.quantity} x ${item.name} - €${(
            item.price * item.quantity
        ).toFixed(2)}`
    );

    return `Your ByteBites Order:\n${lines.join("\n")}\nTotal: €${calculateTotal(order).toFixed(2)}`;
}

function formatCheckoutSummary(session) {
    let summary = formatOrder(session.order);

    summary += `\n\nOrder type: ${session.deliveryMethod}`;

    if (session.deliveryMethod === "delivery") {
        summary += `\nDelivery address: ${session.deliveryAddress}`;
    }

    return summary;
}

function isValidDeliveryAddress(address) {
    const trimmedAddress = address.trim();

    return (
        trimmedAddress.length >= 8 &&
        /[a-z]/i.test(trimmedAddress) &&
        /\d/.test(trimmedAddress)
    );
}

function savePreviousFulfillment(session) {
    session.previousDeliveryMethod = session.deliveryMethod;
    session.previousDeliveryAddress = session.deliveryAddress;
}

function restorePreviousFulfillment(session) {
    session.deliveryMethod = session.previousDeliveryMethod;
    session.deliveryAddress = session.previousDeliveryAddress;

    session.previousDeliveryMethod = null;
    session.previousDeliveryAddress = "";
}

function clearPreviousFulfillment(session) {
    session.previousDeliveryMethod = null;
    session.previousDeliveryAddress = "";
}

function createConversationEngine() {
    const session = createSession();

    function handleMessage(text) {
        const timestamp = new Date().toISOString();

        if (typeof text !== "string" || !text.trim()) {
            return {
                type: "message",
                text: "Please type a message so I can help you order.",
                timestamp
            };
        }

        const userText = text.trim().toLowerCase();

        let reply;
        let wasFallback = false;

        const item = findMenuItem(userText);

        const quantityMatch = userText.match(/\b(\d+)\b/);

        const requestedQuantity = quantityMatch
            ? Math.max(1, parseInt(quantityMatch[1], 10))
            : 1;

        // Initial delivery or pickup selection.
        if (session.stage === "awaiting_fulfillment") {

            if (
                userText === "delivery" ||
                userText.includes("delivery")
            ) {
                session.deliveryMethod = "delivery";
                session.stage = "awaiting_address";

                reply = "Great! Please enter your complete delivery address.";

            } else if (
                userText.includes("pickup") ||
                userText.includes("pick up") ||
                userText.includes("collection")
            ) {
                session.deliveryMethod = "pickup";
                session.deliveryAddress = "";
                session.stage = "awaiting_confirmation";

                reply = `${formatCheckoutSummary(session)}\n\nWould you like to confirm your order? Type "confirm order" to complete it.`;

            } else if (
                userText === "cancel" ||
                userText === "cancel checkout"
            ) {
                session.stage = "browsing";
                session.deliveryMethod = null;
                session.deliveryAddress = "";

                reply = "Checkout cancelled. Your cart has been kept.";

            } else {
                wasFallback = true;
                reply = getFallbackResponse(session);
            }

            // Entering the initial delivery address.
        } else if (session.stage === "awaiting_address") {

            if (
                userText === "cancel" ||
                userText === "cancel checkout"
            ) {
                session.stage = "browsing";
                session.deliveryMethod = null;
                session.deliveryAddress = "";

                reply = "Delivery setup cancelled. Your cart has been kept.";

            } else if (!isValidDeliveryAddress(text)) {
                reply = "Please enter a valid delivery address including a street name and house number. For example: Musterstrasse 10, Deggendorf.";

            } else {
                session.deliveryAddress = text.trim();
                session.stage = "awaiting_confirmation";

                reply = `${formatCheckoutSummary(session)}\n\nWould you like to confirm your order? Type "confirm order" to complete it.`;
            }

            // Changing an existing delivery address.
        } else if (session.stage === "editing_address") {

            if (
                userText === "cancel" ||
                userText === "cancel change"
            ) {
                restorePreviousFulfillment(session);
                session.stage = "awaiting_confirmation";

                reply = `Your fulfillment change has been cancelled. Your previous selection has been restored.\n\n${formatCheckoutSummary(session)}\n\nType "confirm order" to complete your order.`;

            } else if (!isValidDeliveryAddress(text)) {
                reply = "Please enter a valid delivery address including a street name and house number. For example: Musterstrasse 10, Deggendorf. Type cancel to keep your previous selection.";

            } else {
                session.deliveryAddress = text.trim();
                session.stage = "awaiting_confirmation";
                clearPreviousFulfillment(session);

                reply = `Your delivery address has been updated!\n\n${formatCheckoutSummary(session)}\n\nWould you like to confirm your order?`;
            }

            // Changing delivery or pickup.
        } else if (session.stage === "changing_fulfillment") {

            if (
                userText === "delivery" ||
                userText.includes("delivery")
            ) {
                session.deliveryMethod = "delivery";
                session.deliveryAddress = "";
                session.stage = "editing_address";

                reply = "Great! Please enter your new delivery address. Type cancel to restore your previous fulfillment method.";

            } else if (
                userText.includes("pickup") ||
                userText.includes("pick up") ||
                userText.includes("collection")
            ) {
                session.deliveryMethod = "pickup";
                session.deliveryAddress = "";
                session.stage = "awaiting_confirmation";

                reply = `Your order has been changed to pickup.\n\n${formatCheckoutSummary(session)}\n\nType "cancel change" to restore your previous fulfillment method, or confirm your order.`;

            } else if (
                userText === "cancel" ||
                userText === "cancel change"
            ) {
                restorePreviousFulfillment(session);
                session.stage = "awaiting_confirmation";

                reply = `Your previous delivery method has been kept.\n\n${formatCheckoutSummary(session)}`;

            } else {
                wasFallback = true;
                reply = getFallbackResponse(session);
            }

            // Confirmation and editing options.
        } else if (session.stage === "awaiting_confirmation") {

            if (userText === "cancel change") {
                restorePreviousFulfillment(session);
                session.stage = "awaiting_confirmation";

                reply = `Your previous delivery method has been restored.\n\n${formatCheckoutSummary(session)}\n\nYou can now confirm your order.`;

            } else if (
                userText === "no" ||
                userText === "cancel" ||
                userText.includes("cancel order") ||
                userText.includes("cancel checkout")
            ) {
                session.stage = "browsing";
                session.deliveryMethod = null;
                session.deliveryAddress = "";
                clearPreviousFulfillment(session);

                reply = "Checkout cancelled. Your cart has been kept, so you can make changes or try again.";

            } else if (
                userText.includes("change address") ||
                userText.includes("edit address") ||
                userText.includes("update address")
            ) {
                if (session.deliveryMethod === "delivery") {
                    savePreviousFulfillment(session);
                    session.stage = "editing_address";

                    reply = "Please enter your new delivery address. Type cancel to keep your previous address.";
                } else {
                    savePreviousFulfillment(session);
                    session.stage = "changing_fulfillment";

                    reply = "Your order is currently pickup. Would you like to switch to Delivery or keep Pickup?";
                }

            } else if (
                userText.includes("change method") ||
                userText.includes("change delivery") ||
                userText.includes("switch method") ||
                userText.includes("change to pickup") ||
                userText.includes("change to delivery") ||
                userText.includes("switch to pickup") ||
                userText.includes("switch to delivery")
            ) {
                savePreviousFulfillment(session);
                session.stage = "changing_fulfillment";

                reply = "Would you like to receive your order by Delivery or Pickup?";

            } else if (
                userText.includes("confirm order") ||
                userText === "confirm" ||
                userText === "yes" ||
                userText === "yes please"
            ) {
                if (
                    session.deliveryMethod === "delivery" &&
                    !isValidDeliveryAddress(session.deliveryAddress)
                ) {
                    session.stage = "editing_address";
                    reply = "Your delivery address is missing or invalid. Please enter a valid address before confirming your order.";
                } else {
                    reply = `Your order has been confirmed!\n\n${formatCheckoutSummary(session)}`;

                    session.order = [];
                    session.stage = "browsing";
                    session.deliveryMethod = null;
                    session.deliveryAddress = "";
                    clearPreviousFulfillment(session);
                }

            } else {
                wasFallback = true;
                reply = getFallbackResponse(session);
            }

            // Start checkout.
        } else if (
            userText.includes("checkout") ||
            userText.includes("check out") ||
            userText.includes("complete my order")
        ) {
            if (session.order.length === 0) {
                reply = "Your cart is empty. Add something from our menu before checkout.";
            } else {
                session.deliveryMethod = null;
                session.deliveryAddress = "";
                clearPreviousFulfillment(session);
                session.stage = "awaiting_fulfillment";

                reply = "How would you like to receive your order?\n\nPlease choose Delivery or Pickup.";
            }

            // Remove an item.
        } else if (
            item &&
            (userText.includes("remove") || userText.includes("delete"))
        ) {
            const existingItem = session.order.find(
                orderItem => orderItem.name === item.name
            );

            if (!existingItem) {
                reply = `${item.name} is not in your cart.`;
            } else {
                existingItem.quantity -= requestedQuantity;

                if (existingItem.quantity <= 0) {
                    session.order = session.order.filter(
                        orderItem => orderItem.name !== item.name
                    );

                    reply = `${item.name} has been removed from your cart.\n${formatOrder(session.order)}`;
                } else {
                    reply = `${requestedQuantity} x ${item.name} removed.\n${formatOrder(session.order)}`;
                }
            }

            // Update quantity.
        } else if (
            item &&
            (
                userText.includes("set quantity") ||
                userText.includes("change quantity") ||
                userText.includes("update quantity")
            )
        ) {
            const existingItem = session.order.find(
                orderItem => orderItem.name === item.name
            );

            if (!existingItem) {
                reply = `${item.name} is not in your cart yet.`;
            } else {
                existingItem.quantity = requestedQuantity;

                reply = `Quantity updated!\n${formatOrder(session.order)}`;
            }

            // Add an item.
        } else if (item) {
            const existingItem = session.order.find(
                orderItem => orderItem.name === item.name
            );

            if (existingItem) {
                existingItem.quantity += requestedQuantity;
            } else {
                session.order.push({
                    name: item.name,
                    price: item.price,
                    quantity: requestedQuantity
                });
            }

            reply = `${requestedQuantity} x ${item.name} added to your cart.\n${formatOrder(session.order)}`;

            // Show cart.
        } else if (
            userText.includes("cart") ||
            userText.includes("order summary") ||
            userText.includes("show my order")
        ) {
            reply = formatOrder(session.order);

            // Clear cart.
        } else if (
            userText.includes("clear order") ||
            userText.includes("empty cart")
        ) {
            session.order = [];

            reply = "Your cart has been cleared.";

            // Show menu.
        } else if (userText.includes("menu")) {
            reply = "Welcome to ByteBites! Choose a category: burgers, pizza, pasta, sides, drinks, or desserts.";

        } else if (userText.includes("burger")) {
            reply = formatMenu("burgers");

        } else if (userText.includes("pizza")) {
            reply = formatMenu("pizza");

        } else if (userText.includes("pasta")) {
            reply = formatMenu("pasta");

        } else if (userText.includes("side")) {
            reply = formatMenu("sides");

        } else if (userText.includes("drink")) {
            reply = formatMenu("drinks");

        } else if (userText.includes("dessert")) {
            reply = formatMenu("desserts");

        } else if (/^(hello|hi|hey)\b/.test(userText)) {
            reply = "Hey! Welcome to ByteBites. Would you like to see our menu?";

            // Fallback handling.
        } else {
            wasFallback = true;
            reply = getFallbackResponse(session);
        }

        if (!wasFallback) {
            resetFallbackCount(session);
        }

        session.conversationHistory.push(
            {
                sender: "user",
                text: text.trim(),
                timestamp
            },
            {
                sender: "bot",
                text: reply,
                timestamp: new Date().toISOString()
            }
        );

        return {
            type: "message",
            text: reply,
            timestamp: new Date().toISOString()
        };
    }

    function resetConversation() {
        resetSession(session);
    }

    return {
        handleMessage,
        resetConversation,
        session
    };
}

module.exports = { createConversationEngine };
