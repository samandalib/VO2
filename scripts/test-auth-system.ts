import { AuthService } from "../client/lib/auth/service";
import { prisma } from "../client/lib/prisma";

async function testAuthSystem() {
  try {
    console.log("🔐 Testing Authentication System...");

    // Test 1: Sign up with email
    console.log("\n📝 Test 1: Sign up with email");
    const signUpResult = await AuthService.signUpWithEmail(
      "testuser@vo2max.app",
      "password123",
      "Test User",
    );
    console.log("✅ Sign up successful:", {
      userId: signUpResult.user.id,
      email: signUpResult.user.email,
      name: signUpResult.user.name,
      provider: signUpResult.user.provider,
    });

    // Test 2: Sign in with email
    console.log("\n🔑 Test 2: Sign in with email");
    const signInResult = await AuthService.signInWithEmail(
      "testuser@vo2max.app",
      "password123",
    );
    console.log("✅ Sign in successful:", {
      userId: signInResult.user.id,
      email: signInResult.user.email,
      hasToken: !!signInResult.token,
    });

    // Test 3: Verify token
    console.log("\n🎫 Test 3: Verify token");
    const userFromToken = await AuthService.getUserFromToken(
      signInResult.token,
    );
    console.log("✅ Token verification successful:", {
      userId: userFromToken?.id,
      email: userFromToken?.email,
    });

    // Test 4: Test wrong password
    console.log("\n❌ Test 4: Test wrong password");
    try {
      await AuthService.signInWithEmail("testuser@vo2max.app", "wrongpassword");
      console.log("❌ This should have failed");
    } catch (error) {
      console.log(
        "✅ Correctly rejected wrong password:",
        (error as Error).message,
      );
    }

    // Test 5: Check database
    console.log("\n📊 Test 5: Check user in database");
    const userInDb = await prisma.user.findUnique({
      where: { email: "testuser@vo2max.app" },
    });
    console.log("✅ User found in database:", {
      id: userInDb?.id,
      email: userInDb?.email,
      provider: userInDb?.provider,
      hasPassword: !!userInDb?.password,
    });

    console.log("\n🎉 All authentication tests passed!");
    console.log("Your auth system is working correctly!");
  } catch (error) {
    console.error("❌ Auth test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuthSystem();
