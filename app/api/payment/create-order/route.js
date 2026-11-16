import Razorpay from "razorpay";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { NextResponse } from "next/server";

const plans = {
  monthly: { amount: 19999 * 100 },
  yearly: { amount: 191899 * 100 },
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
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

  const plan = body?.plan;
  if (typeof plan !== "string" || !Object.hasOwn(plans, plan)) {
    return NextResponse.json(
      { success: false, message: "Choose a valid subscription plan." },
      { status: 400 },
    );
  }

  try {
    const order = await razorpay.orders.create({
      amount: plans[plan].amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
        planType: plan,
      },
    });

    return NextResponse.json({
      success : true,
      order: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 },
    );
  }
}
