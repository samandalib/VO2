import { prisma } from "../client/lib/prisma";

async function createSampleDataForUser() {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: "demo@vo2max.app" },
    });

    if (!user) {
      console.error("User not found");
      return;
    }

    console.log(`Creating sample data for user: ${user.name} (${user.email})`);

    // Create Weekly Metrics data (last 8 weeks)
    const weeklyMetricsData = [
      {
        date: new Date("2024-12-01"),
        restingHeartRate: 62,
        vo2max: 42.5,
        notes: "Feeling strong this week, good recovery after training",
      },
      {
        date: new Date("2024-12-08"),
        restingHeartRate: 60,
        vo2max: 43.2,
        notes: "Improved cardiovascular fitness, excellent sleep quality",
      },
      {
        date: new Date("2024-12-15"),
        restingHeartRate: 58,
        vo2max: 44.1,
        notes: "Great progress! New PR in 5K time trial",
      },
      {
        date: new Date("2024-12-22"),
        restingHeartRate: 59,
        vo2max: 43.8,
        notes: "Holiday week, maintained fitness well",
      },
      {
        date: new Date("2024-12-29"),
        restingHeartRate: 61,
        vo2max: 43.5,
        notes: "New Year motivation kicking in",
      },
      {
        date: new Date("2025-01-05"),
        restingHeartRate: 57,
        vo2max: 44.8,
        notes: "Best week yet! Consistent training paying off",
      },
      {
        date: new Date("2025-01-12"),
        restingHeartRate: 56,
        vo2max: 45.2,
        notes: "Peak fitness zone, feeling amazing",
      },
      {
        date: new Date("2025-01-19"),
        restingHeartRate: 55,
        vo2max: 45.7,
        notes: "Personal best VO2max reading!",
      },
    ];

    for (const metric of weeklyMetricsData) {
      await prisma.weeklyMetrics.create({
        data: {
          userId: user.id,
          ...metric,
        },
      });
    }

    console.log("✓ Created weekly metrics data");

    // Create Session Metrics data (last 15 sessions)
    const sessionMetricsData = [
      {
        date: new Date("2025-01-20"),
        maxHR: 185,
        avgHR: 165,
        sessionType: "High Intensity Interval Training",
        notes: "8x400m intervals, felt great throughout",
      },
      {
        date: new Date("2025-01-18"),
        maxHR: 172,
        avgHR: 145,
        sessionType: "Easy Run",
        notes: "Recovery run, 45 minutes at conversational pace",
      },
      {
        date: new Date("2025-01-16"),
        maxHR: 178,
        avgHR: 158,
        sessionType: "Tempo Run",
        notes: "20-minute tempo effort, maintained target pace well",
      },
      {
        date: new Date("2025-01-14"),
        maxHR: 190,
        avgHR: 170,
        sessionType: "VO2max Intervals",
        notes: "5x1000m at VO2max pace, tough but manageable",
      },
      {
        date: new Date("2025-01-12"),
        maxHR: 168,
        avgHR: 142,
        sessionType: "Long Run",
        notes: "90-minute aerobic base building run",
      },
      {
        date: new Date("2025-01-10"),
        maxHR: 182,
        avgHR: 162,
        sessionType: "Fartlek Training",
        notes: "Mixed pace run with speed surges",
      },
      {
        date: new Date("2025-01-08"),
        maxHR: 175,
        avgHR: 150,
        sessionType: "Threshold Run",
        notes: "30-minute continuous threshold effort",
      },
      {
        date: new Date("2025-01-06"),
        maxHR: 165,
        avgHR: 135,
        sessionType: "Recovery Run",
        notes: "Easy 30-minute recovery session",
      },
      {
        date: new Date("2025-01-04"),
        maxHR: 188,
        avgHR: 168,
        sessionType: "Hill Repeats",
        notes: "6x2min hill repeats, legs felt strong",
      },
      {
        date: new Date("2025-01-02"),
        maxHR: 170,
        avgHR: 148,
        sessionType: "Steady State",
        notes: "45-minute steady aerobic effort",
      },
      {
        date: new Date("2024-12-30"),
        maxHR: 183,
        avgHR: 163,
        sessionType: "Track Workout",
        notes: "400m repeats with full recovery",
      },
      {
        date: new Date("2024-12-28"),
        maxHR: 169,
        avgHR: 144,
        sessionType: "Easy Run",
        notes: "Holiday recovery run, felt relaxed",
      },
      {
        date: new Date("2024-12-26"),
        maxHR: 179,
        avgHR: 156,
        sessionType: "Progression Run",
        notes: "Started easy, finished at marathon pace",
      },
      {
        date: new Date("2024-12-24"),
        maxHR: 174,
        avgHR: 151,
        sessionType: "Cross Training",
        notes: "Cycling session for active recovery",
      },
      {
        date: new Date("2024-12-22"),
        maxHR: 186,
        avgHR: 166,
        sessionType: "Time Trial",
        notes: "5K time trial - new personal best!",
      },
    ];

    for (const metric of sessionMetricsData) {
      await prisma.sessionMetrics.create({
        data: {
          userId: user.id,
          ...metric,
        },
      });
    }

    console.log("✓ Created session metrics data");

    // Create Biomarker data (last 6 months)
    const biomarkerData = [
      {
        date: new Date("2025-01-15"),
        hemoglobin: 15.2,
        ferritin: 45,
        crp: 0.8,
        glucose: 92,
      },
      {
        date: new Date("2024-12-15"),
        hemoglobin: 14.8,
        ferritin: 42,
        crp: 1.1,
        glucose: 89,
      },
      {
        date: new Date("2024-11-15"),
        hemoglobin: 14.9,
        ferritin: 38,
        crp: 1.3,
        glucose: 94,
      },
      {
        date: new Date("2024-10-15"),
        hemoglobin: 14.6,
        ferritin: 35,
        crp: 1.5,
        glucose: 96,
      },
      {
        date: new Date("2024-09-15"),
        hemoglobin: 14.4,
        ferritin: 32,
        crp: 1.8,
        glucose: 98,
      },
      {
        date: new Date("2024-08-15"),
        hemoglobin: 14.2,
        ferritin: 30,
        crp: 2.1,
        glucose: 101,
      },
    ];

    for (const biomarker of biomarkerData) {
      await prisma.biomarker.create({
        data: {
          userId: user.id,
          ...biomarker,
        },
      });
    }

    console.log("✓ Created biomarker data");

    console.log("\n🎉 Sample data creation completed successfully!");
    console.log(`Created data for user: ${user.name}`);
    console.log(`- ${weeklyMetricsData.length} weekly metrics entries`);
    console.log(`- ${sessionMetricsData.length} session metrics entries`);
    console.log(`- ${biomarkerData.length} biomarker entries`);
  } catch (error) {
    console.error("Error creating sample data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleDataForUser();
