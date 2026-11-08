
function getFallbackResponse(session) {
    session.fallbackCount += 1;

    if (session.fallbackCount >= 3) {
        session.stage = "browsing";
        session.fallbackCount = 0;

        // Preserve the cart when restarting the conversation.
        session.deliveryMethod = null;
        session.deliveryAddress = "";

        session.previousDeliveryMethod = null;
        session.previousDeliveryAddress = "";

        return "I'm having trouble understanding. Let's start again! Your cart has been kept. You can type 'menu' to browse our menu or 'cart' to view your order.";
    }

    if (session.fallbackCount === 2) {
        return "I'm still not sure what you mean. You can ask me about our menu, add an item, view your cart, or checkout.";
    }

    return "Sorry, I didn't quite understand that. Try asking about burgers, pizza, pasta, drinks, or your cart.";
}

function resetFallbackCount(session) {
    session.fallbackCount = 0;
}

module.exports = {
    getFallbackResponse,
    resetFallbackCount
};
