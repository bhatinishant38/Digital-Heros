import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import { connection, NextResponse } from "next/server";

export async function GET() {
  await connection();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const user = await UserModel.findById(userId).select(
      "username email phone gender dob image subscriptionPlan subscriptionEnd charity",
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.username,
        username: user.username,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob,
        image: user.image,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionEnd: user.subscriptionEnd,
        charity: user.charity,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { message: "Unable to load your profile." },
      { status: 500 },
    );
  }
}
