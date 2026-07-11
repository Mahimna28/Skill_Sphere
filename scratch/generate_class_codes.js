const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function main() {
  const coursesWithoutCode = await prisma.course.findMany({
    where: { classCode: null },
  });

  console.log(`Found ${coursesWithoutCode.length} courses without a class code.`);

  let updatedCount = 0;

  for (const course of coursesWithoutCode) {
    let code = generateCode();
    // Ensure uniqueness
    let exists = await prisma.course.findUnique({ where: { classCode: code } });
    while (exists) {
      code = generateCode();
      exists = await prisma.course.findUnique({ where: { classCode: code } });
    }

    await prisma.course.update({
      where: { id: course.id },
      data: { classCode: code },
    });
    
    console.log(`Updated course "${course.title}" with code: ${code}`);
    updatedCount++;
  }

  console.log(`Successfully generated and assigned class codes to ${updatedCount} courses.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
