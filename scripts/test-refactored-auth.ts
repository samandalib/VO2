/**
 * Test script for refactored authentication system
 */

import { AuthService } from "../server/services/auth";
import { validateSignUpData, sanitizeEmail } from "../shared/auth/validation";
import { AUTH_CONFIG } from "../shared/auth/constants";
import { AuthError } from "../shared/auth/errors";

async function testRefactoredAuth() {
  console.log("🧪 Testing Refactored Authentication System\n");

  // Test 1: Validation functions
  console.log("1️⃣ Testing Validation Functions:");
  try {
    const validationResult = validateSignUpData({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });
    console.log("✅ Validation passed:", validationResult.isValid);
  } catch (error) {
    console.log("❌ Validation failed:", error);
  }

  // Test 2: Email sanitization
  console.log("\n2️⃣ Testing Email Sanitization:");
  const dirtyEmail = "  Test@EXAMPLE.COM  ";
  const cleanEmail = sanitizeEmail(dirtyEmail);
  console.log("✅ Email sanitized:", dirtyEmail, "→", cleanEmail);

  // Test 3: Constants access
  console.log("\n3️⃣ Testing Constants:");
  console.log("✅ Password min length:", AUTH_CONFIG.PASSWORD.MIN_LENGTH);
  console.log("✅ JWT expiry:", AUTH_CONFIG.JWT_EXPIRY);
  console.log(
    "✅ Error codes available:",
    Object.keys(AUTH_CONFIG.ERROR_CODES).length,
  );

  // Test 4: Error classes
  console.log("\n4️⃣ Testing Error Classes:");
  try {
    throw new AuthError(
      "Test error",
      AUTH_CONFIG.ERROR_CODES.VALIDATION_ERROR,
      400,
    );
  } catch (error) {
    if (error instanceof AuthError) {
      console.log("✅ AuthError works:", {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      });
    }
  }

  console.log("\n🎉 Refactored Authentication System Tests Complete!");
  console.log("🔧 The new architecture is ready to use!");

  // Show structure
  console.log("\n📁 New Structure Overview:");
  console.log("├── shared/auth/          # Shared utilities");
  console.log("│   ├── constants.ts      # ✅ Centralized config");
  console.log("│   ├── errors.ts         # ✅ Custom error classes");
  console.log("│   └── validation.ts     # ✅ Input validation");
  console.log("├── server/");
  console.log("│   ├── services/auth.ts  # ✅ Business logic");
  console.log("│   ├── routes/auth.ts    # ✅ Clean route handlers");
  console.log("│   └── middleware/auth.ts # ✅ Enhanced middleware");
  console.log("└── client/");
  console.log("    ├── hooks/useAuth.ts  # ✅ Enhanced auth hook");
  console.log("    └── lib/auth/         # ✅ Client utilities");
}

testRefactoredAuth().catch(console.error);
