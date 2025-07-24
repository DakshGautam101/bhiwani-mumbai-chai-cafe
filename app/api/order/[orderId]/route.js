import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/app/models/userModel";
import { connectDB } from "@/lib/ConnectDB";

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { orderId } = await params;
    
    // Find the order in user's orders array
    const order = user.orders.find(order => order.orderId === orderId);
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });

  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to fetch order" 
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { orderId } = await params;
    const updateData = await request.json();
    
    // Find and update the order in user's orders array
    const orderIndex = user.orders.findIndex(order => order.orderId === orderId);
    
    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update allowed fields
    const allowedUpdates = ['status', 'deliveryAddress', 'contactInfo', 'deliveryDate', 'deliveryTime'];
    const updates = {};
    
    for (const key of allowedUpdates) {
      if (updateData[key] !== undefined) {
        updates[key] = updateData[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid updates provided" }, { status: 400 });
    }

    // Apply updates
    Object.assign(user.orders[orderIndex], updates, { updatedAt: new Date() });
    
    await user.save();

    return NextResponse.json({ 
      message: "Order updated successfully",
      order: user.orders[orderIndex]
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to update order" 
    }, { status: 500 });
  }
}