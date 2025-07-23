import { connectDB } from "@/lib/ConnectDB";
import { Category } from "@/app/models/categoryModel";

export const GET = async (req, res) => {
    try {
        await connectDB();
        const categories = await Category.find({}).populate({
            path: 'items',
            select: 'name price description image images inStock rating reviews'
        });
        return new Response(JSON.stringify(categories), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch categories" }), { status: 500 });
    }
}