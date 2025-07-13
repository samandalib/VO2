import { prisma } from "../client/lib/prisma";

async function checkData() {
  try {
    console.log("🔍 Checking database data...");

    // Check protocols
    const protocols = await prisma.protocol.findMany({
      select: { name: true, researchers: true },
    });

    console.log(`📊 Found ${protocols.length} protocols:`);
    protocols.forEach((p) => console.log(`  - ${p.name} by ${p.researchers}`));

    // Check if other tables exist
    const userCount = await prisma.user.count();
    const weeklyCount = await prisma.weeklyMetrics.count();
    const sessionCount = await prisma.sessionMetrics.count();
    const biomarkerCount = await prisma.biomarker.count();

    console.log(`\n📈 Table counts:`);
    console.log(`  - Users: ${userCount}`);
    console.log(`  - Weekly Metrics: ${weeklyCount}`);
    console.log(`  - Session Metrics: ${sessionCount}`);
    console.log(`  - Biomarkers: ${biomarkerCount}`);

    await prisma.$disconnect();
    console.log("\n✅ Database check complete!");
  } catch (error) {
    console.error("❌ Error checking data:", error);
  }
}

checkData();
