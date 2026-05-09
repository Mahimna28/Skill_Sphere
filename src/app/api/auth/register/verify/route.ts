import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, otpCode, childEmail } = await req.json();

    if (!name || !email || !password || !role || !otpCode) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // 1. Verify OTP first
    const otpRecord = await prisma.otp.findFirst({
      where: {
        email,
        code: otpCode,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      return NextResponse.json({ message: "Invalid or expired verification code" }, { status: 400 });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "User already registered" }, { status: 400 });
    }

    // 3. Special logic for Parent role
    let childId = null;
    if (role === "parent" && childEmail) {
       const child = await prisma.user.findUnique({ where: { email: childEmail } });
       if (!child || child.role !== "student") {
         return NextResponse.json({ message: "Invalid child account" }, { status: 400 });
       }
       childId = child.id;
    }

    // 4. Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        ...(childId ? { children: { connect: { id: childId } } } : {}),
      },
    });

    // 5. Cleanup OTP
    await prisma.otp.delete({ where: { id: otpRecord.id } });

    // 6. Generate token and log in
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({
      message: "Account created successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      redirect: `/dashboard/${user.role}`,
    });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
