import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dlpzs4eyw/image/upload/v1750172211/6596121_nab8ff.png",
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user", // ✅ Add this line
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    orders: {
        type: Array,
        default: [],
        items: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
        }
    },
    address: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        required: true,
    },
    reviews: {
        type: Array,
        default: [],
        rating: {
            type: Number,
            default: 0,
        },
    },

});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
