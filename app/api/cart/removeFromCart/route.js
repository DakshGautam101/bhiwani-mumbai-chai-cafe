import { connectDB } from "@/lib/ConnectDB";
import { User } from "@/app/models/userModel";

export async function POST(request) {
try {
    await connectDB();
    const { userId, itemId } = await request.json();
    const user = await User.findById(userId);
    if (!user) {
        return new Response("User not found", { status: 404 });
    }
    user.cart = user.cart.filter(item => item.toString() !== itemId);
    await user.save();
    return new Response(JSON.stringify({ message: "Item removed from cart" }), { status: 200 });
} catch (error) {
    console.error("Error removing item from cart:", error);
    return new Response("Internal Server Error", { status: 500 });
}
}