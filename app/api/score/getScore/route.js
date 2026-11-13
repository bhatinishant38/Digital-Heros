import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import { scoreModel } from "@/models/scoreModel";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function GET(request){

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
      const scores = (await scoreModel.find({user:userId})).toSorted({date:-1})
      return NextResponse.json({
        success : true ,
        scores
       },
       {status : 200}
     )

        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success : false ,
            message : "Something went wrong"
        })
        
    }
 
}