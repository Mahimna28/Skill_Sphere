import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const defaultNotificationPrefs = {
  inApp: true,
  email: true,
  courseUpdates: true,
  mentions: true,
  streaks: true,
  institutions: true,
  announcements: true,
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        role: true,
        googleId: true,
        password: true,
        bio: true,
        skills: true,
        learningGoal: true,
        degree: true,
        specialization: true,
        expertise: true,
        experienceYears: true,
        qualification: true,
        parentNotes: true,
        isProfilePublic: true,
        hideFromLeaderboard: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // notificationPrefs & hideFromLeaderboard not in schema — use defaults
    const notificationPrefs = defaultNotificationPrefs;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username || "",
        email: user.email,
        image: user.image || null,
        role: user.role,
        hasPassword: !!user.password,
        googleConnected: !!user.googleId || user.email.endsWith("@gmail.com"),
        githubConnected: false,
        notificationPrefs,
        bio: user.bio || "",
        skills: user.skills || "",
        learningGoal: user.learningGoal || "",
        degree: user.degree || "B.Tech",
        specialization: user.specialization || "",
        expertise: user.expertise || "",
        experienceYears: user.experienceYears || 0,
        qualification: user.qualification || "",
        parentNotes: user.parentNotes || "",
        isProfilePublic: user.isProfilePublic ?? true,
        hideFromLeaderboard: user.hideFromLeaderboard ?? false,
      },
    });
  } catch (error: any) {
    console.error("GET /api/user/settings error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name, username, connectGoogle, disconnectGoogle,
      bio, skills, learningGoal, degree, specialization, expertise,
      experienceYears, qualification, parentNotes, isProfilePublic, hideFromLeaderboard,
      childEmail
    } = body;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (skills !== undefined) updateData.skills = skills;
    if (learningGoal !== undefined) updateData.learningGoal = learningGoal;
    if (degree !== undefined) updateData.degree = degree;
    if (specialization !== undefined) updateData.specialization = specialization;
    if (expertise !== undefined) updateData.expertise = expertise;
    if (experienceYears !== undefined) updateData.experienceYears = parseInt(experienceYears) || 0;
    if (qualification !== undefined) updateData.qualification = qualification;
    if (parentNotes !== undefined) updateData.parentNotes = parentNotes;
    if (isProfilePublic !== undefined) updateData.isProfilePublic = isProfilePublic;
    if (hideFromLeaderboard !== undefined) updateData.hideFromLeaderboard = hideFromLeaderboard;

    if (username !== undefined && username !== user.username) {
      if (username !== "" && !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        return NextResponse.json(
          { message: "Username must be 3-20 alphanumeric characters or underscores." },
          { status: 400 }
        );
      }
      if (username !== "") {
        const existing = await prisma.user.findUnique({ where: { username } });
        if (existing && existing.id !== user.id) {
          return NextResponse.json({ message: "This username is already taken." }, { status: 400 });
        }
        updateData.username = username;
      } else {
        updateData.username = null;
      }
    }

    if (connectGoogle) {
      updateData.googleId = `google_${user.id}_${Date.now()}`;
    } else if (disconnectGoogle) {
      updateData.googleId = null;
    }

    if (childEmail && user.role === "parent") {
      const emails = childEmail.split(",").map((e: string) => e.trim()).filter((e: string) => e);
      const children = await prisma.user.findMany({ where: { email: { in: emails }, role: "student" } });
      
      const missingEmails = emails.filter((e: string) => !children.some(c => c.email.toLowerCase() === e.toLowerCase()));
      if (missingEmails.length > 0) {
        return NextResponse.json({ message: `One or more child accounts are invalid or not students: ${missingEmails.join(', ')}` }, { status: 400 });
      }
      if (children.length > 0) {
        updateData.children = { connect: children.map(c => ({ id: c.id })) };
      }
    }

    const updated = await prisma.user.update({
      where: { id: decoded.id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Settings saved successfully!",
      user: {
        id: updated.id,
        name: updated.name,
        username: updated.username || "",
        email: updated.email,
        image: updated.image || null,
        role: updated.role,
        hasPassword: !!updated.password,
        googleConnected: !!updated.googleId || updated.email.endsWith("@gmail.com"),
        githubConnected: false,
        notificationPrefs: defaultNotificationPrefs,
        bio: updated.bio || "",
        skills: updated.skills || "",
        learningGoal: updated.learningGoal || "",
        degree: updated.degree || "B.Tech",
        specialization: updated.specialization || "",
        expertise: updated.expertise || "",
        experienceYears: updated.experienceYears || 0,
        qualification: updated.qualification || "",
        parentNotes: updated.parentNotes || "",
        isProfilePublic: updated.isProfilePublic ?? true,
        hideFromLeaderboard: updated.hideFromLeaderboard ?? false,
      },
    });
  } catch (error: any) {
    console.error("PUT /api/user/settings error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
