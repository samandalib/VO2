import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const protocols = [
  {
    id: "tabata",
    name: "Tabata Protocol",
    vo2maxGain: "~13% improvement",
    timeToResults: "3–6 weeks",
    protocolDuration: "7–8 sets of 20s work + 10s rest, ~4 mins/session",
    fitnessLevel: "Athlete",
    sportModality: "Cycling (ergometer)",
    researchPopulation:
      "Young male physical education students (active athletes in university teams)",
    researchers: "Izumi Tabata et al.",
    institution: "National Institute of Fitness and Sports",
    location: "Japan",
    year: "1996",
    doi: "https://doi.org/10.1097/00005768-199610000-00018",
    description:
      "High-intensity interval training protocol with short bursts of maximum effort.",
    howToPerform:
      "Perform 20 seconds of all-out effort followed by 10 seconds of rest, repeated for 8 rounds (4 minutes total).",
    intensityControl:
      "Work at 170% of VO₂max or ~95% of HRmax during work intervals.",
  },
  {
    id: "norwegian4x4",
    name: "Norwegian 4x4 Interval Training",
    vo2maxGain: "~7.2%",
    timeToResults: "8 weeks",
    protocolDuration:
      "4 intervals of 4 min at 90–95% HRmax + 3 min rest (~40 mins total)",
    fitnessLevel: "Moderately trained",
    sportModality: "Running (treadmill)",
    researchPopulation: "Moderately trained healthy men, avg. age 24.6 yrs",
    researchers: "Jan Helgerud et al.",
    institution: "Norwegian University of Science and Technology",
    location: "Norway",
    year: "2007",
    doi: "https://doi.org/10.1249/mss.0b013e3180304570",
    description:
      "Moderate-intensity interval training with longer work periods.",
    howToPerform:
      "4 intervals of 4 minutes at high intensity with 3 minutes active recovery between intervals.",
    intensityControl:
      "Maintain 90-95% of HRmax during work intervals, 50-70% HRmax during recovery.",
  },
  {
    id: "10-20-30",
    name: "10-20-30 Protocol",
    vo2maxGain: "~13% improvement",
    timeToResults: "7–8 weeks",
    protocolDuration:
      "Running: 30s low, 20s moderate, 10s sprint x 5 reps/set x 3 sets",
    fitnessLevel: "Amateur to Recreational Athlete",
    sportModality: "Running",
    researchPopulation:
      "Moderately trained runners (avg. age ~41 yrs, male/female)",
    researchers: "Thomas Gunnarsson et al.",
    institution: "University of Copenhagen",
    location: "Denmark",
    year: "2012",
    doi: "https://doi.org/10.1152/japplphysiol.00334.2012",
    description:
      "Variable-intensity interval training with three different effort levels.",
    howToPerform:
      "Alternate between 30s easy, 20s moderate, and 10s all-out effort in continuous cycles.",
    intensityControl: "30s at 60% HRmax, 20s at 80% HRmax, 10s at >90% HRmax.",
  },
  {
    id: "billat30-30",
    name: "Billat's 30:30",
    vo2maxGain:
      "Not quantified directly but improves max velocity and endurance",
    timeToResults: "4–6 weeks",
    protocolDuration: "30s at 100% vVO₂max, 30s jog, repeated ~12–20 mins",
    fitnessLevel: "Advanced to Athlete",
    sportModality: "Running",
    researchPopulation: "Well-trained middle and long-distance runners",
    researchers: "Veronique Billat",
    institution: "University of Evry-Val-d'Essonne",
    location: "France",
    year: "1999",
    doi: "https://doi.org/10.2165/00007256-200131020-00001",
    description:
      "High-intensity training at VO₂max velocity with equal rest periods.",
    howToPerform:
      "30 seconds at velocity that elicits VO₂max, followed by 30 seconds of slow jogging.",
    intensityControl:
      "Work at 100% vVO₂max (velocity at VO₂max), recovery at 50% vVO₂max.",
  },
  {
    id: "lactateThreshold",
    name: "Lactate Threshold Training",
    vo2maxGain: "Modest, typically 3–5%",
    timeToResults: "~3–6 weeks",
    protocolDuration: "~30 mins per session",
    fitnessLevel: "Amateur to Athlete",
    sportModality: "Treadmill Running",
    researchPopulation: "Healthy males (age ~22)",
    researchers: "Hamish Carter et al.",
    institution: "University of Brighton",
    location: "UK",
    year: "2000",
    doi: "https://doi.org/10.1152/jappl.2000.89.5.1744",
    description: "Steady-state training at lactate threshold intensity.",
    howToPerform:
      "Continuous exercise at lactate threshold pace for 20-40 minutes.",
    intensityControl:
      "Exercise at 85-90% HRmax or at the point where lactate begins to accumulate.",
  },
  {
    id: "zone2",
    name: "Zone 2 Training",
    vo2maxGain: "Gradual; 3–7% depending on baseline",
    timeToResults: "8–12 weeks",
    protocolDuration: "45–90 mins/session",
    fitnessLevel: "All levels",
    sportModality: "Running, Cycling, Endurance Modalities",
    researchPopulation: "Endurance athletes",
    researchers: "Stephen Seiler",
    institution: "University of Agder",
    location: "Norway",
    year: "2010",
    doi: "https://doi.org/10.1123/ijspp.5.3.276",
    description:
      "Low-intensity, high-volume training for aerobic base building.",
    howToPerform:
      "Sustained exercise at conversational pace for extended periods.",
    intensityControl:
      "Exercise at 60-70% HRmax, should be able to hold a conversation.",
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing protocols
  await prisma.protocol.deleteMany({});
  console.log("🧹 Cleared existing protocols");

  // Insert protocols
  for (const protocol of protocols) {
    await prisma.protocol.create({
      data: protocol,
    });
  }

  console.log(`✅ Seeded ${protocols.length} protocols`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
