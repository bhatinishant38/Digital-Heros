import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import UserModel from "@/models/userModel";
import bcrypt from "bcryptjs";
import validator from "validator";

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
                message : "Password must be at least 8 characters"
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

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password ,salt)

        const newUser = await UserModel.create({
            username,
            email : email.toLowerCase() ,
            password :hashedPassword ,
        })

        return NextResponse.json(
            {
                success :true ,
                message : "User registered successfully",
                user : {
                    id : newUser._id,
                    username :newUser.username,
                    email : newUser.email
                }
            },
            { status : 201}
        )

    }catch(error){
        console.log("Signup error :" ,error)
        return NextResponse.json({
            success : false ,
            message : "Internal server error"
        },
        {status : 500}
      )
    }
}