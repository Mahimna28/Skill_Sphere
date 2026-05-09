import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const { 
      name, email, image, childEmail, password, otpCode,
      bio, skills, learningGoal, degree, specialization, expertise, 
      experienceYears, qualification, parentNotes, isProfilePublic,
      username
    } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
       where: { id: decoded.id },
       include: { children: true }
    });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // 1. Handle Email Change Security
    if (email !== user.email) {
       if (!password || !otpCode) {
         return NextResponse.json({ message: "Password and OTP are required to change Gmail." }, { status: 400 });
       }

       // Verify Password
       const isMatch = await bcrypt.compare(password, user.password);
       if (!isMatch) {
         return NextResponse.json({ message: "Incorrect password. Email change denied." }, { status: 403 });
       }

       // Verify OTP for the NEW email
       const otpRecord = await prisma.otp.findFirst({
         where: {
           email,
           code: otpCode,
           expiresAt: { gt: new Date() },
         },
       });

       if (!otpRecord) {
         return NextResponse.json({ message: "Invalid or expired OTP for the new Gmail." }, { status: 400 });
       }

       // Cleanup OTP
       await prisma.otp.delete({ where: { id: otpRecord.id } });
    }

    // 2. Prepare Update Data
    const updateData: any = { 
      name, email, image, bio, skills, learningGoal, 
      degree, specialization, expertise, parentNotes, qualification
    };

    // Handle Username Change
    if (username && username !== user.username) {
       if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
         return NextResponse.json({ message: "Username must be 3-20 alphanumeric characters or underscores." }, { status: 400 });
       }
       const existing = await prisma.user.findUnique({ where: { username } });
       if (existing) {
         return NextResponse.json({ message: "This username is already taken." }, { status: 400 });
       }
       updateData.username = username;
    }

    // Only students and parents can change privacy; teachers/admins are always private
    if (isProfilePublic !== undefined && ["student", "parent"].includes(user.role)) {
      updateData.isProfilePublic = isProfilePublic;
    }

    if (experienceYears !== undefined) updateData.experienceYears = parseInt(experienceYears) || 0;

    // 3. Handle Parent-Child update
    if (user.role === "parent" && childEmail) {
       const child = await prisma.user.findUnique({ where: { email: childEmail } });
       if (!child || child.role !== "student") {
         return NextResponse.json({ message: "No student found with this Gmail." }, { status: 400 });
       }
       updateData.children = { set: [{ id: child.id }] };
    }

    const updated = await prisma.user.update({
      where: { id: decoded.id },
      data: updateData,
    });

    return NextResponse.json({ message: "Profile updated successfully!", user: updated });
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
