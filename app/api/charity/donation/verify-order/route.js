import { createHmac, timingSafeEqual } from "node:crypto";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import { DonationModel } from "@/models/donationModel";
import { connection, NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const matchesDonation = (donation, { userId, charityId, amount, orderId }) =>
  donation.user.toString() === userId &&
  donation.charity.toString() === charityId &&
  donation.amount === amount &&
  donation.razorpayOrderId === orderId;

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

  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = body ?? {};

  if (
    typeof orderId !== "string" ||
    typeof paymentId !== "string" ||
    typeof signature !== "string" ||
    !/^[a-f\d]{64}$/i.test(signature)
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
      .update(`${orderId}|${paymentId}`)
      .digest();
    const receivedSignature = Buffer.from(signature, "hex");

    if (!timingSafeEqual(expectedSignature, receivedSignature)) {
      return NextResponse.json(
        { success: false, message: "Payment signature is invalid." },
        { status: 400 },
      );
    }

    const [order, payment] = await Promise.all([
      razorpay.orders.fetch(orderId),
      razorpay.payments.fetch(paymentId),
    ]);
    const charityId = order.notes?.charityId;
    const amount = Number(order.notes?.amount);

    if (
      order.id !== orderId ||
      order.notes?.type !== "charity_donation" ||
      order.notes?.userId !== userId ||
      typeof charityId !== "string" ||
      !mongoose.isValidObjectId(charityId) ||
      !Number.isSafeInteger(amount) ||
      amount < 10 ||
      order.amount !== amount * 100 ||
      order.currency !== "INR" ||
      payment.order_id !== orderId ||
      payment.amount !== order.amount ||
      payment.currency !== order.currency
    ) {
      return NextResponse.json(
        { success: false, message: "Payment does not match this donation." },
        { status: 400 },
      );
    }

    const capturedPayment =
      payment.status === "authorized"
        ? await razorpay.payments.capture(
            paymentId,
            order.amount,
            order.currency,
          )
        : payment;

    if (capturedPayment.status !== "captured") {
      return NextResponse.json(
        { success: false, message: "Payment has not been captured." },
        { status: 400 },
      );
    }

    await dbConnect();
    await DonationModel.init();
    const donationData = {
      user: userId,
      charity: charityId,
      amount,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      contributesToRaised: true,
    };
    let donation = await DonationModel.findOne({
      razorpayPaymentId: paymentId,
    });
    let alreadyProcessed = Boolean(donation);

    try {
      if (!donation) {
        donation = await DonationModel.create(donationData);
      }
    } catch (error) {
      if (error.code !== 11000) {
        throw error;
      }

      donation = await DonationModel.findOne({
        $or: [
          { razorpayPaymentId: paymentId },
          { razorpayOrderId: orderId },
        ],
      });
      alreadyProcessed = Boolean(donation);
    }

    if (
      !donation ||
      !matchesDonation(donation, { userId, charityId, amount, orderId })
    ) {
      return NextResponse.json(
        { success: false, message: "This payment is already linked to another donation." },
        { status: 409 },
      );
    }

    return NextResponse.json({ success: true, alreadyProcessed });
  } catch (error) {
    console.error("Verify charity donation error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to verify donation." },
      { status: error.status || 500 },
    );
  }
}
