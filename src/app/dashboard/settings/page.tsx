import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

const defaultNotificationPrefs = {
  inApp: true,
  email: true,
  courseUpdates: true,
  mentions: true,
  streaks: true,
  institutions: true,
  announcements: true,
};

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded) redirect("/login");

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

  if (!user) redirect("/login");

  let notificationPrefs = defaultNotificationPrefs;
  if (user.notificationPrefs) {
    try {
      notificationPrefs = {
        ...defaultNotificationPrefs,
        ...JSON.parse(user.notificationPrefs),
      };
    } catch (e) {}
  }

  const initialUser = {
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
  };

  return <SettingsClient initialUser={initialUser} />;
}
