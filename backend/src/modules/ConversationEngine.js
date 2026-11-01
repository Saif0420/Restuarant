
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

function createConversationEngine() {
    const session = createSession();

    session.deliveryMethod = null;
    session.deliveryAddress = "";

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

        // Handle delivery or pickup selection.
        if (session.stage === "awaiting_fulfillment") {

            if (
                userText === "delivery" ||
                userText.includes("home delivery")
            ) {
                session.deliveryMethod = "delivery";
                session.stage = "awaiting_address";

                reply = "Great! Please enter your complete delivery address.";

            } else if (
                userText === "pickup" ||
                userText.includes("pick up") ||
                userText.includes("collection")
            ) {
                session.deliveryMethod = "pickup";
                session.deliveryAddress = "";
                session.stage = "awaiting_confirmation";

                reply = `${formatCheckoutSummary(session)}\n\nWould you like to confirm your order? Type "confirm order" to complete it.`;

            } else {
                wasFallback = true;
                reply = "Please choose either Delivery or Pickup.";
            }

            // Handle delivery address.
        } else if (session.stage === "awaiting_address") {

            if (
                userText === "cancel" ||
                userText === "cancel order"
            ) {
                session.stage = "browsing";
                session.deliveryMethod = null;

                reply = "Delivery setup cancelled. Your cart has been kept.";

            } else {
                session.deliveryAddress = text.trim();
                session.stage = "awaiting_confirmation";

                reply = `${formatCheckoutSummary(session)}\n\nWould you like to confirm your order? Type "confirm order" to complete it.`;
            }

            // Handle checkout confirmation.
        } else if (session.stage === "awaiting_confirmation") {

            if (
                userText === "no" ||
                userText.includes("cancel order") ||
                userText === "cancel"
            ) {
                session.stage = "browsing";
                session.deliveryMethod = null;
                session.deliveryAddress = "";

                reply = "Checkout cancelled. Your cart has been kept, so you can make changes or try again.";

            } else if (
                userText.includes("confirm order") ||
                userText === "confirm"
            ) {
                reply = `Your order has been confirmed!\n\n${formatCheckoutSummary(session)}`;

                session.order = [];
                session.stage = "browsing";
                session.deliveryMethod = null;
                session.deliveryAddress = "";

            } else {
                wasFallback = true;
                reply = 'Please type "confirm order" to complete your order, or "cancel" to cancel checkout.';
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
                session.stage = "awaiting_fulfillment";

                reply = "How would you like to receive your order?\n\nPlease choose Delivery or Pickup.";
            }

            // Remove an item.
        } else if (
            item &&
            (
                userText.includes("remove") ||
                userText.includes("delete")
            )
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

                    reply = `${item.name} has been removed from your cart.`;
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
        session.deliveryMethod = null;
        session.deliveryAddress = "";
    }

    return {
        handleMessage,
        resetConversation,
        session
    };
}

module.exports = { createConversationEngine };
