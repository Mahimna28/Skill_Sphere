import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status:400 });
  }

  const child = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true, name: true }
  });

  if (!child) {
    return NextResponse.json({ message: "No student found with this Gmail. Please check the spelling." }, { status: 404 });
  }

  if (child.role !== "student") {
    return NextResponse.json({ message: "The provided Gmail belongs to a " + child.role + ", not a student." }, { status: 400 });
  }

  return NextResponse.json({ message: "Student found: " + child.name, childId: child.id });
}
