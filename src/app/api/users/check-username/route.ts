import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/check-username?username=xxx
// Public endpoint used by the Google setup page for real-time availability check
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username")?.toLowerCase().trim();

  if (!username) {
    return NextResponse.json({ available: false, message: "Username is required" }, { status: 400 });
  }

  const usernameRegex = /^[a-z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return NextResponse.json({ available: false, message: "Invalid username format" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  return NextResponse.json({ available: !existing });
}
