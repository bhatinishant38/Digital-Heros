import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import { CharityModel } from "@/models/charityModel";
import { v2 as cloudinary } from "cloudinary";
import { connection, NextResponse } from "next/server";

const allowedImageTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
const maxImageSize = 2 * 1024 * 1024;

export async function POST(request) {
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
    const formData = await request.formData();
    const name = formData.get("name");
    const category = formData.get("category");
    const description = formData.get("description");
    const raisedValue = formData.get("raised");
    const membersValue = formData.get("members");
    const image = formData.get("image");

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Charity name is required." },
        { status: 400 },
      );
    }

    if (typeof category !== "string" || !category.trim()) {
      return NextResponse.json(
        { success: false, message: "Category is required." },
        { status: 400 },
      );
    }

    if (typeof description !== "string" || !description.trim()) {
      return NextResponse.json(
        { success: false, message: "Description is required." },
        { status: 400 },
      );
    }

    const raised = Number(raisedValue);
    if (
      typeof raisedValue !== "string" ||
      !raisedValue.trim() ||
      !Number.isFinite(raised) ||
      raised < 0
    ) {
      return NextResponse.json(
        { success: false, message: "A valid raised amount is required." },
        { status: 400 },
      );
    }

    const members = Number(membersValue);
    if (
      typeof membersValue !== "string" ||
      !membersValue.trim() ||
      !Number.isInteger(members) ||
      members < 0
    ) {
      return NextResponse.json(
        { success: false, message: "A valid number of members is required." },
        { status: 400 },
      );
    }

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        { success: false, message: "Please select a charity image." },
        { status: 400 },
      );
    }

    if (!allowedImageTypes.has(image.type)) {
      return NextResponse.json(
        { success: false, message: "Choose a PNG, JPG, or WebP image." },
        { status: 400 },
      );
    }

    if (image.size > maxImageSize) {
      return NextResponse.json(
        { success: false, message: "Image must be 2 MB or smaller." },
        { status: 400 },
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_SECRET_KEY;
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary credentials are not configured.");
    }

    await dbConnect();
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const dataUrl = `data:${image.type};base64,${Buffer.from(
      await image.arrayBuffer(),
    ).toString("base64")}`;
    const uploadedImage = await cloudinary.uploader.upload(dataUrl, {
      resource_type: "image",
      folder: "digital-heroes/charity",
    });

    const charity = await CharityModel.create({
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      raised,
      members,
      image: uploadedImage.secure_url,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Charity added successfully.",
        charity,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Charity creation error:", error);
    return NextResponse.json(
      { success: false, message: "Could not add charity." },
      { status: 500 },
    );
  }
}
