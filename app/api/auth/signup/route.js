import { connectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";
import { User } from "@/app/models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function POST(request) {
    try {
        const body  = await request.json();
        await connectDB();
        const {name, email, password, phone} = body;
        if (!name || !email || !password || !phone) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
        }
        if (!email.includes("@")) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword, phone});
        const token = jwt.sign({id: user._id, email: user.email }, process.env.JWT_SECRET, {expiresIn: "1h"});
        if(email === process.env.ADMIN_EMAIL) {
            user.role = 'admin'; // Set role to admin if the email matches the admin email
            await user.save();
            console.log("Admin status granted");
        }
        const userObj = user.toObject();
        delete userObj.password;
        return NextResponse.json({ message: "User created successfully", user: userObj, token }, { status: 201 });
    } catch (error) {
        console.error("Error creating user", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}