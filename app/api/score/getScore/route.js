import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import { scoreModel } from "@/models/scoreModel";
import { connection, NextResponse } from "next/server";

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
    const scores = await scoreModel
      .find({ user: userId })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({ success: true, scores });
  } catch (error) {
    console.error("Get scores error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch scores." },
      { status: 500 },
    );
  }
}
