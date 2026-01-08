import { Order } from "@/app/models/orderModels";
import { connectDB } from "@/lib/ConnectDB";

export async function POST(){
    try {
        await connectDB();
        const orders = await Order.find().populate()
    } catch (error) {
        
    }
}