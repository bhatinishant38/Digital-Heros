import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import { CharityModel } from "@/models/charityModel";

import { connection, NextResponse } from "next/server";


export async function GET (request ,{ params }){
    await connection()
    const session = await auth()
    const userId = session?.user?.id

    if(!userId){
        return NextResponse.json(
            { success : false , message : "Authentication required."},
            { status : 401}
        )
    }
    const { id } = params
    try {
        await dbConnect()
        const data = await CharityModel.findById({id})
        console.log(data)
        return NextResponse.json(
            { success : true ,data},
            { status : 200}
        )    
    } catch (error) {
        console.error("Get charities error:", error);
        return NextResponse.json(
            { success: false, message: "Unable to fetch charities." },
            { status: 500 },
        );
        
    }
}