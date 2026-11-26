import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { connect } from "mongoose";
import { connection, NextResponse } from "next/server";

export async function PUT(){
    await connection();
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 },
        );
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
        { success: false, message: "A valid JSON request body is required." },
        { status: 400 },
        );
    }

    const { charityId, amount } = body ?? {};
    if (
    typeof charityId !== "string" ||
    !mongoose.isValidObjectId(charityId) ||
    !Number.isSafeInteger(amount) ||
    amount < 10 ||
    !Number.isSafeInteger(amount * 100)
    ) {
    return NextResponse.json(
        { success: false, message: "A valid charity and donation amount are required." },
        { status: 400 },
    );
    }

   try {
    
    await connect()
    const charityExists = await CharityModel.exists({ _id: charityId });
        if (!charityExists) {
          return NextResponse.json(
            { success: false, message: "Charity not found." },
            { status: 404 },
          );
    }
    let body 

    
   } catch (error) {
    
   }
}