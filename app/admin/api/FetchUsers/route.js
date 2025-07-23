import { connectDB } from "@/lib/ConnectDB";
import {  User } from "@/app/models/userModel";


export async function GET() {

    try 
    {
    await connectDB();
    const users = await User.find({}).select("-password -__v").lean();

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
        
    }

}