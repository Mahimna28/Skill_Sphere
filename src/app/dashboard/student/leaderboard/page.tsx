import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import LeaderboardClient, { StudentRankItem } from "./LeaderboardClient";

export default async function StudentLeaderboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  const users = await prisma.user.findMany({
    where: {
      role: "student",
    },
    orderBy: { points: "desc" },
    select: {
      id: true,
      name: true,
      image: true,
      points: true,
      currentStreak: true,
      institution: { select: { name: true } },
      _count: {
        select: {
          enrollments: true,
          completedLessons: true,
        },
      },
    },
  });

  const students: StudentRankItem[] = users.map((user) => {
    const enrollmentsCount = user._count.enrollments || 1;
    // Estimate course completion percentage (assuming avg 5 lessons per course)
    const estimatedTotalLessons = enrollmentsCount * 5;
    const rawProgress = Math.round((user._count.completedLessons / estimatedTotalLessons) * 100);
    const progress = Math.min(100, Math.max(0, isNaN(rawProgress) ? 0 : rawProgress));

    return {
      id: user.id,
      name: user.name,
      image: user.image,
      points: user.points,
      currentStreak: user.currentStreak || 0,
      institutionName: user.institution?.name || "Global Academy",
      progress,
    };
  });

  return <LeaderboardClient students={students} currentUserId={decoded?.id} />;
}
