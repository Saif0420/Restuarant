const {getAllMenuItems} = require("../menu");

const intents ={
    greeting: [
        "hi", "hello", "hola", "hey", "servos", "annyeonghaseyo",
        "hallo", "ciao", "guten tag", "ni hao", "bonjour", "howdy"
    ],
    
    goodbye: [
        "bye", "ciao", 'servos', "goodbye", "ttyl", "talk to you later",
        "see ya!", "see you"
    ],

    thanks: [
        "thanks", "thank you", "danke", "danke schön", "vielen dank", "arigatou",
        "thank you so much", "gracias", "merci", "grazie", "obrigado", "dhanyawaad",
        "shukriya"
    ],

    help: [
        "help", "what can I do now?", "please", "how does ir work?", "help me order", 
        "can you help me please?"
    ],

    show_menu: [
        "menu", "show menu", "food options", "what do we have today?", 
        "what can I eat?", "what do you have?"
    ],

    show_burgers: [
        "burger menu", "burgers", "show burgers"
    ],

    show_pizza: [
        "pizza menu", "pizzas", "show pizza"
    ],

    show_pasta: [
        "pasta menu", "pastas", "show pasta"
    ],

    show_sides: [
        "side dishes", "snacks", "sides", "show sides"
    ],

    show_desserts: [
        "dessert menu", "desserts", "sweets", 'show desserts'
    ],

    show_drinks: [
        "drinks menu", "drinks", "beverages", "show drinks"
    ],

    ask_price: [
        "price", "cost", "how much", "how much does it cost", "what does it cost"
    ],

    recommend_food: [
        "recommend", "suggest something", "what should I eat", "best food", "surprise me",
        "what's special", "what do you recommend?", "famous food", "popular food"
    ],

    vegetarian: [
        "vegetarian", "veg", "vegetarian food", "meat free", "without meat"
    ],

    vegan: [
        "vegan", "vegan food", "plant-based", "dairy-free", "without animal products"
    ],

    gluten_free: [ 
        "gluten free", "without gluten", "no gluten", "gluten frei"
    ],

    spicy_food: [
        "spicy", "spicy food", "hot", "extra hot", "chilli", "red hot", "extra spicy"
    ],

    mild_food: [
        "less spicy", "mild spice", "without spice", "no chilli", "not spicy"
    ],

    start_order: [
        "I want to order", "order start", "start order", "begin order", 
        "I would like to order", "I want to place an order", "place my order", 
        "order please", "I want to buy", "I am ready to order"
    ],

    add_items: [
        "add", "I want", "add this to the cart", "add this also", "give me", 
        "get me", "order", "I would like"
    ],

    remove_items: [
        "remove", "delete", "take off the cart", "remove from my order", 
        "delete this from my order"
    ],

    change_quantity: [
        "change quantity", "make it", "change the number", "increase quantity", 
        "decrease quantity"
    ],

    view_order: [
        "my order", "view order", "open my order", "I want to see my order",
        "show my order", "what did I order", "order summary", "my cart", 
        "shopping cart", "can I see my cart?"
    ],

    clear_order: [
        "clear order", "empty cart", "remove everything", "clear my cart",
        "cancel everything in my order", "delete everything in my order"
    ],

    checkout: [
        "checkout", "check out", "complete my order", "finish my order", 
        "proceed to payment"
    ],

    cancel_order: [
        "cancel my order", "cancel", "I don't want my order"
    ],

    delivery: [
        "delivery", "deliver to me", "deliver it to me", "home delivery", 
        "deliver my food", "delivery address", "can you deliver my order"
    ],

    pickup: [
        "pickup", "pick up", "collect my order", "I want to pickup my order",
        "takeaway", "take out"
    ],

    delivery_time: [
        "delivery time", "how long will it take", "arrival time", 
        "what will it arrive", "at what time will it get delivered"
    ],

    payment_methods: [
        "payment methods", "bezahlen", "how can i pay", "payment options",
        "ways to pay", "Ich möchte bezahlen"
    ],

    cash_payments: [
        "I would like to pay with cash", "pay cash", "mit bar", "cash"
    ],

    card_payments: [
        "credit card", "debit card", "mit credit karte", "mit karte", 
        "mit debit karte", "card payment", "e-card"
    ],

    order_status: [
        "order status", "what is the status of my order", "where is my order",
        "track my order", "has my order arrived", "update about my order"
    ],

    opening_hours: [
        "opening hours", "when do you open", "when do you close", "are you open"
    ],

    location: [
        "location", "where is the restaurant located", "restaurant address",
        "where are you located", "where are you", "where is the restaurant"
    ],

    allergy_information: [
        "allergy", "allergies", "allergen", "allergens", "allergic"
    ],

    nutrition_information:[
        "calories", "nutrition", "nutritional info", "nutritional information",
        "nutritional value", "protein content", "fat content", "fibre content",
        "carbohydrates", "carbs"
    ],

    customer_support: [
        "customer", "customer support", "support", "speak to someone", 
        "talk to an employee", "can I talk to someone", 
        "can someone help me with my order"
    ],

    restart: [
        "restart", "start again", "reset conversation", "start over", 
        "start from beginning", "begin again", "I want to start again",
        "I want to restart the conversation", "restart please", 
        "reset everything", "reset"
    ]
};

function normalizeText(message) {
    return message
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function containsPhrase(text, phrase) {
    const normalizePhrase = normalizeText(phrase);

    //This will match complete phrases and not accidental parts of longer words
    const escaped = normalizePhrase.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

    const pattern = new RegExp(
        `(^|\\s)${escaped}(?=\\s|$)`,
        "u"
    );

    return pattern.test(text);
}

function detectIntent(message) {
    const text = normalizeText(message);

    if (!text) {
        return "empty_message";
    }

    const matches = [];

    for (const [intents, phrases] of Object.entries(intents)) {
        for (const phrase of phrases) {
            if (containsPhrase(text, phrase)) {
                matches.push({
                    intent, 
                    phrase, 
                    length: normalizeText(phrase).length
                });
            }
        }
    }

    // will prefer the most specific matching phrase
    matches.sort((a, b) => b.length -a.length);

    return matches.length > 0
        ? matches[0].intent
        : "unknown";
}

function detectMenuItems(message) {
    const text = normalizeText(message);
    const foundItems = [];

    for (const item of getAllMenuitems()) {
        const phrases = [item.name, ...item.aliases];

        const matched = phrases.some((phrase) => 
            containsPhrase(text, phrase)
        );
        
        if (matched) {
            foundItems.push({
                id: item.id,
                name: item.name,
                price: item.price
            });
        }
    }

    return foundItems;
}

function detectQuantity(message) {
    const text = normalizeText(message);

    const digitMatch = text.match(
        /\(\d+)\s*(?:x|pieces?|pcs|orders?)?\b/
    );

    if (digitMatch) {
        const quantity = Number(digitMatch[1]);

        if (quantity >= 1 && quantity <= 99) {
            return quantity;
        } 
    }

    const wordNumbers = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten:10
    };

    for (const [word, number] of Object.entries(wordNumbers)) {
        if (containsPhrase(text, word)) {
            return number;
        }
    }

    return null;
}

