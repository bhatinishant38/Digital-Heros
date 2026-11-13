import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import { scoreModel } from "@/models/scoreModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function POST(request,{params}){

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
        const {id} = await params
        if (!id) {
        return NextResponse.json(
            { success: false, message: 'ID is required' },
            { status: 400 }
          );
        }
        if (!mongoose.isValidObjectId(id)) {
          return res.status(404).json({ success: false, message: "Score not found" });
        }
        const deleted = await scoreModel.findOneAndUpdate({_id :id,user : userId})
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Score not found" });
         }
         return NextResponse.json({
            success:true ,message : "Score not found"
         },{
            status:200
         })        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success:false ,message :"Something went wrong"
        },{status:500})     
    }
}