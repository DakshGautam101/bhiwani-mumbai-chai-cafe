import { Item } from "@/app/models/itemsModel";
import { User } from "@/app/models/userModel";
import { connectDB } from "@/lib/ConnectDB";
import jwt from 'jsonwebtoken';

export async function POST(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const authHeader = req.headers.get("authorization");
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const token = authHeader.split(" ")[1];
        let userData;
        try {
            userData = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return new Response(JSON.stringify({ message: "Invalid or expired token" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const { rating, review } = await req.json();
        
        if (!rating || rating === 0) {
            return new Response(JSON.stringify({ message: "Rating is required and must be greater than 0" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        
        if (!review || !review.trim()) {
            return new Response(JSON.stringify({ message: "Review text is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Find the item
        const item = await Item.findById(id);
        if (!item) {
            return new Response(JSON.stringify({ message: "Item not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Find the user
        const user = await User.findById(userData.id);
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Check if user has already reviewed this item
        const existingReviewIndex = item.reviews.findIndex(r => r.userId && r.userId.toString() === user._id.toString());
        if (existingReviewIndex !== -1) {
            return new Response(JSON.stringify({ message: "You have already reviewed this item" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Add the review to the item
        const newReview = {
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
            userAvatar: user.avatar, // <-- add avatar
            rating: rating,
            review: review.trim(),
            createdAt: new Date()
        };

        item.reviews.push(newReview);

        // Calculate new average rating
        const totalRating = item.reviews.reduce((sum, r) => sum + r.rating, 0);
        item.rating = totalRating / item.reviews.length;

        await item.save();

        return new Response(JSON.stringify({ 
            message: "Review submitted successfully",
            item: item
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
        
    } catch (error) {
        console.error("Error in POST /item/[id]/review:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const item = await Item.findById(id).populate('reviews.userId', 'name email avatar');
        if (!item) {
            return new Response(JSON.stringify({ message: "Item not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ 
            reviews: item.reviews,
            averageRating: item.rating
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
        
    } catch (error) {
        console.error("Error in GET /item/[id]/review:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}