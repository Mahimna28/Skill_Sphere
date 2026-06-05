const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: 'mahimnamistry281005@gmail.com' } });
  console.log('User found:', JSON.stringify(user, null, 2));
  if (user) {
    console.log('Role:', user.role);
    console.log('Is superadmin:', user.role === 'superadmin');
  } else {
    console.log('No user found with that email!');
  }
}

main().then(() => prisma.$disconnect()).catch(e => { console.error('Error:', e.message); prisma.$disconnect(); });
