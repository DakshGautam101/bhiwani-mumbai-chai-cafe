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

        user.cart.push(itemId);
        await user.save();

        return new Response(JSON.stringify(user.cart), { status: 200 });

    } catch (error) {
        console.error("Error in cart api:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}