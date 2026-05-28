import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.product.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users (hashed passwords are not used with Clerk)
  const user1 = await prisma.user.create({
    data: {
      id: "user_clerk_1", // Clerk user ID
      clerkId: "user_clerk_1",
      email: "user1@example.com",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: "user_clerk_2", // Clerk user ID
      clerkId: "user_clerk_2",
      email: "user2@example.com",
    },
  });

  // Create sample products
  const product1 = await prisma.product.create({
    data: {
      name: "Laptop Pro",
      description: "A powerful laptop for professionals.",
      imageUrl: "https://utfs.io/f/75c3b956-5c1c-486e-951c-826e35c28014-laptop.png",
      price: 1200.00,
      stock: 10,
      userId: user1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Wireless Mouse",
      description: "Ergonomic and responsive wireless mouse.",
      imageUrl: "https://utfs.io/f/21f7e35a-c5b2-41b1-85a5-f4674c39b79c-mouse.png",
      price: 25.50,
      stock: 50,
      userId: user1.id,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: "Mechanical Keyboard",
      description: "Clicky and satisfying mechanical keyboard.",
      imageUrl: "https://utfs.io/f/42d12345-6789-0abc-def0-1234567890ab-keyboard.png",
      price: 75.00,
      stock: 20,
      userId: user2.id,
    },
  });

  // Create sample carts
  const cart1 = await prisma.cart.create({
    data: {
      userId: user1.id,
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
          },
          {
            productId: product2.id,
            quantity: 2,
          },
        ],
      },
    },
  });

  const cart2 = await prisma.cart.create({
    data: {
      userId: user2.id,
      items: {
        create: [
          {
            productId: product3.id,
            quantity: 1,
          },
        ],
      },
    },
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
