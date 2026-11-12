import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import UserModel from "@/models/userModel";
import bcrypt from "bcryptjs";
import validator from "validator";

export async function POST(request) {
  try {
    const body = await request.json();
    const username =
      typeof body?.username === "string" ? body.username.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    if (!validator.isEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Enter a valid email" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    await dbConnect();

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    }).select("_id");

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "That email or username is already registered",
        },
        { status: 409 },
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 },
      );
    }

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "That email or username is already registered",
        },
        { status: 409 },
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to create your account right now" },
      { status: 500 },
    );
  }
}