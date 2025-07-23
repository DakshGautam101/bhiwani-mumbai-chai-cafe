import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { User } from "@/app/models/userModel"
import { connectDB } from "@/lib/ConnectDB"

export async function PUT(request){
    try {
        await connectDB()
        const authHeader = request.headers.get("authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "No token provided" }, { status: 401 })
        }
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const { phone, name, avatar, address } = await request.json()
        if (!phone && !name && !avatar && !address) {
            return NextResponse.json({ error: "At least one field (name, phone, avatar, or address) is required" }, { status: 400 })
        }

        const updateFields = {}
        if (phone) updateFields.phone = phone
        if (name) updateFields.name = name
        if (avatar) updateFields.avatar = avatar
        if (address) updateFields.address = address

        const user = await User.findByIdAndUpdate(
            decoded.id,
            updateFields,
            { new: true }
        ).select("-password")

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Profile updated successfully", user }, { status: 200 })
    } catch (error) {
        console.error("Error updating profile", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}