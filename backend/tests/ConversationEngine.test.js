
const test = require("node:test");
const assert = require("node:assert/strict");

const {
    createConversationEngine
} = require("../src/modules/ConversationEngine");

test("adds menu items and calculates the cart total", () => {
    const bot = createConversationEngine();

    bot.handleMessage("add 2 Pepperoni Pizza");
    bot.handleMessage("add 1 Cheeseburger");

    assert.equal(bot.session.order.length, 2);
    assert.equal(bot.session.order[0].quantity, 2);
    assert.equal(bot.session.order[1].quantity, 1);

    const total = bot.session.order.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    assert.equal(total, 29.97);
});

test("removes the requested quantity from the cart", () => {
    const bot = createConversationEngine();

    bot.handleMessage("add 3 Cheeseburger");
    bot.handleMessage("remove 1 Cheeseburger");

    assert.equal(bot.session.order.length, 1);
    assert.equal(bot.session.order[0].quantity, 2);
});

test("rejects an invalid delivery address", () => {
    const bot = createConversationEngine();

    bot.handleMessage("add Pepperoni Pizza");
    bot.handleMessage("checkout");
    bot.handleMessage("delivery");

    const result = bot.handleMessage("abc");

    assert.match(result.text, /valid delivery address/i);
    assert.equal(bot.session.stage, "awaiting_address");
    assert.equal(bot.session.deliveryAddress, "");
});

test("accepts a valid delivery address and confirms the order", () => {
    const bot = createConversationEngine();

    bot.handleMessage("add Pepperoni Pizza");
    bot.handleMessage("checkout");
    bot.handleMessage("delivery");

    bot.handleMessage("Musterstrasse 10, Deggendorf");

    assert.equal(bot.session.stage, "awaiting_confirmation");
    assert.equal(
        bot.session.deliveryAddress,
        "Musterstrasse 10, Deggendorf"
    );

    const result = bot.handleMessage("yes");

    assert.match(result.text, /order has been confirmed/i);
    assert.equal(bot.session.order.length, 0);
    assert.equal(bot.session.stage, "browsing");
});

test("accepts pickup and confirms the order", () => {
    const bot = createConversationEngine();

    bot.handleMessage("add Cheeseburger");
    bot.handleMessage("checkout");
    bot.handleMessage("pickup");

    assert.equal(bot.session.deliveryMethod, "pickup");
    assert.equal(bot.session.stage, "awaiting_confirmation");

    const result = bot.handleMessage("yes please");

    assert.match(result.text, /order has been confirmed/i);
    assert.equal(bot.session.order.length, 0);
});

test("restores pickup after cancelling a switch to delivery", () => {
    const bot = createConversationEngine();

    bot.handleMessage("add Pepperoni Pizza");
    bot.handleMessage("checkout");
    bot.handleMessage("pickup");
    bot.handleMessage("change method");
    bot.handleMessage("delivery");

    bot.handleMessage("cancel");

    assert.equal(bot.session.deliveryMethod, "pickup");
    assert.equal(bot.session.stage, "awaiting_confirmation");
    assert.equal(bot.session.order.length, 1);
});

test("restores the previous delivery address after cancelling a switch to pickup", () => {
    const bot = createConversationEngine();

    bot.handleMessage("add Pepperoni Pizza");
    bot.handleMessage("checkout");
    bot.handleMessage("delivery");
    bot.handleMessage("Musterstrasse 10, Deggendorf");
    bot.handleMessage("change method");
    bot.handleMessage("pickup");

    bot.handleMessage("cancel change");

    assert.equal(bot.session.deliveryMethod, "delivery");
    assert.equal(
        bot.session.deliveryAddress,
        "Musterstrasse 10, Deggendorf"
    );
    assert.equal(bot.session.stage, "awaiting_confirmation");
});

test("hard fallback preserves the cart during checkout", () => {
    const bot = createConversationEngine();

    bot.handleMessage("add Pepperoni Pizza");
    bot.handleMessage("checkout");

    bot.handleMessage("something random");
    bot.handleMessage("another random message");

    const result = bot.handleMessage("nonsense message");

    assert.match(result.text, /cart has been kept/i);
    assert.equal(bot.session.stage, "browsing");
    assert.equal(bot.session.fallbackCount, 0);
    assert.equal(bot.session.order.length, 1);
});

test("hard fallback works during order confirmation", () => {
    const bot = createConversationEngine();

    bot.handleMessage("add Cheeseburger");
    bot.handleMessage("checkout");
    bot.handleMessage("pickup");

    bot.handleMessage("something random");
    bot.handleMessage("another random message");
    bot.handleMessage("nonsense message");

    assert.equal(bot.session.stage, "browsing");
    assert.equal(bot.session.fallbackCount, 0);
    assert.equal(bot.session.order.length, 1);
    assert.equal(bot.session.order[0].name, "Cheeseburger");
});

test("reset clears the conversation and session data", () => {
    const bot = createConversationEngine();

    bot.handleMessage("add Pepperoni Pizza");
    bot.handleMessage("checkout");
    bot.handleMessage("delivery");

    bot.resetConversation();

    assert.equal(bot.session.order.length, 0);
    assert.equal(bot.session.stage, "browsing");
    assert.equal(bot.session.fallbackCount, 0);
    assert.equal(bot.session.deliveryMethod, null);
    assert.equal(bot.session.deliveryAddress, "");
    assert.equal(bot.session.conversationHistory.length, 0);
});
