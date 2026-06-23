import { prisma } from "@/lib/prisma";
import { LandingPageClient } from "@/components/home/LandingPageClient";

export default async function LandingPage() {
  const [dbCourses, userCount, courseCount, institutionCount, completionCount] = await Promise.all([
    prisma.course.findMany({
      where: { isPublic: { equals: true } },
      include: { _count: { select: { enrollments: true } }, teacher: { select: { name: true } } },
      take: 3,
      orderBy: { enrollments: { _count: "desc" } }
    }),
    prisma.user.count(),
    prisma.course.count(),
    prisma.institution.count(),
    prisma.lessonCompletion.count()
  ]);

  return (
    <main>
      <LandingPageClient 
        dbCourses={dbCourses} 
        stats={{ userCount, courseCount, institutionCount, completionCount }}
      />
    </main>
  );
}
