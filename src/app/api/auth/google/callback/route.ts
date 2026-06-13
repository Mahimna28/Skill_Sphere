import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";

const SUPER_ADMIN_EMAIL = "mahimnamistry281005@gmail.com";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  // If Google returned an error
  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=oauth_cancelled`);
  }

  try {
    // ── Step 1: Exchange code for tokens ─────────────────────────────────────
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Google token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${baseUrl}/login?error=oauth_failed`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // ── Step 2: Fetch Google user profile ─────────────────────────────────────
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      return NextResponse.redirect(`${baseUrl}/login?error=profile_failed`);
    }

    const profile = await profileRes.json();
    const { id: googleId, email, name, picture } = profile;

    if (!email) {
      return NextResponse.redirect(`${baseUrl}/login?error=no_email`);
    }

    // ── Step 3: Find or create user ──────────────────────────────────────────
    let user = await prisma.user.findUnique({ where: { googleId } });

    if (!user) {
      // Try finding by email (existing password user linking their Google)
      user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        // Link Google to existing account
        user = await prisma.user.update({
          where: { email },
          data: {
            googleId,
            image: user.image || picture || null,
          },
        });
      } else {
        // Brand-new user — determine role
        let role = "pending"; // will be set on setup page
        if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
          role = "superadmin";
        }

        user = await prisma.user.create({
          data: {
            name: name || email.split("@")[0],
            email,
            googleId,
            image: picture || null,
            role,
            isProfilePublic: true,
          },
        });
      }
    }

    // ── Step 4: Backward compat — map old "admin" role ───────────────────────
    if (user.role === "admin") {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: "superadmin" },
      });
    }

    // ── Step 5: Generate JWT (same as existing system) ────────────────────────
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    // ── Step 6: Set cookie & redirect ─────────────────────────────────────────
    const roleToPath: Record<string, string> = {
      student: "/dashboard/student",
      teacher: "/dashboard/teacher",
      parent: "/dashboard/parent",
      superadmin: "/dashboard/admin",
      institute_admin: "/dashboard/teacher",
      pending: "/auth/google/setup",       // first-time users → onboarding
    };
    const redirectPath = roleToPath[user.role] ?? "/auth/google/setup";

    const response = NextResponse.redirect(`${baseUrl}${redirectPath}`);
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(`${baseUrl}/login?error=server_error`);
  }
}
