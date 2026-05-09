const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany();
  
  for (const course of courses) {
    // Add 2 modules per course
    for (let i = 1; i <= 2; i++) {
      const module = await prisma.module.create({
        data: {
          title: `Module ${i}: Core Fundamentals`,
          order: i,
          courseId: course.id,
        },
      });

      // Add 3 lessons per module
      for (let j = 1; j <= 3; j++) {
        await prisma.lesson.create({
          data: {
            title: `Lesson ${j}: Introduction to ${course.subject}`,
            content: `This is the detailed content for Lesson ${j} of ${module.title}. In this lesson, we explore the essential concepts that define ${course.subject}.`,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder video
            order: j,
            moduleId: module.id,
          },
        });
      }
    }
  }
  console.log("Successfully seeded course modules and lessons!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
