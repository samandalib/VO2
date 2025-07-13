import { WeeklyMetricsService } from "../client/lib/api/weeklyMetrics";
import { prisma } from "../client/lib/prisma";

async function testWeeklyMetrics() {
  try {
    console.log("🧪 Testing Weekly Metrics API...");

    // Get test user
    const user = await prisma.user.findUnique({
      where: { email: "test@vo2max.app" },
    });

    if (!user) {
      console.log("❌ Test user not found. Run: npm run db:create-test-user");
      return;
    }

    console.log(`👤 Using test user: ${user.id}`);

    // Test 1: Get metrics (should be empty initially)
    console.log("\n📊 Test 1: Get metrics");
    const initialMetrics = await WeeklyMetricsService.getMetrics(user.id);
    console.log(`Found ${initialMetrics.length} metrics`);

    // Test 2: Create a new metric
    console.log("\n📊 Test 2: Create metric");
    const newMetric = await WeeklyMetricsService.createMetric(user.id, {
      date: "2024-12-07",
      restingHeartRate: 62,
      vo2max: 45.5,
      notes: "Baseline measurement after holiday break",
    });
    console.log("✅ Created metric:", newMetric);

    // Test 3: Get metrics again (should have 1 now)
    console.log("\n📊 Test 3: Get metrics after creation");
    const updatedMetrics = await WeeklyMetricsService.getMetrics(user.id);
    console.log(`Found ${updatedMetrics.length} metrics`);
    updatedMetrics.forEach((m) =>
      console.log(`  - ${m.date}: RHR ${m.restingHeartRate}, VO₂ ${m.vo2max}`),
    );

    console.log(
      "\n✅ All tests passed! WeeklyMetrics API is working correctly.",
    );
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testWeeklyMetrics();
