import { Item } from "@/app/models/itemsModel";
import { connectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const item = await Item.findById(id)
      .populate('category')
      .select('name description price image images category rating reviews inStock');

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    // Debug logging
    console.log('Found item:', {
      id: item._id,
      name: item.name,
      category: item.category?.name
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Get Item API Error:', error);
    return NextResponse.json(
      { error: "Failed to fetch item", details: error.message },
      { status: 500 }
    );
  }
}
