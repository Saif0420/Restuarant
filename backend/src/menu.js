const menu = {
    burgers: [
        {
            id: "classic_chicken_burger",
            name: "Classic Chicken Burger",
            price: 3.50,
            aliases: ["classic burger", "chicken burger"],
            dietary: ["non-vegetarian"]
        },
        {
            id: "crispy_chicken_burger",
            name: "Crispy Chicken Burger",
            price: 4.50,
            aliases: ["crispy burger", "crispy chicken"],
            dietary: ["non-vegetarian"]
        },
        {
            id: "veggie_burger",
            name: "Veggie Burger",
            price: 4.50,
            aliases: ["vegetarian burger", "vegan chicken"],
            dietary: ["vegetarian"],
            vegan: false
        },
        {
            id: "double_cheese_burger",
            name: "Double Cheese Burger",
            price: 6.50,
            aliases: ["double cheeseburger", "cheeseburger"],
            dietary: ["non-vegetarian"]
        },
        {
            id: "spicy_panner_burger",
            name: "Spicy Paneer Burger",
            price: 8.50,
            aliases: ["paneer burger", "spicy burger"],
            dietary: ["vegetarian"]
        },
    ],

    pizza:[
        {
            id: "margherita",
            name: "Margherita Pizza",
            price: 8.99,
            aliases: ["margherita", "cheese pizza"],
            dietary: ["vegetarian"]
        },
        {
            id: "veggie_supreme",
            name: "Veggie Supreme Pizza",
            price: 10.99,
            aliases: ["veggie pizza", "vegetable pizza"],
            dietary: ["vegetarian"]
        },
        {
            id: "four_cheese",
            name: "Four Cheese Pizza",
            price: 10.99,
            aliases: ["paneer burger", "spicy burger"],
            dietary: ["vegetarian"]
        },
        {
            id: "panner_pizza",
            name: "Paneer Pizza",
            price: 12.99,
            aliases: ["paneer pizza"],
            dietary: ["vegetarian"]
        }
    ],

    pasta: [
        {
            id: "tomato_basil_pasta",
            name: "Tomato Basil",
            price: 8.49,
            aliases: ["tomato pasta", "basil pasta"],
            dietary: ["vegetarian"]
        },
        {
            id: "mushroom_pasta",
            name: "Mushroom Pasta",
            price: 8.49,
            aliases: ["mushroom pasta", "creamy mushroom"],
            dietary: ["vegetarian"]
        },
        {
            id: "chicken_salami_pasta",
            name: "Chicken Salami Pasta",
            price: 10.49,
            aliases: ["salami pasta", "chicken salami"],
            dietary: ["non-vegetarian"]
        },
        {
            id: "alfredo_pasta",
            name: "Alfredo Pasta",
            price: 12.49,
            aliases: ["alfredo pasta", "white sauce mushroom"],
            dietary: ["vegetarian"]
        },
        {
            id: "arrabbiata",
            name: "Spicy Arrabiata Pasta",
            price: 10.49,
            aliases: ["spicy pasta", "arrabbiata"],
            dietary: ["vegetarian"]
        },
    ],

    sides: [
        {
            id: "french_fries",
            name: "French Fries",
            price: 3.49,
            aliases: ["fries", "french fries", "chips"],
            dietary: ["vegetarian", "vegan"]
        },
        {
            id: "onion_rings",
            name: "Onion Rings",
            price: 4.49,
            aliases: ["rings", "onion rings"],
            dietary: ["vegetarian"]
        },
        {
            id: "5er_chicken_nuggets",
            name: "5er Chicken Nuggets",
            price: 5.99,
            aliases: ["chicken nuggets", "five nuggets", "5 nuggets"],
            dietary: ["non-vegetarian"]
        },
        {
            id: "garlic_bread",
            name: "Garlic Bread",
            price: 4.99,
            aliases: ["bread", "garlic gread"],
            dietary: ["vegetarian"]
        }
    ],

    desserts: [
        {
            id: "brownie",
            name: "Brownie",
            price: 3.99,
            aliases: ["brownie", "chocolate brownie"],
            dietary: ["vegetarian"]
        },
        {
            id: "cheesecake",
            name: "Cheesecake",
            price: 5.99,
            aliases: ["cheesecake"],
            dietary: ["vegetarian"]
        },
        {
            id: "choco_lava_cake",
            name: "Choco Lava Cake",
            price: 3.99,
            aliases: ["lava cake", "choco lava cake", "chocolate cake"],
            dietary: ["vegetarian"]
        },
        {
            id: "ice_cream",
            name: "Ice Cream",
            price: 3.49,
            aliases: ["ice cream", "vanilla ice cream"],
            dietary: ["vegetarian"]
        }
    ],

    drinks: [
        {
            id: "water",
            name: "Water", 
            price: 1.49,
            aliases: ["water", "still water", "mineral water"],
            dietary: ["vegan", "vegetarian"]
        },
        {
            id: "cola",
            name: "Cola",
            price: 1.49,
            aliases: ["coke", "cola"],
            dietary: ["vegan", "vegetarian"]
        },
        {
            id: "orange_juice",
            name: "Orange Juice",
            price: 1.49,
            aliases: ["orange juice", "juice"],
            dietary: ["vegan", "vegetarian"]
        },
        {
            id: "apple_juice",
            name: "Apple Juice",
            price: 1.49,
            aliases: ["apple juice", "juice"],
            dietary: ["vegan", "vegetarian"]
        },
        {
            id: "lemonade",
            name: "Lemonade",
            price: 1.49,
            aliases: ["lemonade", "lemon juice", "juice"],
            dietary: ["vegan", "vegetarian"]
        },
        {
            id: "cappuccino",
            name: "Cappuccino",
            price: 2.49,
            aliases: ["cappuccino", "milk coffee"],
            dietary: ["vegetarian"]
        },
        {
            id: "iced_coffee",
            name: "Iced Coffee",
            price: 2.99,
            aliases: ["iced coffee", "ice coffee"],
            dietary: ["vegetarian"]
        },
    ]
};

