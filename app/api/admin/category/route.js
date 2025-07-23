import { Category } from "@/app/models/categoryModel";
import { connectDB } from "@/lib/ConnectDB";
import { Item } from "@/app/models/itemsModel";

export async function GET() {
    try {
        await connectDB();
        const Categories = await Category.find();

        const enriched = await Promise.all(
            Categories.map(async (cat) => {
                const itemCount = cat.items?.length || 0;
                return { ...cat._doc, itemsCount: itemCount };
            })
        );

        return new Response(JSON.stringify(enriched), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch categories" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const data = await req.json();
        const category = new Category(data);
        await category.save();
        return new Response(JSON.stringify(category), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error in creating category:", error);
        return new Response(JSON.stringify({ error: "Failed to create category" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}