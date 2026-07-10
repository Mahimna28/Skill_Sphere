import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

const SUPER_ADMIN_EMAIL = "mahimnamistry281005@gmail.com";

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
    let childIds: { id: string }[] = [];
    if (role === "parent" && childEmail) {
       const emails = childEmail.split(",").map((e: string) => e.trim()).filter((e: string) => e);
       const children = await prisma.user.findMany({ where: { email: { in: emails }, role: "student" } });
       
       if (children.length !== emails.length) {
         return NextResponse.json({ message: "One or more child accounts are invalid or not students" }, { status: 400 });
       }
       childIds = children.map(c => ({ id: c.id }));
    }

    // 4. Determine final role — block manual superadmin/institute_admin attempts
    const blockedRoles = ["superadmin", "institute_admin"];
    let finalRole = blockedRoles.includes(role) ? "student" : role;

    // Auto-assign superadmin for platform owner
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      finalRole = "superadmin";
    }

    // 5. Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: finalRole,
        ...(childIds.length > 0 ? { children: { connect: childIds } } : {}),
      },
    });

    // 6. Cleanup OTP
    await prisma.otp.delete({ where: { id: otpRecord.id } });

    // 7. Generate token and log in
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // Redirect: superadmin → /dashboard/admin, institute_admin → /dashboard/admin
    const dashboardRole = ["superadmin", "institute_admin"].includes(user.role) ? "admin" : user.role;

    return NextResponse.json({
      message: "Account created successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      redirect: `/dashboard/${dashboardRole}`,
    });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
