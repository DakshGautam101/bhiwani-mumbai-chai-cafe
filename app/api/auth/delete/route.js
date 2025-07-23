import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/app/models/userModel";
import { connectDB } from "@/lib/ConnectDB";

export async function DELETE(request) {
  try {
    await connectDB();
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Delete the user from MongoDB
    await User.findByIdAndDelete(decoded.id);
    
    return NextResponse.json({ 
      message: "User deleted successfully",
      deletedUserId: decoded.id 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error deleting user", error);
    return NextResponse.json({ 
      error: error.message || "Failed to delete user" 
    }, { status: 500 });
  }
} 