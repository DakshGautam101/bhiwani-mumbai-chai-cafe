import { connectDB } from "@/lib/ConnectDB";
import { Order } from "@/app/models/orderModels";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function GET(req, { params }) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return NextResponse.json(
          { error: "Invalid token" },
          { status: 401 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = params;

    const order = await Order.findById(id)
      .populate('items.itemId')
      .populate('userId', 'name email');

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Transform the order data to include item details
    const transformedOrder = {
      ...order.toObject(),
      items: order.items.map(item => ({
        name: item.itemId.name,
        quantity: item.quantity,
        price: item.itemId.price
      }))
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error('Get Order Error:', error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
