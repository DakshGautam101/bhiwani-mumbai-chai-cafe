import { Item } from "@/app/models/itemsModel";
import { connectDB } from "@/lib/ConnectDB";

export async function GET(request) {
    try {
        await connectDB();
        const count = await Item.countDocuments();
        return new Response(JSON.stringify({ itemsCount: count }), { status: 200 });
    } catch (error) {
        console.error('Error fetching items count:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch items count' }), { status: 500 });
    }
}
