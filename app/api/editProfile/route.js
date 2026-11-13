import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";

export async function POST(request){
    try {
        const session = await auth()
        const userId = session?.user?.id

        if (!userId) {
              return NextResponse.json(
                { message: "Authentication required." },
                { status: 401 },
            );
        }

        await dbConnect()

        const { username , phone ,gender,dob} = request.json()
        const { image } = request.file()
        
    } catch (error) {
        
    }
}