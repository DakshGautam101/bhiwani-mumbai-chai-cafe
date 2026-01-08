import { connectDB } from "@/lib/ConnectDB";
import { Item } from "@/app/models/itemsModel";
import { Category } from "@/app/models/categoryModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // First verify if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Find items by category ID
    const items = await Item.find({ category: categoryId })
      .select('name description price image category available')
      .populate('category', 'name');

    // Debug logging
    console.log(`Found ${items.length} items for category ${category.name}`);

    return NextResponse.json(items);
  } catch (error) {
    console.error('Items API Error:', error);
    return NextResponse.json(
      { error: "Failed to fetch items", details: error.message },
      { status: 500 }
    );
  }
}