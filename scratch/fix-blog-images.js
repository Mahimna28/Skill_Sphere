const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany();
  
  const placeholders = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop"
  ];
  
  for (let i = 0; i < posts.length; i++) {
    await prisma.post.update({
      where: { id: posts[i].id },
      data: { coverImage: placeholders[i % placeholders.length] }
    });
  }
  
  console.log("Updated images successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
