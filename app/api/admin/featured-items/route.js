import { connectDB } from "@/lib/ConnectDB";
import { Item } from "@/app/models/itemsModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    
    const featuredItems = await Item.find({ isFeatured: true })
      .select('name price description image featured')
      .sort({ 'featured.createdAt': -1 });

    return NextResponse.json({ items: featuredItems });
  } catch (error) {
    console.error("Featured items fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured items" },
      { status: 500 }
    );
  }
}