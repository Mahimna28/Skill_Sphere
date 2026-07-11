import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyAuth(token);
    if (!decoded || decoded.role !== "parent") {
      return NextResponse.json({ message: "Unauthorized or not a parent" }, { status: 403 });
    }

    const { childEmail } = await req.json();
    if (!childEmail) {
      return NextResponse.json({ message: "Child email is required" }, { status: 400 });
    }

    // Find the child by email
    const child = await prisma.user.findUnique({
      where: { email: childEmail.toLowerCase() },
    });

    if (!child) {
      return NextResponse.json({ message: "No account found with this email." }, { status: 404 });
    }

    if (child.role !== "student") {
      return NextResponse.json({ message: "This email does not belong to a student account." }, { status: 400 });
    }

    // Link the child to the parent
    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        children: {
          connect: { id: child.id },
        },
      },
    });

    return NextResponse.json({ message: "Child linked successfully!", childId: child.id });
  } catch (error) {
    console.error("Link child error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
