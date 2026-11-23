import { connection } from "mongoose";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { CharityModel } from "@/models/charityModel";

export async function GET() {
    await connection()
    const session = await auth()
    const userId = session?.user?.id

    if(!userId){
        return NextResponse.json(
            { success : false ,message : "Authentication required."},
            { status : 401} ,
        )
    }

    try {
        await dbConnect()
        const records = (await CharityModel.find({})).toSorted({ cretedAt : -1}).lean()
        const charities = records = records.map((charity)=>({
            ...charity ,
            _id : charity._id.toString()
        }))
        return NextResponse.json({success : true , charities}) 
    } catch (error) {
        console.log("Get charities error:", error)
        return NextResponse.json(
            { success : false , message : "Unable to fetch charities."},
            { status : 500}
        ) 
    }
}