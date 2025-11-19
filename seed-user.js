const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Test@123', 10);

  const user = await prisma.user.create({
    data: {
      email: 'aadiltaitech@gmail.com',
      password: hashedPassword,
      name: 'Aadil',
    },
  });

  console.log('User created successfully:');
  console.log('Email:', user.email);
  console.log('Password: Test@123');
  console.log('User ID:', user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
