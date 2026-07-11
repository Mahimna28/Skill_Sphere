const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Remove classCode from regular courses (where departmentId is null)
  const regularCourses = await prisma.course.findMany({
    where: { 
      departmentId: null,
      classCode: { not: null }
    },
  });

  console.log(`Found ${regularCourses.length} regular courses that incorrectly have a class code.`);

  let removedCount = 0;
  for (const course of regularCourses) {
    await prisma.course.update({
      where: { id: course.id },
      data: { classCode: null },
    });
    removedCount++;
  }
  console.log(`Successfully removed class codes from ${removedCount} regular courses.`);

  // 2. Ensure all institute classes (where departmentId is not null) have a classCode
  const instituteClasses = await prisma.course.findMany({
    where: {
      departmentId: { not: null },
      classCode: null
    }
  });

  console.log(`Found ${instituteClasses.length} institute classes missing a class code.`);

  function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  let generatedCount = 0;
  for (const course of instituteClasses) {
    let code = generateCode();
    let exists = await prisma.course.findUnique({ where: { classCode: code } });
    while (exists) {
      code = generateCode();
      exists = await prisma.course.findUnique({ where: { classCode: code } });
    }
    await prisma.course.update({
      where: { id: course.id },
      data: { classCode: code },
    });
    generatedCount++;
  }

  console.log(`Successfully generated class codes for ${generatedCount} institute classes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
