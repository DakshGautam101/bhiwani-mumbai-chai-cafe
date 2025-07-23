import { connectDB } from "@/lib/ConnectDB";
import { User } from "@/app/models/userModel";


export async function POST(request) {
    try {
        await connectDB();
        const { userId } = await request.json();
        const user = await User.findById(userId);
        if (!user) {
            return new Response("User not found", { status: 404, headers: { "Content-Type": "application/json" } });
        }
        user.cart = [];
        await user.save();
        return new Response(JSON.parse("Cart cleared"), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Error in clearCart API:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
