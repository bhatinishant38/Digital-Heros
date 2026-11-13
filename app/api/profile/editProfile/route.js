import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import { connection, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const allowedGenders = new Set(["Not selected", "Male", "Female", "Other"]);
const allowedImageTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
const maxImageSize = 2 * 1024 * 1024;

function getProfile(user) {
  return {
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
  };
}

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
    const formData = await request.formData();
    const name = formData.get("name");
    const phone = formData.get("phone");
    const gender = formData.get("gender");
    const dob = formData.get("dob");
    const image = formData.get("image");

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 },
      );
    }

    if (typeof phone !== "string" || (phone && !/^\+?[0-9]{7,15}$/.test(phone))) {
      return NextResponse.json(
        { success: false, message: "Enter a valid phone number." },
        { status: 400 },
      );
    }

    if (typeof gender !== "string" || !allowedGenders.has(gender)) {
      return NextResponse.json(
        { success: false, message: "Select a valid gender." },
        { status: 400 },
      );
    }

    if (typeof dob !== "string") {
      return NextResponse.json(
        { success: false, message: "Enter a valid date of birth." },
        { status: 400 },
      );
    }

    const dateOfBirth = dob ? new Date(`${dob}T00:00:00.000Z`) : null;
    if (
      dateOfBirth &&
      (Number.isNaN(dateOfBirth.getTime()) || dateOfBirth > new Date())
    ) {
      return NextResponse.json(
        { success: false, message: "Date of birth must not be in the future." },
        { status: 400 },
      );
    }

    const update = {
      username: name.trim(),
      phone,
      gender,
      dob: dateOfBirth,
    };

    if (image !== null && !(image instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Invalid image upload." },
        { status: 400 },
      );
    }

    if (image instanceof File && image.size > 0) {
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
        folder: "digital-heroes/profiles",
      });
      update.image = uploadedImage.secure_url;
    }

    await dbConnect();
    const user = await UserModel.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    }).select(
      "username email phone gender dob image subscriptionPlan subscriptionEnd charity",
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated.",
      user: getProfile(user),
    });
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "That username is already in use." },
        { status: 409 },
      );
    }

    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, message: "Could not update your profile." },
      { status: 500 },
    );
  }
}
