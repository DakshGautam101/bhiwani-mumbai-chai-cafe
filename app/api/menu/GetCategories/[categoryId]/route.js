import { Category } from "@/app/models/categoryModel";
import { connectDB } from "@/lib/ConnectDB";

export async function GET(req, { params }) {
    try {
        const { categoryId } = params; 
        await connectDB();
        const category = await Category.findById(categoryId);
        if (!category) {
            return new Response("Category not found", { status: 404 });
        }
        return new Response(JSON.stringify(category), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch category" }), { status: 500 });
    }
}