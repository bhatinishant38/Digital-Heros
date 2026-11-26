import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import { normalizeCharityIds } from "@/lib/normalizeCharityIds";
import { CharityModel } from "@/models/charityModel";
import { DonationModel } from "@/models/donationModel";
import mongoose from "mongoose";
import { connection, NextResponse } from "next/server";
import UserModel from "@/models/userModel";

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

  const { charityId, amount, paymentId } = body ?? {};
  if (
    typeof charityId !== "string" ||
    !mongoose.isValidObjectId(charityId) ||
    !Number.isSafeInteger(amount) ||
    amount < 10 ||
    !Number.isSafeInteger(amount * 100) ||
    typeof paymentId !== "string" ||
    !paymentId
  ) {
    return NextResponse.json(
      { success: false, message: "A valid charity and donation amount are required." },
      { status: 400 },
    );
  }

  try {
    await dbConnect();
    const transactionSession = await mongoose.startSession();
    try {
      const result = await transactionSession.withTransaction(async () => {
        const donation = await DonationModel.findOne({
          user: userId,
          charity: charityId,
          amount,
          razorpayPaymentId: paymentId,
          contributesToRaised: true,
        }).session(transactionSession);

        if (!donation) {
          return {
            status: 404,
            body: { success: false, message: "Verified donation not found." },
          };
        }

        const charity = await CharityModel.findById(charityId).session(transactionSession);
        if (!charity) {
          return {
            status: 404,
            body: { success: false, message: "Charity not found." },
          };
        }

        if (donation.statsApplied) {
          return {
            status: 200,
            body: { success: true, charity },
          };
        }

        const user = await UserModel.findById(userId).session(transactionSession);
        if (!user) {
          return {
            status: 404,
            body: { success: false, message: "User not found." },
          };
        }

        const supportedCharities = normalizeCharityIds(user.charity);
        const alreadySupporting =
          supportedCharities.includes(charity.name) ||
          supportedCharities.includes(charityId);
        user.charity = [
          ...new Set([
            ...supportedCharities.filter((entry) => entry !== charityId),
            charity.name,
          ]),
        ];
        await user.save({ session: transactionSession });

        const claimedDonation = await DonationModel.findOneAndUpdate(
          { _id: donation._id, statsApplied: { $ne: true } },
          { $set: { statsApplied: true } },
          { new: true, session: transactionSession },
        );
        if (!claimedDonation) {
          throw new Error("Donation totals were already applied.");
        }

        charity.raised = Number(charity.raised || 0) + amount;
        if (!alreadySupporting) {
          charity.members = Number(charity.members || 0) + 1;
        }
        await charity.save({ session: transactionSession });

        return {
          status: 200,
          body: { success: true, charity },
        };
      });

      return NextResponse.json(result.body, { status: result.status });
    } finally {
      await transactionSession.endSession();
    }
  } catch (error) {
    console.error("Update charity donation totals error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to update charity donation totals." },
      { status: 500 },
    );
  }
}  