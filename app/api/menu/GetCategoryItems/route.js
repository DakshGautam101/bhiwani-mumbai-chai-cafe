import { connectDB } from "@/lib/ConnectDB";
import { Item } from "@/app/models/itemsModel";
import { Category } from "@/app/models/categoryModel";

export async function GET(req) {
    try {
        await connectDB();
        
        const url = new URL(req.url);
        const categoryId = url.searchParams.get("categoryId");

        if (!categoryId) {
            return new Response(JSON.stringify({ error: "categoryId is required" }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Find the category first to get its name
        const category = await Category.findById(categoryId);
        if (!category) {
            return new Response(JSON.stringify({ error: "Category not found" }), { 
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Now find items using the category name
        const items = await Item.find({ category: category._id });

        // Debug logging
        console.log('Category lookup:', {
            categoryId,
            categoryName: category.name,
            itemsFound: items.length
        });

        return new Response(JSON.stringify(items), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ 
            error: "Failed to fetch items", 
            details: error.message,
            category: category ? category.name : null
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}