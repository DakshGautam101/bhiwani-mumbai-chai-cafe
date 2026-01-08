import { connectDB } from "@/lib/ConnectDB";
import { Category } from "@/app/models/categoryModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().populate('items');
    return NextResponse.json(categories);
  } catch (error) {
    console.error('GetCategories API Error:', error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}