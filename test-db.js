const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const assignments = await prisma.assignment.findMany();
  console.log("Assignments in DB:", assignments);
  await prisma.$disconnect();
}
main();
