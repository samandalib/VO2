/**
 * Test script to verify auth exports are working
 */

// Test the AuthContext export
try {
  const { AuthContext } = require("../client/contexts/AuthContext.tsx");
  console.log("✅ AuthContext export:", typeof AuthContext);
} catch (error) {
  console.log("❌ AuthContext export failed:", error.message);
}

// Test the new useAuth hook
try {
  const { useAuth } = require("../client/hooks/useAuth.ts");
  console.log("✅ useAuth hook export:", typeof useAuth);
} catch (error) {
  console.log("❌ useAuth hook export failed:", error.message);
}

console.log("🎉 Auth exports test completed!");
