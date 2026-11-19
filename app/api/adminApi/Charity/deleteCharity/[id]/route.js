import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import { CharityModel } from "@/models/charityModel";
import mongoose from "mongoose";
import { connection, NextResponse } from "next/server";

export async function DELETE(request, { params }) {
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

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, message: "Charity not found." },
      { status: 404 },
    );
  }

  try {
    await dbConnect();
    const deletedCharity = await CharityModel.findByIdAndDelete(id);

    if (!deletedCharity) {
      return NextResponse.json(
        { success: false, message: "Charity not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Charity deleted.",
    });
  } catch (error) {
    console.error("Delete charity error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to delete charity." },
      { status: 500 },
    );
  }
}