const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Removing demo student Alex Johnson...");
  const result = await prisma.user.deleteMany({
    where: { email: "student@demo.com" }
  });
  console.log(`Deleted ${result.count} user(s).`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
