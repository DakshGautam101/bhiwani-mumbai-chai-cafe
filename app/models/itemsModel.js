// models/itemModel.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
});

const featuredSchema = new mongoose.Schema({
    heading: {
        type: String,
        // enum: ["Most Sold", "Best Offer", "Trending Now", "Recommended"],
        default: "Best Offer",
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number,
        default: function() {
            return this.price;
        }
    },
    description: { type: String, required: true },
    image: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    images: { type: Array, default: [] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    reviews: [reviewSchema],
    featured: [featuredSchema], 
    isFeatured: {
        type: Boolean,
        default: false
    }
});

export const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);
