import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { connection, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { CharityModel } from "@/models/charityModel";
import { includeDonationTotals } from "@/lib/charityDonations";

export async function GET() {
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
    await dbConnect();
    const records = await CharityModel.find({})
      .sort({ createdAt: -1 })
      .lean();
    const charities = await includeDonationTotals(records);

    return NextResponse.json({ success: true, charities });
  } catch (error) {
    console.error("Get charities error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch charities." },
      { status: 500 },
    );
  }
}