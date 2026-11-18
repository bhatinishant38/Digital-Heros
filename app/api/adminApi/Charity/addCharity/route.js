import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { connection, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request){

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
        const formData  = await request.formData()
        const name = formData.get('name')
        const category = formData.get('category')
        const description = formData.get('description')
        const raised = formData.get('raised')
        const members = formData.get('members')
        const image = formData.get('image')

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

        if (typeof raised !== "number" || Number.isNaN(raised) || raised <= 0) {
          return NextResponse.json(
            { success: false, message: "A valid raised amount is required." },
            { status: 400 },
          );
        }
        if (typeof members !== "number" || Number.isNaN(members) || raised <= 0) {
          return NextResponse.json(
            { success: false, message: "A valid no. of members is required." },
            { status: 400 },
          );
        }
        
        
      } catch (error) {
        
      }
       

}