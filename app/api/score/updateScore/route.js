import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import { scoreModel } from "@/models/scoreModel";
import { connection, NextResponse } from "next/server";
import mongoose from "mongoose";
import { validateScoreInput } from "@/lib/scoreValidation";

export async function PUT(request) {
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
    const body = await request.json();
    const scoreId = body?.scoreId;

    if (!mongoose.isValidObjectId(scoreId)) {
      return NextResponse.json(
        { success: false, message: "Score not found." },
        { status: 404 },
      );
    }

    const validated = validateScoreInput(body?.date, body?.score);
    if (validated.error) {
      return NextResponse.json(
        { success: false, message: validated.error },
        { status: 400 },
      );
    }

    await dbConnect();
    const updatedScore = await scoreModel.findOneAndUpdate(
      { _id: scoreId, user: userId },
      { date: validated.date, score: validated.score },
      { new: true, runValidators: true },
    );

    if (!updatedScore) {
      return NextResponse.json(
        { success: false, message: "Score not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Score updated.",
      score: updatedScore,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 },
      );
    }

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have a score for this date. Edit that entry instead.",
        },
        { status: 409 },
      );
    }

    console.error("Update score error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to update score." },
      { status: 500 },
    );
  }
}
