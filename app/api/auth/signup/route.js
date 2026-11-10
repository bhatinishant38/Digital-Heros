import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import UserModel from "@/models/userModel";
import bcrypt from "bcryptjs";
import { success } from "zod";

export async function POST(request){
    try {
        await dbConnect()
        const { username ,email ,password} = await request.json()

        // validate fields
        if(!username || !email ||!password){
            return NextResponse.json({
                success : false ,
                message : "All fields are required"
            },{
                status:400
            }
          )
        }

        if(!validator.isEmail(email)){
            return NextResponse.json({
                success :false ,
                message : "Enter a valid email"
            },
            {
                 status : 400
            }
           )
        }

        // checking password length
        if(password.length<8){
            return NextResponse.json({
                success :false ,
                message : "Passwors must be at least 8 characters"
            },
            {
                status:400
            }
          )
        }

        //Check existing email
        const existingUser = await UserModel.findOne({
            email : email.toLowerCase()
        }).select("password");

        if(existingUser){
            return NextResponse.json({
                success : false ,
                message : "Email already registered"
            },
           {
            status :409 
           }
         )
        }

    }catch{

    }
}