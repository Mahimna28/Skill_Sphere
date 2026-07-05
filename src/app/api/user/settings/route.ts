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
        githubId: true,
        password: true,
        notificationPrefs: true,
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

    let notificationPrefs = defaultNotificationPrefs;
    if (user.notificationPrefs) {
      try {
        notificationPrefs = {
          ...defaultNotificationPrefs,
          ...JSON.parse(user.notificationPrefs),
        };
      } catch (e) {
        console.error("Failed to parse notificationPrefs:", e);
      }
    }

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
        githubConnected: !!user.githubId,
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
      name, username, notificationPrefs, connectGoogle, disconnectGoogle, connectGithub, disconnectGithub,
      bio, skills, learningGoal, degree, specialization, expertise, experienceYears, qualification, parentNotes, isProfilePublic, hideFromLeaderboard
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
    if (isProfilePublic !== undefined) {
      updateData.isProfilePublic = isProfilePublic;
    }
    if (hideFromLeaderboard !== undefined) {
      updateData.hideFromLeaderboard = hideFromLeaderboard;
    }

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

    if (notificationPrefs !== undefined) {
      updateData.notificationPrefs = JSON.stringify(notificationPrefs);
    }

    if (connectGoogle) {
      updateData.googleId = `google_${user.id}_${Date.now()}`;
    } else if (disconnectGoogle) {
      updateData.googleId = null;
    }

    if (connectGithub) {
      updateData.githubId = `github_${user.id}_${Date.now()}`;
    } else if (disconnectGithub) {
      updateData.githubId = null;
    }

    const updated = await prisma.user.update({
      where: { id: decoded.id },
      data: updateData,
    });

    let parsedPrefs = defaultNotificationPrefs;
    if (updated.notificationPrefs) {
      try {
        parsedPrefs = {
          ...defaultNotificationPrefs,
          ...JSON.parse(updated.notificationPrefs),
        };
      } catch (e) {}
    }

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
        githubConnected: !!updated.githubId,
        notificationPrefs: parsedPrefs,
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
