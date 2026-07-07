import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import { BookOpen, MessageSquare } from "lucide-react";
import StudentChatClient from "./StudentChatClient";

export default async function StudentChatPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  let enrollments: any[] = [];
  let user: any = null;

  if (decoded?.id) {
    user = await prisma.user.findUnique({ where: { id: decoded.id }, select: { id: true, name: true, role: true } });
    enrollments = await prisma.enrollment.findMany({
      where: { userId: decoded.id },
      include: { course: { select: { id: true, title: true, subject: true } } },
      orderBy: { enrolledAt: "asc" },
    });

    if (user?.role === "teacher" || user?.role === "institute_admin" || user?.role === "superadmin" || user?.role === "admin") {
      const teachingCourses = await prisma.course.findMany({
        where: { teacherId: decoded.id },
        select: { id: true, title: true, subject: true }
      });
      
      const existingCourseIds = new Set(enrollments.map(e => e.course.id));
      teachingCourses.forEach(course => {
        if (!existingCourseIds.has(course.id)) {
          enrollments.push({
            course: course
          });
        }
      });
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Sleek Page Header */}
      <div className="border-b border-[#1E1B2E]/10 pb-6">
        <h1
          className="text-[28px] sm:text-3xl font-extrabold text-[#1E1B2E] leading-tight tracking-tight"
          style={{ fontFamily: "var(--font-heading, serif)" }}
        >
          Course Chat
        </h1>
        <p className="text-[#8E8E93] text-sm font-medium mt-1">
          Collaborate with peers and instructors
        </p>
      </div>

      {enrollments.length === 0 ? (
        /* Frosted Glass Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(30,27,46,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-[#1E1B2E]/5 border border-[#1E1B2E]/10 flex items-center justify-center mb-5 relative z-10">
            <MessageSquare className="h-8 w-8 text-[#C9A96E]" />
          </div>
          <h2
            className="text-2xl font-bold text-[#1E1B2E] mb-2 relative z-10"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            No Course Chats Available
          </h2>
          <p className="text-[#8E8E93] text-sm font-medium max-w-md mb-8 relative z-10">
            Enroll in a course to unlock live study rooms, discuss lecture topics, and collaborate with classmates.
          </p>
          <Link href="/dashboard/student/courses" className="relative z-10">
            <button className="h-[44px] px-8 rounded-xl bg-gradient-to-r from-[#C9A96E] via-[#E2C48D] to-[#C9A96E] bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 text-[#1E1B2E] font-bold text-sm uppercase tracking-wider shadow-[0_4px_14px_rgba(201,169,110,0.3)] hover:shadow-[0_8px_24px_rgba(201,169,110,0.5)] cursor-pointer flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5" />
              <span>Explore Courses</span>
            </button>
          </Link>
        </div>
      ) : (
        /* Chat UI Client Component */
        <StudentChatClient
          enrollments={enrollments}
          currentUser={{ id: user?.id || "", name: user?.name || "Student" }}
        />
      )}
    </div>
  );
}
