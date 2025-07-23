import { connectDB } from "@/lib/ConnectDB";
import { User } from "@/app/models/userModel";

export async function POST(request) {
  try {
    await connectDB();
    const { userId, itemId, quantity } = await request.json();

    const user = await User.findById(userId);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Remove all instances of itemId from cart
    user.cart = user.cart.filter(id => id.toString() !== itemId);

    // Add itemId 'quantity' times
    for (let i = 0; i < quantity; i++) {
      user.cart.push(itemId);
    }

    await user.save();
    await user.populate("cart");

    return new Response(JSON.stringify(user.cart), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}