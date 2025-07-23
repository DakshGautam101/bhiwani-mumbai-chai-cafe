import mongoose from "mongoose";
import { Item } from "../models/itemsModel.js";
import { Category } from "../models/categoryModel.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); 

export const seedItems = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables.");
        }
        await mongoose.connect(process.env.MONGODB_URI);

        await Item.deleteMany({});

        // Fetch all categories and build a name-to-ObjectId map
        const categories = await Category.find({});
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });

        const items = [
            {
                name: "Mumbai Amruttulya",
                price: 12,
                description: "A traditional Mumbai-style tea made with a blend of spices and milk.",
                image: "/resources/assets/mumbai-amrittulya.jpg",
                category: categoryMap["Hot Chai - with Milk"]
            },
            {
                name: "Mumbai Masala Chai",
                price: 15,
                description: "A spicy tea made with a blend of aromatic spices.",
                image: "/resources/assets/chai-chai.jpg",
                category: categoryMap["Hot Chai - with Milk"]
            },
            {
                name: "Ashwagandha Chai",
                price: 20,
                description: "A calming tea made with ashwagandha and spices.",
                image: "/resources/assets/ashwagandha_chai.jpg",
                category: categoryMap["Hot Chai - with Milk"]
            },
            {
                name: "Dum Chai",
                price: 20,
                description: "A strong tea brewed with spices and milk.", 
                image: "/resources/assets/nashta.jpg",
                category: categoryMap["Hot Chai - with Milk"]
            },
            {
                name: "Gudwali Chai Masala",
                price: 20,
                description: "A sweet and spicy tea made with jaggery.",
                image: "/resources/assets/gudwali_chai.jpg",
                category: categoryMap["Hot Chai - with Milk"]
            },
            {
                name: "Lemon Grass Chai",
                price: 20,
                description: "A refreshing tea made with lemongrass and spices.",
                image: "/resources/assets/lemongrass_chai.jpg",
                category: categoryMap["Hot Chai - with Milk"]
            },
            {
                name: "Sounf Wali Chai",
                price: 20,
                description: "A fragrant tea made with fennel seeds.",
                image: "/resources/assets/sounf_chai.jpg",
                category: categoryMap["Hot Chai - with Milk"]
            },
            {
                name: "Tulsi Chai",
                price: 20,
                description: "A herbal tea made with holy basil.",
                image: "/resources/assets/tulsi_chai.jpg",
                category: categoryMap["Hot Chai - with Milk"]
            },
            {
                name: "Curry Leaves Chai",
                price: 20,
                description: "A unique tea made with curry leaves.",
                image: "/resources/assets/curry_leaves_tea.jpg",
                category: categoryMap["Hot Chai - with Milk"]
            },
            {
                name: "Lemon Black Tea",
                price: 20,
                description: "A zesty tea made with lemon and black tea.",
                image: "/resources/assets/lemon-tea.jpg",
                category: categoryMap["Hot Chai - without Milk"]
            },
            {
                name: "Green Tea",
                price: 20,
                description: "A healthy tea made with green tea leaves.",
                image: "/resources/assets/green-tea.jpg",
                category: categoryMap["Hot Chai - without Milk"]
            },
            {
                name: "Pink Tea",
                price: 30,
                description: "A creamy tea made with milk and spices.",
                image: "/resources/assets/chai.jpg",
                category: categoryMap["Hot Chai - with Milk"]
            },
            {
                name: "Kashmiri Kahwa",
                price: 30,
                description: "A fragrant tea made with saffron and spices.",
                image: "/resources/assets/kahwa.webp",
                category: categoryMap["Hot Chai - with Milk"]
            },
            {
                name: "Hot Milk",
                price: 25,
                description: "A comforting cup of hot milk.",
                image: "/resources/assets/hot_milk.jpg",
                category: categoryMap["Other Beverages"]
            },
            {
                name: "Ukala",
                price: 30,
                description: "A traditional herbal tea from the mountains.",
                image: "/resources/assets/ukala.jpg",
                category: categoryMap["Other Beverages"]
            },
            {
                name: "Boost",
                price: 30,
                description: "A strong tea with a boost of energy.",
                image: "/resources/assets/boost.png",
                category: categoryMap["Other Beverages"]
            },
            {
                name: "Matcha Latte",
                price: 30,
                description: "A creamy latte made with matcha.",
                image: "/resources/assets/matcha_latte.jpg",
                category: categoryMap["Hot & Flavoured Coffee"]
            },
            {
                name: "South Indian Coffee",
                price: 20,
                description: "A strong coffee made with South Indian filter coffee.",
                image: "/resources/assets/south_indian_coffee.jpg",
                category: categoryMap["Hot & Flavoured Coffee"]
            },
            {
                name: "Elaichi Coffee",
                price: 25,
                description: "A fragrant coffee made with cardamom.",
                image: "/resources/assets/elaichi_coffee.jpg",
                category: categoryMap["Hot & Flavoured Coffee"]
            },
        ];

        await Item.insertMany(items);
        console.log("Items seeded successfully!");
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error seeding items:", error);
        await mongoose.disconnect();
    }
}

seedItems();    