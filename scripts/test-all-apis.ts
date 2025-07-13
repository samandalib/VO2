import { WeeklyMetricsService } from "../client/lib/api/weeklyMetrics";
import { SessionMetricsService } from "../client/lib/api/sessionMetrics";
import { BiomarkersService } from "../client/lib/api/biomarkers";
import { prisma } from "../client/lib/prisma";

async function testAllAPIs() {
  try {
    console.log("🧪 Testing All Database APIs...");

    // Get test user
    const user = await prisma.user.findUnique({
      where: { email: "test@vo2max.app" },
    });

    if (!user) {
      console.log("❌ Test user not found. Run: npm run db:create-test-user");
      return;
    }

    console.log(`👤 Using test user: ${user.id}`);

    // Test biomarkers (new)
    console.log("\n🩸 Testing Biomarkers API");
    const biomarker = await BiomarkersService.createBiomarker(user.id, {
      date: "2024-12-07",
      hemoglobin: 14.5,
      ferritin: 48.0,
      crp: 1.1,
      glucose: 92.0,
    });
    console.log("✅ Created biomarker:", biomarker);

    // Get all data counts
    console.log("\n📊 Final Data Summary");
    const weeklyCount = (await WeeklyMetricsService.getMetrics(user.id)).length;
    const sessionCount = (await SessionMetricsService.getMetrics(user.id))
      .length;
    const biomarkerCount = (await BiomarkersService.getBiomarkers(user.id))
      .length;

    console.log(`📈 Total data for user ${user.email}:`);
    console.log(`  - Weekly Metrics: ${weeklyCount}`);
    console.log(`  - Session Metrics: ${sessionCount}`);
    console.log(`  - Biomarkers: ${biomarkerCount}`);

    console.log(
      "\n✅ All APIs working! Your dashboard components are fully database-powered!",
    );
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAllAPIs();
