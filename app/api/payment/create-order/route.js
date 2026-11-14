import Razorpay from "razorpay";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { connection } from "mongoose";
import { NextResponse } from "next/server";
import UserModel from "@/models/userModel";

const razorpay = new Razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET
})

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

        const {plan} = await request.json()

        const amount = plan ==="yearly" ? 191899 *100 : 19999*100

        const order = await razorpay.orders.create({
            amount ,
            currency : 'INR',
            receipt : `receipt_${Date.now()}`,
            note : {
                planType : plan
            }
        })

        const expiryDate = new Date();

        if (planType === "yearly") {
            // Add 1 year to the current date
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        } else {
            // Add 1 month to the current date
            expiryDate.setMonth(expiryDate.getMonth() + 1);
        }

        const  subscriptionPlanPurchase = await UserModel.findByIdAndUpdate(userId ,{ subscriptionPlan : plan , isSubscribed : true,subscriptionEnd :expiryDate})
        if (!subscriptionPlanPurchase) {
              return NextResponse.json(
                { success: false, message: "Something went wrong in purchasing subscription plan." },
                { status: 404 },
              );
            }
        return NextResponse.json({ order : order.id ,amount : order.amount ,subscriptionPlanPurchase})
        
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json(
            { error: "Failed to create Razorpay order" },
            { status: 500 }
        );
        
    }

}