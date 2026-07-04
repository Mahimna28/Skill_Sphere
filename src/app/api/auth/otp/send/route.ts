import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Check user existence based on type
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (type === "register" && existingUser) {
      return NextResponse.json({ message: "This email is already registered. Please sign in instead." }, { status: 400 });
    }

    if (type === "login" && !existingUser) {
      return NextResponse.json({ message: "No account found with this email. Please register first." }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete existing OTPs for this email
    await prisma.otp.deleteMany({ where: { email } });

    // Save new OTP
    await prisma.otp.create({
      data: {
        email,
        code: otp,
        expiresAt,
      },
    });

    // Send email
    try {
      if (process.env.NODE_ENV === 'development' || !process.env.BREVO_API_KEY) {
        console.log(`\n🔑 [DEVELOPMENT] Generated OTP for ${email}: ${otp}\n`);
      } else {
        await sendOtpEmail(email, otp);
      }
    } catch (emailError: any) {
      console.error("Email send error:", emailError.message);
      return NextResponse.json(
        { message: "Failed to send email. Check your EMAIL_USER and EMAIL_PASS settings." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
