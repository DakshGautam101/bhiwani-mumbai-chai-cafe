import { connectDB } from "@/lib/ConnectDB";
import { Item } from "@/app/models/itemsModel";

export const GET = async (req, res) => {
    try {
        await connectDB();
        const items = await Item.find({}).populate('category', 'name image description');
        return new Response(JSON.stringify(items), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Error fetching items:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch items" }), { status: 500 });
    }
}