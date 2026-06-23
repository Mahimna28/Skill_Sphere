import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TeacherProfileClient from "./TeacherProfileClient";

export default async function TeacherProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  
  const teacher = await prisma.user.findUnique({
    where: { username: resolvedParams.username }
  });

  // If user not found, or they're not a teacher, throw 404
  if (!teacher || teacher.role !== "teacher") {
    notFound();
  }

  // A teacher can have courses directly linked to their user record or via a teacherProfile relation.
  // In the current schema, course is linked to User id.
  const courses = await prisma.course.findMany({
    where: { teacherId: teacher.id, isPublic: true },
    include: {
      _count: { select: { enrollments: true } }
    }
  });

  return <TeacherProfileClient teacher={teacher} courses={courses} />;
}
