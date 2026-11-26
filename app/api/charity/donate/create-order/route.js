import mongoose from "mongoose";
import Razorpay from "razorpay";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import { CharityModel } from "@/models/charityModel";
import { connection, NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
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
    await dbConnect();
    const charityExists = await CharityModel.exists({ _id: charityId });
    if (!charityExists) {
      return NextResponse.json(
        { success: false, message: "Charity not found." },
        { status: 404 },
      );
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `donation_${Date.now()}`,
      notes: {
        type: "charity_donation",
        userId,
        charityId,
        amount: String(amount),
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create charity donation order error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to create donation order." },
      { status: 500 },
    );
  }
}
