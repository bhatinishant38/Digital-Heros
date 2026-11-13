import dbConnect from "@/lib/dbConnect";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { scoreModel } from "@/models/scoreModel";
import { connection, NextResponse } from "next/server";
import { validateScoreInput } from "@/lib/scoreValidation";

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

  try {
    const body = await request.json();
    const validated = validateScoreInput(body?.date, body?.score);

    if (validated.error) {
      return NextResponse.json(
        { success: false, message: validated.error },
        { status: 400 },
      );
    }

    await dbConnect();
    const score = await scoreModel.create({
      user: userId,
      date: validated.date,
      score: validated.score,
    });

    return NextResponse.json(
      { success: true, message: "Score added.", score },
      { status: 201 },
    );
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

    console.error("Add score error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to add score." },
      { status: 500 },
    );
  }
}