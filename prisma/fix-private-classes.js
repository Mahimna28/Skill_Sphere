const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function run() {
  // Find all courses with isPublic=true that are NOT from the demo seed teacher
  // and update them to isPublic=false (treat them as private classes)
  const demoTeacher = await p.user.findUnique({ where: { email: 'teacher@demo.com' } });
  
  // Get all non-demo teachers
  const customTeachers = await p.user.findMany({
    where: { role: 'teacher', NOT: { id: demoTeacher?.id ?? '' } }
  });
  
  console.log('Custom teachers found:', customTeachers.map(t => `${t.name} (${t.email})`));
  
  for (const teacher of customTeachers) {
    const updated = await p.course.updateMany({
      where: { teacherId: teacher.id, isPublic: true },
      data: { isPublic: false }
    });
    console.log(`Updated ${updated.count} courses for teacher: ${teacher.name} → set to Private`);
  }
  
  await p.$disconnect();
  console.log('Done!');
}

run().catch(console.error);
