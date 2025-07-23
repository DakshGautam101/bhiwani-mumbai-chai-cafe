import { User } from "@/app/models/userModel";
import jwt from "jsonwebtoken";

export async function DELETE(req){
    try {
        const {idx} = await req.json();
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        user.reviews.splice(idx, 1);
        await user.save();
        return new Response(JSON.stringify({message: "Review deleted successfully", user}), {status: 200});
    } catch (error) {
        console.error("Error in DELETE request of deleting review:", error);
        return new Response(JSON.stringify({message: "Internal Server Error"}), {status: 500});
    }
}