import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import ParentOverviewClient from "./ParentOverviewClient";

export default async function ParentDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || decoded.role !== "parent") redirect("/login");

  // Fetch parent with real children
  const parent = await prisma.user.findUnique({
    where: { id: decoded.id },
    include: {
      children: {
        include: {
          enrollments: { 
            include: { 
              course: { 
                include: { 
                  modules: { include: { _count: { select: { lessons: true } } } },
                  assignments: {
                    include: {
                      submissions: {
                        include: { assignment: true }
                      }
                    }
                  }
                } 
              } 
            } 
          },
          marks: { orderBy: { createdAt: "desc" } },
          completedLessons: { include: { lesson: { select: { moduleId: true } } } }
        },
      },
    },
  });

  if (!parent) redirect("/login");

  const processedChildren = parent.children.map((child: any) => {
    const avgScore = child.marks && child.marks.length > 0
      ? Math.round(child.marks.reduce((s: any, m: any) => s + m.score, 0) / child.marks.length)
      : null;

    let totalLessonsAcc = 0;
    let totalCompletionsAcc = 0;
    
    const coursesWithProgress = child.enrollments.map((enr: any) => {
      const totalLessons = enr.course.modules.reduce((sum: number, mod: any) => sum + mod._count.lessons, 0);
      const courseModuleIds = enr.course.modules.map((m: any) => m.id);
      const completedLessons = child.completedLessons ? child.completedLessons.filter((lc: any) => courseModuleIds.includes(lc.lesson.moduleId)).length : 0;
      
      totalLessonsAcc += totalLessons;
      totalCompletionsAcc += completedLessons;
      
      return {
        ...enr.course,
        totalLessons,
        completedLessons,
        progress: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100)
      };
    });

    const overallAttendance = totalLessonsAcc === 0 ? 0 : Math.round((totalCompletionsAcc / totalLessonsAcc) * 100);

    return {
      ...child,
      avgScore,
      coursesWithProgress,
      overallAttendance
    };
  });

  return (
    <ParentOverviewClient childrenData={processedChildren} />
  );
}
