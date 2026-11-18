import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import { connection, NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/auth";

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
    const records = await UserModel.find({role:'user'})
      .select(
        "username email phone subscriptionPlan subscriptionEnd isSubscribed charity createdAt image",
      )
      .sort({ createdAt: -1 })
      .lean();

    const users = records.map((user) => ({
      ...user,
      _id: user._id.toString(),
      name: user.username,
    }));

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch users." },
      { status: 500 },
    );
  }
}