import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken, generateToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Only pending users can access setup
    if (decoded.role !== "pending") {
      return NextResponse.json({ message: "Setup already completed" }, { status: 400 });
    }

    const { role, username, childEmail } = await req.json();

    // ── Validate role ────────────────────────────────────────────────────────
    const allowedRoles = ["student", "teacher", "parent"];
    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.json({ message: "Please select a valid role." }, { status: 400 });
    }

    // ── Validate username ────────────────────────────────────────────────────
    if (!username) {
      return NextResponse.json({ message: "Username is required." }, { status: 400 });
    }
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json({
        message: "Username must be 3-20 characters: lowercase letters, numbers, underscores only.",
      }, { status: 400 });
    }
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json({ message: "Username already taken. Try another." }, { status: 409 });
    }

    // ── Parent: validate child email ─────────────────────────────────────────
    let childUser = null;
    if (role === "parent") {
      if (!childEmail) {
        return NextResponse.json({ message: "Child's email is required for the Parent role." }, { status: 400 });
      }
      childUser = await prisma.user.findUnique({ where: { email: childEmail } });
      if (!childUser || childUser.role !== "student") {
        return NextResponse.json({
          message: "No student account found with that email. Your child must register first.",
        }, { status: 404 });
      }
    }

    // ── Update user: set role + username ─────────────────────────────────────
    const isProfilePublic = ["student", "parent"].includes(role);
    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        role,
        username,
        isProfilePublic,
      },
    });

    // ── Parent: link child ───────────────────────────────────────────────────
    if (role === "parent" && childUser) {
      await prisma.user.update({
        where: { id: decoded.id },
        data: { children: { connect: { id: childUser.id } } },
      });
    }

    // ── Create "Set Password" notification ───────────────────────────────────
    await prisma.notification.create({
      data: {
        userId: updatedUser.id,
        type: "set_password",
        title: "⚠️ Set Your Password",
        body: "You signed in with Google. Set a password so you can also log in with your email.",
        linkUrl: "/dashboard/profile",
        read: false,
      },
    });

    // ── Re-issue JWT with correct role ────────────────────────────────────────
    const newToken = generateToken({ id: updatedUser.id, email: updatedUser.email, role: updatedUser.role });
    const roleToPath: Record<string, string> = {
      student: "/dashboard/student",
      teacher: "/dashboard/teacher",
      parent: "/dashboard/parent",
    };
    const redirectPath = roleToPath[role] ?? "/dashboard/student";

    const response = NextResponse.json({ message: "Setup complete!", redirect: redirectPath });
    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Google setup error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// GET: Check if current user still needs setup
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { role: true, username: true, name: true, image: true },
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
