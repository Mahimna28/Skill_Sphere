import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendNewPasswordEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Verify OTP
    const otpRecord = await prisma.otp.findFirst({
      where: { email, code },
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ message: "Invalid or expired verification code" }, { status: 400 });
    }

    // Generate random 10-character password
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let newPassword = "";
    for (let i = 0; i < 10; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Ensure it meets validation (simple check here, but the generator is broad)
    // In a real app, you'd ensure it has 1 upper, 1 lower, 1 digit, 1 special.
    // Let's force some:
    newPassword += "A1!"; 

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Delete OTP
    await prisma.otp.deleteMany({ where: { email } });

    // Send the new password email
    await sendNewPasswordEmail(email, newPassword);

    return NextResponse.json({ message: "A new password has been sent to your email." });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
