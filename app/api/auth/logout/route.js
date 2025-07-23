import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/ConnectDB";

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const {token} = body;
        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }
        return NextResponse.json({ message: "Logout successful" }, { status: 200 });
    } catch (error) {
        console.error("Error logging out", error);
        return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
    }
}