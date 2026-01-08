import { connectDB } from "@/lib/ConnectDB";
import { Order } from "@/app/models/orderModels";
import { verifyAuth } from "@/app/middleware/authMiddleware";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const userId = await verifyAuth(req); // Get user ID from token
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      items,
      deliveryMethod,
      deliveryAddress,
      contactInfo,
      paymentMethod,
      totalAmount,
      deliveryDate,
      deliveryTime,
    } = body;

    // Basic Validation
    if (
      !items || !Array.isArray(items) || items.length === 0 ||
      !deliveryMethod || !paymentMethod || !totalAmount ||
      !contactInfo?.firstName || !contactInfo?.lastName || !contactInfo?.email || !contactInfo?.phone ||
      (deliveryMethod === "delivery" && (!deliveryAddress?.city || !deliveryAddress?.address || !deliveryAddress?.zip)) ||
      !deliveryDate || !deliveryTime
    ) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const order = await Order.create({
      userId,
      items,
      totalAmount,
      deliveryAddress: deliveryMethod === "store" ? undefined : deliveryAddress,
      deliveryMethod,
      paymentMethod,
      contactInfo,
      deliveryDate,
      deliveryTime,
      status: "Pending"
    });

    console.log("Order created:", order);


    return NextResponse.json({ message: "Order placed", order }, { status: 201 });

  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
