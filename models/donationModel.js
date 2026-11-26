import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    charity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "charity",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 10,
    },
    contributesToRaised: {
      type: Boolean,
      required: true,
      default: false,
    },
    statsApplied: {
      type: Boolean,
      required: true,
      default: false,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

export const DonationModel =
  mongoose.models.Donation ||
  mongoose.model("Donation", donationSchema);
