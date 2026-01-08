import { connectDB } from "@/lib/ConnectDB";
import { Category } from "@/app/models/categoryModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { categoryId } = params;

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const category = await Category.findById(categoryId);
    
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Debug logging
    console.log('Found category:', {
      id: category._id,
      name: category.name
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('GetCategories API Error:', error);
    return NextResponse.json(
      { error: "Failed to fetch category", details: error.message },
      { status: 500 }
    );
  }
}