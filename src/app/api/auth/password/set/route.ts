import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { validatePassword } from "@/lib/validation";

// PATCH: Set a password for Google-only users (no current password required)
export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { newPassword } = await req.json();
    if (!newPassword) {
      return NextResponse.json({ message: "New password is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, password: true },
    });

    if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 });

    // Only allow setting password if they don't have one (Google-only user)
    if (user.password) {
      return NextResponse.json({
        message: "You already have a password. Use the change password option instead.",
      }, { status: 400 });
    }

    // Validate password strength
    const validationError = validatePassword(newPassword);
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    // Hash and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    // Remove the "set_password" notification since they've done it
    await prisma.notification.deleteMany({
      where: { userId: decoded.id, type: "set_password" },
    });

    return NextResponse.json({ message: "Password set successfully! You can now log in with email too." });
  } catch (error: any) {
    console.error("Set password error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
