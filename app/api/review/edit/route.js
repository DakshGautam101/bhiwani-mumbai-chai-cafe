import { User } from "@/app/models/userModel";
import jwt from "jsonwebtoken";

export async function PUT(req) {
    try {
        const { idx, rating, review } = await req.json();
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        user.reviews[idx].rating = rating;
        user.reviews[idx].review = review;
        await user.save();
        return new Response(JSON.stringify({ message: "Review updated successfully", user }), { status: 200 });
    } catch (error) {
        console.error("Error in PUT request of editing review:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}