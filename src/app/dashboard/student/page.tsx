import React from "react";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import StudentOverviewClient from "./StudentOverviewClient";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded?.id) redirect("/login");

  let user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) redirect("/login");

  // --- 1. Automatic Streak Logic ---
  const now = new Date();
  const lastActive = new Date(user.lastActiveAt || Date.now());
  
  // Strip time for pure day difference comparison
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastActiveDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
  
  const msInDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round((todayDate.getTime() - lastActiveDate.getTime()) / msInDay);
  
  let newStreak = user.currentStreak || 0;
  let newLongestStreak = user.longestStreak || 0;
  let shouldUpdate = false;

  if (diffDays === 1) {
    // Consecutive day login
    newStreak += 1;
    if (newStreak > newLongestStreak) newLongestStreak = newStreak;
    shouldUpdate = true;
  } else if (diffDays > 1) {
    // Streak broken
    newStreak = 1;
    shouldUpdate = true;
  } else if (diffDays === 0 && newStreak === 0) {
    // First time ever
    newStreak = 1;
    shouldUpdate = true;
  }

  if (shouldUpdate || diffDays > 0) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastActiveAt: now,
        points: shouldUpdate && diffDays === 1 ? { increment: 10 } : undefined
      }
    });
  }

  // --- 2. Data Fetching ---
  const rawEnrollments = await prisma.enrollment.findMany({
    where: { 
      userId: user.id,
      course: { classCode: null } // Explicitly filter out classes
    },
    include: { 
      course: { 
        include: { 
          teacher: { select: { name: true } },
          modules: { include: { lessons: { select: { id: true } } } }
        } 
      } 
    },
    orderBy: { enrolledAt: "desc" },
  });

  const completedLessons = await prisma.lessonCompletion.findMany({
    where: { userId: user.id },
    select: { lessonId: true }
  });
  const completedLessonIds = new Set(completedLessons.map(c => c.lessonId));

  const certificates = await prisma.certificate.findMany({
    where: { userId: user.id },
    orderBy: { issueDate: "desc" },
  });
  
  const enrollments = rawEnrollments.map((e) => {
    // Dynamically calculate progress based on completed lessons
    const allLessonIds = e.course.modules.flatMap(m => m.lessons.map(l => l.id));
    const totalLessons = allLessonIds.length;
    let dynamicProgress = e.progress;
    
    if (totalLessons > 0) {
      const completedCount = allLessonIds.filter(id => completedLessonIds.has(id)).length;
      dynamicProgress = Math.round((completedCount / totalLessons) * 100);
    }

    // If the user has a certificate for this course, it is 100% complete
    const hasCert = certificates.some(c => c.title.toLowerCase().includes(e.course.title.toLowerCase()));
    if (hasCert) {
      dynamicProgress = 100;
    }

    // Always take the maximum between DB recorded progress and dynamically calculated progress
    const actualProgress = Math.max(e.progress, dynamicProgress);

    return {
      id: e.course.id,
      title: e.course.title,
      progress: actualProgress,
      teacher: e.course.teacher?.name || "Instructor",
      thumbnail: e.course.thumbnail || null,
    };
  });
  
  const marks = await prisma.marks.findMany({ 
    where: { studentId: user.id },
    orderBy: { createdAt: "desc" }
  });

  // --- 3. Unified Activity Feed ---
  const allActivities = [
    ...rawEnrollments.map(e => ({
      id: `enroll-${e.id}`,
      type: "course" as const,
      title: `Enrolled in ${e.course.title}`,
      subtitle: `Progress: ${e.progress}%`,
      time: e.enrolledAt.toISOString(),
    })),
    ...marks.map(m => ({
      id: `mark-${m.id}`,
      type: "score" as const,
      title: `Scored ${m.score}% in ${m.subject}`,
      subtitle: "Exam Result",
      time: m.createdAt.toISOString(),
    })),
    ...certificates.map(c => ({
      id: `cert-${c.id}`,
      type: "certificate" as const,
      title: `Earned Certificate: ${c.title}`,
      subtitle: "Course Completed",
      time: c.issueDate.toISOString(),
    }))
  ];
  
  const recentActivity = allActivities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  const safeUser = {
    name: user.name || "Student",
    points: user.points || 0,
    studyHours: user.studyHours || 0,
    currentStreak: user.currentStreak || 0,
    longestStreak: user.longestStreak || 0,
    checkedInToday: diffDays === 0 && shouldUpdate === false,
    level: Math.floor((user.points || 0) / 100) + 1,
  };

  return (
    <StudentOverviewClient
      user={safeUser}
      enrollments={enrollments}
      marks={marks}
      certificates={certificates}
      recentActivity={recentActivity}
    />
  );
}
