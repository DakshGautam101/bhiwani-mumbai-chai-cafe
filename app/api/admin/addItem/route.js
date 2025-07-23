import { Item } from "@/app/models/itemsModel";
import { Category } from "@/app/models/categoryModel";
import { connectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { name, category, description, price, image, images } = await req.json();

    if (!name || !category || !description || !price) {
      return NextResponse.json({ error: "All fields except image are required" }, { status: 400 });
    }

    // Create the item with both single image and multiple images
    const newItem = await Item.create({
      name,
      category,
      description,
      price,
      image,
      images: images || []
    });

    // Push the item._id into the selected category's `items` array
    await Category.findByIdAndUpdate(category, {
      $push: { items: newItem._id },
    });

    return NextResponse.json({ message: "Item added successfully", item: newItem }, { status: 201 });

  } catch (error) {
    console.error("Error adding item:", error);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
