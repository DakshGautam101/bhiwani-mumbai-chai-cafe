import mongoose from "mongoose";
import '../app/models/categoryModel.js'
import '../app/models/itemsModel.js'
import '../app/models/userModel.js'

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
}
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
};