import dbConnect from "@/lib/dbConnect";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import UserModel from "@/models/userModel";
import { scoreModel } from "@/models/scoreModel";
import { NextResponse } from "next/server";
import { success } from "zod";

export const validateScore = (date, score) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "") || isNaN(new Date(date))) {
    return "Enter a valid date.";
  }
  if (date > new Date().toISOString().slice(0, 10)) {
    return "The date can't be in the future.";
  }
  if (!Number.isInteger(Number(score)) || score < 1 || score > 45) {
    return "Score must be a whole number from 1 to 45.";
  }
  return null;
};

export async function POST(request){
    
    const session = await auth()
    const user = session.user
    const userId = user?.id

    if (!user) {
        return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 },
        );
    }

    try {   
        await dbConnect()
        const {score ,date } = request.body
         if (problem) {
           return res.status(400).json({ success: false, message: problem });
         }
         await scoreModel.create({
            user : userId,
            date : new Date(date),
            score : Number(score)
         })
         return NextResponse.json({
            success : true ,
            message : "Score added"

         },{
            status : 201
         })
    } catch (error) {
        if(ErrorBoundary.code = 11000){
            return NextResponse.json({
                success : false ,
                message : " You already have a score for this date . Edit that entry instead."
            },{
                status : 409
            })
        }
        console.log(error)
        NextResponse.json({
            success :false ,
            message : "Something went wrong"
        },{
            status:500
        }
      )      
    }
}