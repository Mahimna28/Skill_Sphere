import { prisma } from "./prisma";

export async function checkClassAccess(courseId: string, userId: string): Promise<boolean> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { coTeachers: { select: { id: true } } }
  });
  if (!course) return false;
  
  if (course.teacherId === userId) return true;
  if (course.coTeachers.some(t => t.id === userId)) return true;
  
  return false;
}
