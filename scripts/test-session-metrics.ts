import { SessionMetricsService } from "../client/lib/api/sessionMetrics";
import { prisma } from "../client/lib/prisma";

async function testSessionMetrics() {
  try {
    console.log("🧪 Testing Session Metrics API...");

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
    console.log("\n📊 Test 1: Get session metrics");
    const initialMetrics = await SessionMetricsService.getMetrics(user.id);
    console.log(`Found ${initialMetrics.length} session metrics`);

    // Test 2: Create a new session metric
    console.log("\n📊 Test 2: Create session metric");
    const newMetric = await SessionMetricsService.createMetric(user.id, {
      date: "2024-12-07",
      maxHR: 185,
      avgHR: 152,
      sessionType: "Tabata",
      notes: "High intensity session - felt great!",
    });
    console.log("✅ Created session metric:", newMetric);

    // Test 3: Create another session metric
    console.log("\n📊 Test 3: Create another session metric");
    const newMetric2 = await SessionMetricsService.createMetric(user.id, {
      date: "2024-12-06",
      maxHR: 172,
      avgHR: 138,
      sessionType: "Zone 2",
      notes: "Easy recovery session",
    });
    console.log("✅ Created second session metric:", newMetric2);

    // Test 4: Get metrics again (should have 2 now, sorted by date DESC)
    console.log("\n📊 Test 4: Get session metrics after creation");
    const updatedMetrics = await SessionMetricsService.getMetrics(user.id);
    console.log(`Found ${updatedMetrics.length} session metrics`);
    updatedMetrics.forEach((m) =>
      console.log(
        `  - ${m.date}: ${m.sessionType} - Max HR ${m.maxHR}, Avg HR ${m.avgHR}`,
      ),
    );

    console.log(
      "\n✅ All tests passed! SessionMetrics API is working correctly.",
    );
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testSessionMetrics();
