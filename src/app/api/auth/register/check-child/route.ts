import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status:400 });
  }

  const emails = email.split(",").map(e => e.trim()).filter(e => e);

  const children = await prisma.user.findMany({
    where: { email: { in: emails } },
    select: { id: true, role: true, name: true, email: true }
  });

  const missingEmails = emails.filter(e => !children.some(c => c.email.toLowerCase() === e.toLowerCase()));
  if (missingEmails.length > 0) {
    return NextResponse.json({ message: `No student found for: ${missingEmails.join(', ')}. Please check spelling.` }, { status: 404 });
  }

  const invalidRoleChildren = children.filter(c => c.role !== "student");
  if (invalidRoleChildren.length > 0) {
    return NextResponse.json({ message: `The following are not students: ${invalidRoleChildren.map(c => c.email).join(', ')}` }, { status: 400 });
  }

  return NextResponse.json({ message: "Students found: " + children.map(c => c.name).join(', ') });
}
