import { createHmac, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import { NextResponse } from "next/server";

const plans = {
  monthly: { amount: 19999 * 100, duration: "month" },
  yearly: { amount: 191899 * 100, duration: "year" },
};

function getSubscriptionEnd(currentEnd, duration) {
  const now = new Date();
  const endDate =
    currentEnd instanceof Date &&
    !Number.isNaN(currentEnd.getTime()) &&
    currentEnd > now
      ? new Date(currentEnd)
      : now;
  const dayOfMonth = endDate.getUTCDate();

  endDate.setUTCDate(1);
  if (duration === "year") {
    endDate.setUTCFullYear(endDate.getUTCFullYear() + 1);
  } else {
    endDate.setUTCMonth(endDate.getUTCMonth() + 1);
  }

  const lastDayOfMonth = new Date(
    Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth() + 1, 0),
  ).getUTCDate();
  endDate.setUTCDate(Math.min(dayOfMonth, lastDayOfMonth));

  return endDate;
}

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

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    body ?? {};
  if (
    typeof razorpay_order_id !== "string" ||
    typeof razorpay_payment_id !== "string" ||
    typeof razorpay_signature !== "string" ||
    !/^[a-f\d]{64}$/i.test(razorpay_signature)
  ) {
    return NextResponse.json(
      { success: false, message: "Payment verification details are invalid." },
      { status: 400 },
    );
  }

  try {
    const expectedSignature = createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET,
    )
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest();
    const receivedSignature = Buffer.from(razorpay_signature, "hex");

    if (!timingSafeEqual(expectedSignature, receivedSignature)) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    const [order, payment] = await Promise.all([
      razorpay.orders.fetch(razorpay_order_id),
      razorpay.payments.fetch(razorpay_payment_id),
    ]);
    const plan = order.notes?.planType;

    if (
      order.notes?.userId !== userId ||
      typeof plan !== "string" ||
      !Object.hasOwn(plans, plan) ||
      order.amount !== plans[plan].amount ||
      order.currency !== "INR" ||
      payment.order_id !== order.id ||
      payment.amount !== order.amount ||
      payment.currency !== order.currency ||
      payment.status !== "captured"
    ) {
      return NextResponse.json(
        { success: false, error: "Payment does not match this order." },
        { status: 400 },
      );
    }

    await dbConnect();
    const user = await UserModel.findById(userId).select("+verifiedPaymentIds");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 },
      );
    }

    if (user.verifiedPaymentIds.includes(razorpay_payment_id)) {
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        subscription: {
          plan: user.subscriptionPlan,
          endDate: user.subscriptionEnd,
        },
      });
    }

    const expiryDate = getSubscriptionEnd(
      user.subscriptionEnd,
      plans[plan].duration,
    );

    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: userId,
        verifiedPaymentIds: { $ne: razorpay_payment_id },
      },
      {
        $set: {
          subscriptionPlan: plan,
          subscriptionEnd: expiryDate,
          isSubscribed: true,
        },
        $addToSet: { verifiedPaymentIds: razorpay_payment_id },
      },
      { new: true, runValidators: true },
    ).select("subscriptionPlan subscriptionEnd");

    if (!updatedUser) {
      const currentUser = await UserModel.findById(userId)
        .select("+verifiedPaymentIds subscriptionPlan subscriptionEnd");
      if (currentUser?.verifiedPaymentIds.includes(razorpay_payment_id)) {
        return NextResponse.json({
          success: true,
          alreadyProcessed: true,
          subscription: {
            plan: currentUser.subscriptionPlan,
            endDate: currentUser.subscriptionEnd,
          },
        });
      }

      return NextResponse.json(
        { success: false, message: "Unable to update your subscription." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      subscription: {
        plan: updatedUser.subscriptionPlan,
        endDate: updatedUser.subscriptionEnd,
      },
    });
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 500 },
    );
  }
}
