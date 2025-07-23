import { Item } from "@/app/models/itemsModel";
import { connectDB } from "@/lib/ConnectDB";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;  // Changed from itemId to id to match the URL parameter

    const item = await Item.findById(id).populate('category','name');
    if (!item) {
      return new Response("Item not found", { status: 404 });
    }

    return new Response(JSON.stringify(item), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch item" }), { status: 500 });
  }
}
