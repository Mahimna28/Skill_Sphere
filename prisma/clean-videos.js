const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up placeholder YouTube videos...");
  
  const result = await prisma.lesson.updateMany({
    where: {
      videoUrl: {
        contains: "youtube.com/embed/dQw4w9WgXcQ"
      }
    },
    data: {
      videoUrl: null
    }
  });

  console.log(`Successfully removed ${result.count} placeholder videos!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
