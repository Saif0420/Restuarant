const { createSession, resetSession } = require("./SessionState");

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

    const itemLines = items.map((item) =>
        `${item.name} - €${item.price.toFixed(2)}`
    );

    return `${title} Menu:\n${itemLines.join("\n")}`;
}

function findMenuItem(itemText) {
    const searchText = itemText.toLowerCase();

    for (const [category, items] of Object.entries(MENU)) {
        const item = items.find(menuItem => {
            const name = menuItem.name.toLowerCase();
            return searchText.includes(name);
        });

        if (item) {
            return { ...item, category };
        }
    }

    return null;
}

function formatOrder(order) {
    if (order.length === 0) {
        return "Your cart is empty. Ask me to add something from our menu!";
    }

    const lines = order.map(item =>
        `${item.quantity} x ${item.name} - €${(item.price * item.quantity).toFixed(2)}`
    );

    const total = order.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return `Your ByteBites Order:\n${lines.join("\n")}\nTotal: €${total.toFixed(2)}`;
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

        const item = findMenuItem(userText);

        if (userText.includes("menu")) {
            reply = "Welcome to ByteBites! Choose a category: burgers, pizza, pasta, sides, drinks, or desserts.";
        } else if (item) {
            const existingItem = session.order.find(
                (orderItem) => orderItem.name === item.name
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                session.order.push({
                    name: item.name,
                    price: item.price,
                    quantity: 1
                });
            }

            reply = `${item.name} added to your cart. ${formatOrder(session.order)}`;
        } else if (
            userText.includes("checkout") ||
            userText.includes("check out") ||
            userText.includes("complete my order")
        ) {
            if (session.order.length === 0) {
                reply = "Your cart is empty. Add something from our menu before checkout.";
            } else {
                reply = `${formatOrder(session.order)}\n\nWould you like to confirm this order? Type "confirm order" to complete it.`;
                session.stage = "awaiting_confirmation";
            }
        } else if (
            session.stage === "awaiting_confirmation" &&
            (userText.includes("cancel order") || userText === "no")
        ) {
            reply = "Checkout cancelled. Your cart has been kept, so you can make changes or try again.";
            session.stage = "browsing";
        } else if (
            session.stage === "awaiting_confirmation" &&
            userText.includes("confirm order")
        ) {
            reply = `Your order has been confirmed!\n\n${formatOrder(session.order)}`;
            session.order = [];
            session.stage = "browsing";
        } else if (userText.includes("cart") || userText.includes("order summary")) {
            reply = formatOrder(session.order);
        } else if (userText.includes("clear order") || userText.includes("empty cart")) {
            session.order = [];
            reply = "Your cart has been cleared.";
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
        } else if (userText.includes("hello") || userText.includes("hi")) {
            reply = "Hey! Welcome to ByteBites. Would you like to see our menu?";
        } else {
            reply = "I can help you browse our menu. Try asking for burgers, pizza, pasta, sides, drinks, or desserts.";
        }

        session.conversationHistory.push(
            { sender: "user", text: text.trim(), timestamp },
            { sender: "bot", text: reply, timestamp: new Date().toISOString() }
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