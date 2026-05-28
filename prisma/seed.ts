import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a dummy user
  const hashedPassword = await hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      clerkId: 'user_2aBcDeFgHiJkLmNoPqRsTuVwXyZ',
      email: 'test@example.com',
      name: 'Test User',
    },
  });
  console.log({ user });

  // Create some dummy products
  const product1 = await prisma.product.upsert({
    where: { id: 'prod_1' },
    update: {},
    create: {
      id: 'prod_1',
      name: 'Stylish T-Shirt',
      description: 'A comfortable and stylish cotton t-shirt.',
      imageUrl: '/products/tshirt.webp',
      price: 25.99,
      userId: user.id,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { id: 'prod_2' },
    update: {},
    create: {
      id: 'prod_2',
      name: 'Denim Jeans',
      description: 'Classic fit denim jeans for everyday wear.',
      imageUrl: '/products/jeans.webp',
      price: 59.99,
      userId: user.id,
    },
  });

  const product3 = await prisma.product.upsert({
    where: { id: 'prod_3' },
    update: {},
    create: {
      id: 'prod_3',
      name: 'Leather Wallet',
      description: 'A sleek leather wallet with multiple card slots.',
      imageUrl: '/products/wallet.webp',
      price: 35.00,
      userId: user.id,
    },
  });

  console.log({ product1, product2, product3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
