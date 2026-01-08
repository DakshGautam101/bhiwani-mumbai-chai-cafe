import { NextResponse } from "next/server";
import { connectDB } from "@/lib/ConnectDB";
import { User } from "@/app/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        const body = await request.json();
        await connectDB();
        const {email, password} = body;
        if (!email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        const user = await User.findOne({email});
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        if(email === process.env.ADMIN_EMAIL) {
            user.role = 'admin'; 
        }
        const token = jwt.sign({id: user._id , email : user.email}, process.env.JWT_SECRET, {expiresIn: "1h"});
        console.log("User logged in successfully:", token,user.email);
        return NextResponse.json({ message: "Login successful", user, token }, { status: 200 });
        
    } catch (error) {
        console.error("Error logging in", error);
        return NextResponse.json({ error: "Failed to login" }, { status: 500 });
    }
}
