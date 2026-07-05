import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Delete user
    await prisma.user.delete({
      where: { id: decoded.id },
    });

    // Clear auth cookie
    cookieStore.delete("token");

    return NextResponse.json({ message: "Account deleted successfully!" });
  } catch (error: any) {
    console.error("DELETE /api/user/account error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
