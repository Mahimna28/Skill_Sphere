import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ message: "Email and code are required" }, { status: 400 });
    }

    // Find the OTP
    const otpRecord = await prisma.otp.findFirst({
      where: {
        email,
        code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    // Delete the OTP after use
    await prisma.otp.delete({ where: { id: otpRecord.id } });

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "User not found. Please register first." }, { status: 404 });
    }

    // Backward compatibility: map 'admin' from DB to 'superadmin'
    if (user.role === "admin") {
      user.role = "superadmin";
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Map roles to their correct dashboard paths
    const roleToPath: Record<string, string> = {
      student: "/dashboard/student",
      teacher: "/dashboard/teacher",
      parent: "/dashboard/parent",
      superadmin: "/dashboard/admin",
      institute_admin: "/dashboard/teacher", // Institute Admins land on teacher dashboard
    };
    const redirectPath = roleToPath[user.role] ?? `/dashboard/${user.role}`;

    return NextResponse.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      redirect: redirectPath,
    });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
