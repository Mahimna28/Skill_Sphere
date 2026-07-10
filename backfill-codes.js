const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfill() {
  const courses = await prisma.course.findMany({
    where: { classCode: null, isPublic: false }
  });

  for (const course of courses) {
    let classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Ensure unique
    while (await prisma.course.findUnique({ where: { classCode } })) {
      classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    await prisma.course.update({
      where: { id: course.id },
      data: { classCode }
    });
    console.log(`Backfilled class code ${classCode} for course ${course.id}`);
  }
}

backfill().then(() => prisma.$disconnect()).catch(console.error);
