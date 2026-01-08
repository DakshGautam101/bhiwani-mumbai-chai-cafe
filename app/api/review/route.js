import { headers } from "next/headers";
import { User } from '@/app/models/userModel';
import { connectDB } from '@/lib/ConnectDB';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  await connectDB();
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ message: "Unauthorized" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    ); 
  }

  const token = authHeader.split(" ")[1];
  let userData;
  try {
    // Replace 'your_jwt_secret' with your actual secret
    userData = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Invalid or expired token" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const reviewData = await req.json();

  try {
    if (!reviewData || !reviewData.rating || !reviewData.review) {
      return new Response(
        JSON.stringify({ message: "Bad Request: Missing review data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { rating, review } = reviewData;

    // Find user by ID or email from token
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Push the new review to the user's reviews array
    user.reviews.push({ rating, review });
    await user.save();

    return new Response(
      JSON.stringify({ message: "Review submitted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in POST /review:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
