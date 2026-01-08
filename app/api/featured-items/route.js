import { connectDB } from "@/lib/ConnectDB";
import { Item } from "@/app/models/itemsModel";
import { NextResponse } from "next/server";



export async function POST(req) {
    try {
        await connectDB();

        const { itemId, heading, discount } = await req.json();

        
        if (!itemId || !heading || discount === undefined) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        
        const item = await Item.findById(itemId);
        if (!item) {
            return NextResponse.json(
                { success: false, message: "Item not found" },
                { status: 404 }
            );
        }

        
        item.featured.push({
            heading,
            discount,
        });

        item.isFeatured = true;

        await item.save();

        return NextResponse.json({
            success: true,
            message: "Item added to featured successfully",
            data: item,
        });
    } catch (error) {
        console.error("Error adding featured item:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}


export async function GET() {
  try {
    await connectDB();
    
    const featuredItems = await Item.find({ 
      isFeatured: true,
      inStock: true 
    })
    .select('name price description image category featured rating')
    .sort({ 'featured.createdAt': -1 });

    return NextResponse.json({ items: featuredItems });
  } catch (error) {
    console.error('Featured items fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch featured items" },
      { status: 500 }
    );
  }
}
