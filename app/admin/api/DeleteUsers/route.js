import {connectDB} from '@/lib/ConnectDB'
import {User} from "@/app/models/userModel";


export async function DELETE(request) {
    const { userId } = await request.json();
    await connectDB();
    const user = await User.findById(userId);
    if(user.role === 'admin'){
        return new Response(JSON.stringify({ message: "Admin cannot be deleted" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }else{
        await User.findByIdAndDelete(userId);
        return new Response(JSON.stringify({ message: "User deleted successfully" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
}
