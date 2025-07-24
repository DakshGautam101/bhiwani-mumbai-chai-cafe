import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/app/models/userModel";
import { Item } from "@/app/models/itemsModel";
import { connectDB } from "@/lib/ConnectDB";

export async function POST(request) {
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

    const orderData = await request.json();
    const {
      items,
      deliveryMethod,
      deliveryAddress,
      contactInfo,
      paymentMethod,
      totalAmount,
      deliveryDate,
      deliveryTime
    } = orderData;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items are required" }, { status: 400 });
    }

    if (!contactInfo || !contactInfo.firstName || !contactInfo.email || !contactInfo.phone) {
      return NextResponse.json({ error: "Contact information is required" }, { status: 400 });
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json({ error: "Valid total amount is required" }, { status: 400 });
    }

    // Verify items exist and calculate total
    let calculatedTotal = 0;
    const orderItems = [];

    for (const orderItem of items) {
      const item = await Item.findById(orderItem.itemId);
      if (!item) {
        return NextResponse.json({ error: `Item not found: ${orderItem.itemId}` }, { status: 400 });
      }

      const itemTotal = item.price * orderItem.quantity;
      calculatedTotal += itemTotal;

      orderItems.push({
        itemId: item._id,
        name: item.name,
        price: item.price,
        quantity: orderItem.quantity,
        total: itemTotal
      });
    }

    // Add delivery charge if applicable
    const deliveryCharge = deliveryMethod === 'delivery' && calculatedTotal > 0 ? 50 : 0;
    calculatedTotal += deliveryCharge;

    // Verify calculated total matches provided total
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return NextResponse.json({ 
        error: "Total amount mismatch",
        calculated: calculatedTotal,
        provided: totalAmount
      }, { status: 400 });
    }

    // Create order object
    const order = {
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      items: orderItems,
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : null,
      contactInfo,
      paymentMethod,
      totalAmount: calculatedTotal,
      deliveryCharge,
      subtotal: calculatedTotal - deliveryCharge,
      deliveryDate,
      deliveryTime,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add order to user's orders array
    user.orders.push(order);
    
    // Clear user's cart
    user.cart = [];
    
    await user.save();

    return NextResponse.json({ 
      message: "Order created successfully",
      order: {
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        status: order.status,
        items: order.items,
        deliveryMethod: order.deliveryMethod,
        createdAt: order.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to create order" 
    }, { status: 500 });
  }
}