const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { id: 'cmoyb7puy0001el28rz45y5jv' } });
  console.log('User found:', JSON.stringify(user, null, 2));
  if (user) {
    console.log('Role:', user.role);
    console.log('Is superadmin:', user.role === 'superadmin');
  } else {
    console.log('No user found with that email!');
  }
}

main().then(() => prisma.$disconnect()).catch(e => { console.error('Error:', e.message); prisma.$disconnect(); });
