import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import { includeDonationTotals } from "@/lib/charityDonations";
import { CharityModel } from "@/models/charityModel";
import { connection, NextResponse } from "next/server";

export async function GET() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 },
    );
  }

  if (session.user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Admin access required." },
      { status: 403 },
    );
  }

  try {
    await dbConnect();
    const records = await CharityModel.find({})
      .sort({ createdAt: -1 })
      .lean();
    const charitiesWithDonationTotals = await includeDonationTotals(records);
    const charities = charitiesWithDonationTotals.map((charity) => ({
      ...charity,
      _id: charity._id.toString(),
    }));

    return NextResponse.json({ success: true, charities });
  } catch (error) {
    console.error("Get charities error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch charities." },
      { status: 500 },
    );
  }
}