import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// POST: Set username (first-time setup)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { username } = await req.json();
    if (!username) return NextResponse.json({ message: "Username is required" }, { status: 400 });

    // Validate format: lowercase, alphanumeric + underscore, 3-20 chars
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json({ 
        message: "Username must be 3-20 characters, lowercase letters, numbers, and underscores only." 
      }, { status: 400 });
    }

    // Check uniqueness
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ message: "This username is already taken. Try another." }, { status: 409 });
    }

    // Save username
    await prisma.user.update({
      where: { id: decoded.id },
      data: { username },
    });

    return NextResponse.json({ message: "Username set successfully!", username });
  } catch (error: any) {
    console.error("Username set error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// GET: Check if current user has a username
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { username: true },
    });

    return NextResponse.json({ username: user?.username || null });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
