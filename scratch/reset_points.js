const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Resetting all user points to 0...");
  const result = await prisma.user.updateMany({
    data: { points: 0 },
  });
  console.log(`Updated ${result.count} users.`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
