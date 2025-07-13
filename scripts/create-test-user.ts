import { prisma } from "../client/lib/prisma";

async function createTestUser() {
  try {
    console.log("🔍 Creating test user...");

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "test@vo2max.app" },
    });

    if (existingUser) {
      console.log(`✅ Test user already exists with ID: ${existingUser.id}`);
      return existingUser;
    }

    // Create new test user
    const user = await prisma.user.create({
      data: {
        email: "test@vo2max.app",
        name: "Test User",
      },
    });

    console.log(`✅ Created test user with ID: ${user.id}`);
    console.log(`📧 Email: ${user.email}`);

    return user;
  } catch (error) {
    console.error("❌ Error creating test user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
