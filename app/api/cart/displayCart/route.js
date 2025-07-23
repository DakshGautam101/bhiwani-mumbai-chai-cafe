import { connectDB } from "@/lib/ConnectDB";
import { User } from "@/app/models/userModel";

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        if (!userId) {
            return new Response("User ID is required", { status: 400 });
        }
        const user = await User.findById(userId).populate("cart");
        if (!user) {
            return new Response("User not found", { status: 404 });
        }
        return new Response(JSON.stringify(user.cart), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in displayCart API:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}