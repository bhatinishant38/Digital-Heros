import Razorpay from "razorpay";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { connection } from "mongoose";
import { NextResponse } from "next/server";

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
        return NextResponse.json({ order : order.id ,amount : order.amount})
        
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json(
            { error: "Failed to create Razorpay order" },
            { status: 500 }
        );
        
    }

}