import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import { Category } from "../models/categoryModel.js";
import { Item } from "../models/itemsModel.js";

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Category.deleteMany({});
    await Item.deleteMany({});

     const items = [
            {
                name: "Mumbai Amruttulya",
                price: 12,
                description: "A traditional Mumbai-style tea made with a blend of spices and milk.",
                image: "/resources/assets/mumbai-amrittulya.jpg",
                category: "Hot Chai - with Milk"
            },
            {
                name: "Mumbai Masala Chai",
                price: 15,
                description: "A spicy tea made with a blend of aromatic spices.",
                image: "/resources/assets/chai-chai.jpg",
                category: "Hot Chai - with Milk"
            },
            {
                name: "Ashwagandha Chai",
                price: 20,
                description: "A calming tea made with ashwagandha and spices.",
                image: "/resources/assets/ashwagandha_chai.jpg",
                category: "Hot Chai - with Milk"
            },
            {
                name: "Dum Chai",
                price: 20,
                description: "A strong tea brewed with spices and milk.",
                image: "/resources/assets/dum_chai.jpg",
                category: "Hot Chai - with Milk"
            },
            {
                name: "Gudwali Chai Masala",
                price: 20,
                description: "A sweet and spicy tea made with jaggery.",
                image: "/resources/assets/gudwali_chai.jpg",
                category: "Hot Chai - with Milk"
            },
            {
                name: "Lemon Grass Chai",
                price: 20,
                description: "A refreshing tea made with lemongrass and spices.",
                image: "/resources/assets/lemongrass_chai.jpg",
                category: "Hot Chai - with Milk"
            },
            {
                name: "Sounf Wali Chai",
                price: 20,
                description: "A fragrant tea made with fennel seeds.",
                image: "/resources/assets/sounf_chai.jpg",
                category: "Hot Chai - with Milk"
            },
            {
                name: "Tulsi Chai",
                price: 20,
                description: "A herbal tea made with holy basil.",
                image: "/resources/assets/tulsi_chai.jpg",
                category: "Hot Chai - with Milk"
            },
            {
                name: "Curry Leaves Chai",
                price: 20,
                description: "A unique tea made with curry leaves.",
                image: "/resources/assets/curry_leaves_tea.jpg",
                category: "Hot Chai - with Milk"
            },
            {
                name: "Lemon Black Tea",
                price: 20,
                description: "A zesty tea made with lemon and black tea.",
                image: "/resources/assets/lemon-tea.jpg",
                category: "Hot Chai - without Milk"
            },
            {
                name: "Green Tea",
                price: 20,
                description: "A healthy tea made with green tea leaves.",
                image: "/resources/assets/green-tea.jpg",
                category: "Hot Chai - without Milk"
            },
            {
                name: "Pink Tea",
                price: 30,
                description: "A creamy tea made with milk and spices.",
                image: "/resources/assets/chai.jpg",
                category: "Hot Chai - with Milk"
            },
            {
                name: "Kashmiri Kahwa",
                price: 30,
                description: "A fragrant tea made with saffron and spices.",
                image: "/resources/assets/kahwa.webp",
                category: "Hot Chai - with Milk"
            },
            {
                name: "Hot Milk",
                price: 25,
                description: "A comforting cup of hot milk.",
                image: "/resources/assets/hot_milk.jpg",
                category: "Other Beverages"
            },
            {
                name: "Ukala",
                price: 30,
                description: "A traditional herbal tea from the mountains.",
                image: "/resources/assets/ukala.jpg",
                category: "Other Beverages"
            },
            {
                name: "Boost",
                price: 30,
                description: "A strong tea with a boost of energy.",
                image: "/resources/assets/boost.png",
                category: "Other Beverages"
            },
            {
                name: "Matcha Latte",
                price: 30,
                description: "A creamy latte made with matcha.",
                image: "/resources/assets/matcha_latte.jpg",
                category: "Hot & Flavoured Coffee"
            },
            {
                name: "South Indian Coffee",
                price: 20,
                description: "A strong coffee made with South Indian filter coffee.",
                image: "/resources/assets/south_indian_coffee.jpg",
                category: "Hot & Flavoured Coffee"
            },
            {
                name: "Elaichi Coffee",
                price: 25,
                description: "A fragrant coffee made with cardamom.",
                image: "/resources/assets/elaichi_coffee.jpg",
                category: "Hot & Flavoured Coffee"
            },
        ]

    const createdItems = await Item.insertMany(items);

    const grouped = {};
    createdItems.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item._id);
    });

    const categories = [
      {
        name: "Hot Chai - with Milk",
        image: "/resources/assets/chai-milk.jpg",
        description: "A selection of our finest hot chai with milk, brewed to perfection.",
        items: grouped["Hot Chai - with Milk"]
      },
      {
        name: "Hot Chai - without Milk",
        image: "/resources/assets/ukala.jpg",
        description: "A selection of our finest hot chai without milk, brewed to perfection.",
        items: grouped["Hot Chai - without Milk"]
      },
      {
        name: "Other Beverages",
        image: "/resources/assets/black-coffee.jpg",
        description: "A selection of our finest other beverages, brewed to perfection.",
        items: grouped["Other Beverages"]
      },
      {
        name: "Hot & Flavoured Coffee",
        image: "/resources/assets/coffee-aesthetic.jpg",
        description: "A selection of our finest hot & flavoured coffee, brewed to perfection.",
        items: grouped["Hot & Flavoured Coffee"]
      }
    ];

    const createdCategories = await Category.insertMany(categories);

    console.log("✅ Categories and items seeded successfully!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding:", err);
  }
};

seedCategories();
