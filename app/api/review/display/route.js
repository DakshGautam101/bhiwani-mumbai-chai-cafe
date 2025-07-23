import { User } from "@/app/models/userModel";
import { connectDB } from "@/lib/ConnectDB";

export async function POST() {
  try {
    await connectDB();

    const users = await User.find({}, "name email avatar reviews").populate("reviews");

    const reviews = users.flatMap(user =>
      user.reviews.map(review => ({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        rating: review.rating,
        review: review.review,
      }))
    );
    

    return new Response(JSON.stringify(reviews), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in POST request of displaying review in testimonial carousel:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
