import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";

export async function PUT(request){
    const session = await auth()
    const user = session.user
    const userId = user.id
    if (!userId) {
        return NextResponse.json(
            { message: "Authentication required." },
            { status: 401 },
        );
    }
    try {
        dbConnect()
        const {date , score } = request.body
        
    } catch (error) {
        
    }

    

}