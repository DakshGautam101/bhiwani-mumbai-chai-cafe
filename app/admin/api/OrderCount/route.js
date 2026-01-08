import { connectDB } from "@/lib/ConnectDB";
import { Order } from "@/app/models/orderModels";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();
    try {
    const orderCount = await Order.countDocuments();
    return NextResponse.json({ orderCount });        
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });

    }
   

}