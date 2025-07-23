import { User } from "@/app/models/userModel";
import { connectDB } from "@/lib/ConnectDB";

export const GET = async (req, res) => {
    try {
        await connectDB();
        
        const userCount = await User.countDocuments();
        return new Response(JSON.stringify({ userCount }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch user count' }), { status: 500 });
    }
};
