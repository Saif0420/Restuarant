
function createSession() {
    return {
        order: [],
        stage: "browsing",
        fallbackCount: 0,
        conversationHistory: [],

        deliveryMethod: null,
        deliveryAddress: "",

        previousDeliveryMethod: null,
        previousDeliveryAddress: ""
    };
}

function resetSession(session) {
    session.order = [];
    session.stage = "browsing";
    session.fallbackCount = 0;
    session.conversationHistory = [];

    session.deliveryMethod = null;
    session.deliveryAddress = "";

    session.previousDeliveryMethod = null;
    session.previousDeliveryAddress = "";

    return session;
}

module.exports = {
    createSession,
    resetSession
};
