import { connectDB } from "@/lib/ConnectDB";
import { Item } from "@/app/models/itemsModel";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function PUT(req, { params }) {
  try {
    // Verify admin authentication
    // const authHeader = req.headers.get('authorization');
    // if (!authHeader?.startsWith('Bearer ')) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const token = authHeader.split(' ')[1];
    // try {
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   if (!decoded?.isAdmin) {
    //     return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    //   }
    // } catch (error) {
    //   return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    // }

    await connectDB();
    const { id } = params;
    const { heading, discount } = await req.json();

    // Validate input when featuring
    if (heading !== "" && (discount === undefined || discount < 0)) {
      return NextResponse.json(
        { error: "Valid discount is required for featuring" },
        { status: 400 }
      );
    }

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Clear featured data for unfeaturing
    if (heading === "" && discount === 0) {
      item.featured = [];
      item.isFeatured = false;
    } else {
      // Update featured data
      item.featured = [{
        heading: heading,
        discount: discount,
        createdAt: new Date()
      }];
      item.isFeatured = true;
    }

    await item.save();

    return NextResponse.json({
      message: item.isFeatured ? "Item featured successfully" : "Item unfeatured successfully",
      item: {
        _id: item._id,
        name: item.name,
        isFeatured: item.isFeatured,
        featured: item.featured
      }
    });
    
  } catch (error) {
    console.error("Toggle Feature Error:", error);
    return NextResponse.json(
      { error: "Failed to update item feature status" },
      { status: 500 }
    );
  }
}
