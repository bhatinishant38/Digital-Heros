import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import { scoreModel } from "@/models/scoreModel";
import { connection, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(_request, { params }) {
  await connection();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 },
    );
  }

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, message: "Score not found." },
      { status: 404 },
    );
  }

  try {
    await dbConnect();
    const deletedScore = await scoreModel.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deletedScore) {
      return NextResponse.json(
        { success: false, message: "Score not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Score deleted.",
    });
  } catch (error) {
    console.error("Delete score error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to delete score." },
      { status: 500 },
    );
  }
}
