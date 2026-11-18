import mongoose from "mongoose";
import { required } from "zod/mini";

const charitySchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    raised: {
      type: Number,
      required: true,
      default: 0,
    },
    members: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: true,
      // store the image URL (e.g. from your upload/storage service)
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically)
)
export const CharityModel = mongoose.models.charity || mongoose.model('charity',charitySchema)

