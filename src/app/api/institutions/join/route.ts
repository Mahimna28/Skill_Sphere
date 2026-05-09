import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const institutions = await prisma.institution.findMany({
    select: { id: true, name: true, _count: { select: { members: true } } }
  });
  return NextResponse.json({ institutions });
}

export async function POST(req: Request) {
  try {
    const { institutionId } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const request = await prisma.joinRequest.create({
      data: {
        userId: decoded.id,
        institutionId,
        status: "pending"
      }
    });

    return NextResponse.json({ message: "Request sent to Admin!", request });
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ message: "Request already pending" }, { status: 400 });
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
