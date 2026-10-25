function createSession() {
    return {
        order: [],
        stage: "browsing",
        fallbackCount: 0,
        conversationHistory: []
    };
}

function resetSession(session) {
    session.order = [];
    session.stage = "browsing";
    session.fallbackCount = 0;
    session.conversationHistory = [];

    return session;
}

module.exports = {
    createSession,
    resetSession
};