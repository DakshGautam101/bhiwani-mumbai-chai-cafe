import { Order } from "@/app/models/orderModels";
import { User } from "@/app/models/userModel";
import { connectDB } from "@/lib/ConnectDB";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {


        await connectDB();
        const orders = await Order.find({});

        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check admin
        const adminUser = await User.findById(decoded.id);
        if (!adminUser || adminUser.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }


        return NextResponse.json({ orders }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}