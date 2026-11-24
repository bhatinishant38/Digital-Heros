import mongoose from "mongoose";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import { CharityModel } from "@/models/charityModel";
import { includeDonationTotals } from "@/lib/charityDonations";
import { connection, NextResponse } from "next/server";

export async function GET(_request, { params }) {
  await connection();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Charity not found." },
        { status: 404 },
      );
    }

    await dbConnect();
    const data = await CharityModel.findById(id).lean();
    if (!data) {
      return NextResponse.json(
        { success: false, message: "Charity not found." },
        { status: 404 },
      );
    }

    const [charity] = await includeDonationTotals([data]);
    return NextResponse.json({ success: true, data: charity });
  } catch (error) {
    console.error("Get charity error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch charity." },
      { status: 500 },
    );
  }
}