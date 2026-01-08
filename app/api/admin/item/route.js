import { Category } from "@/app/models/categoryModel";
import { connectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id } = await req.json(); // ✅ parse body correctly

    await connectDB();

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    console.error("Category fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
