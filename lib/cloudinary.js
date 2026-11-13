import { v2 as cloudinary } from "cloudinary";

export const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // keep your name
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY, // keep your name
  });

  try {
    await cloudinary.api.ping();
    console.log("Cloudinary connected ✓");
  } catch (error) {
    console.error("Cloudinary connection failed:", error.message);
  }
};

export default cloudinary; 