import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import { includeDonationTotals } from "@/lib/charityDonations";
import { CharityModel } from "@/models/charityModel";
import { DonationModel } from "@/models/donationModel";
import mongoose from "mongoose";
import { connection, NextResponse } from "next/server";

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

    const donationExists = await DonationModel.exists({
      user: userId,
      charity: charityId,
      amount,
      contributesToRaised: true,
    });
    if (!donationExists) {
      return NextResponse.json(
        { success: false, message: "Verified donation not found." },
        { status: 404 },
      );
    }

    const charity = await CharityModel.findById(charityId).lean();
    if (!charity) {
      return NextResponse.json(
        { success: false, message: "Charity not found." },
        { status: 404 },
      );
    }

    const [updatedCharity] = await includeDonationTotals([charity]);
    return NextResponse.json({ success: true, charity: updatedCharity });
  } catch (error) {
    console.error("Update charity donation totals error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to update charity donation totals." },
      { status: 500 },
    );
  }
}