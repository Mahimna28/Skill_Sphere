const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: { email: 'mahimnamistry281005@gmail.com' },
    data: { role: 'superadmin' }
  });
  console.log('Updated', result.count, 'user(s) to superadmin role.');
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); });
