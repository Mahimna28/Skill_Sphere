const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        tags: true,
        readTime: true,
        publishedAt: true,
        author: {
          select: {
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        publishedAt: "desc"
      }
    });
    console.log("Success", posts.length);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
