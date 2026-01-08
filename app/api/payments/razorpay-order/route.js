import { connectDB } from "@/lib/ConnectDB";
import { Order } from "@/app/models/orderModels";
import { verifyAuth } from "@/app/middleware/authMiddleware";
import { NextResponse } from "next/server";
import { razorpayInstance } from "@/config/razorpay";

export async function POST(req) {
  try {
    const {
      amount,
      items,
      deliveryAddress,
      deliveryMethod,
      paymentMethod,
      contactInfo,
      deliveryDate,
      deliveryTime,
    } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    await connectDB();

    // Verify user
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Initialize Razorpay
    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    // Save order in DB
    const dbOrder = await Order.create({
      userId,
      items,
      totalAmount: amount, // ✅ fix
      deliveryMethod: deliveryMethod || "store", // ✅ fix
      deliveryDate: deliveryDate || new Date().toISOString().split("T")[0],
      deliveryTime: deliveryTime || "ASAP",
      contactInfo,
      paymentMethod: paymentMethod || "razorpay", // ✅ use frontend value if sent
      razorpayOrderId: order.id,
      paymentStatus: "Pending",
      status: "Pending", // ✅ must match schema enum
    });

    return NextResponse.json(
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order", details: error.message },
      { status: 500 }
    );
  }
}
