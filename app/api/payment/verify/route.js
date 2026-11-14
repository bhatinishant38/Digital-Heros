export async function POST(request){
    try {
        const {razorpay_order_id ,razorpay_payment_id,razorpay_signature } = request.json()

        const body = razorpay_order_id + '|' + razorpay_payment_id

        const expectedSignature = crypto.createHmac("sha256" , process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex')

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json(
                { error: "Invalid payment signature" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json(
            { error: "Payment verification failed" },
            { status: 500 }
        );      
    }
}