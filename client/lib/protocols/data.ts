import { ProtocolData } from "./types";

export const PROTOCOLS: Record<string, ProtocolData> = {
  tabata: {
    id: "tabata",
    name: "Tabata Protocol",
    vo2maxGain: "~13% improvement",
    timeToResults: "3–6 weeks",
    fitnessLevel: "Athlete",
    protocolDuration: "7–8 sets of 20s work + 10s rest, ~4 mins/session",
    sportModality: "Cycling (ergometer)",
    researchPopulation:
      "Young male physical education students (active athletes in university teams)",
    researchers: "Izumi Tabata et al.",
    institution: "National Institute of Fitness and Sports",
    location: "Japan",
    year: "1996",
    doi: "https://doi.org/10.1097/00005768-199610000-00018",
    category: "interval",
    difficulty: "advanced",
    timeCommitment: "low",
    equipmentRequired: ["bike", "timer"],
  },

  norwegian4x4: {
    id: "norwegian4x4",
    name: "Norwegian 4x4 Interval Training",
    vo2maxGain: "~7.2%",
    timeToResults: "8 weeks",
    fitnessLevel: "Intermediate to Advanced",
    protocolDuration: "4 × 4-min intervals at 85–95% HRmax, 3-min recovery",
    sportModality: "Running, Cycling, Cross-Country Skiing",
    researchPopulation: "Well-trained endurance athletes",
    researchers: "Jan Helgerud et al.",
    institution: "Norwegian University of Science and Technology",
    location: "Norway",
    year: "2007",
    doi: "https://doi.org/10.1249/mss.0b013e3180304570",
    category: "interval",
    difficulty: "intermediate",
    timeCommitment: "medium",
    equipmentRequired: ["cardio_equipment", "heart_rate_monitor"],
  },

  "10-20-30": {
    id: "10-20-30",
    name: "10-20-30 Protocol",
    vo2maxGain: "~4% in recreational runners",
    timeToResults: "7 weeks",
    fitnessLevel: "Recreational to Intermediate",
    protocolDuration: "Alternating 30s easy, 20s moderate, 10s hard",
    sportModality: "Running",
    researchPopulation: "Recreational runners",
    researchers: "Thomas P. Gunnarsson et al.",
    institution: "University of Copenhagen",
    location: "Denmark",
    year: "2012",
    doi: "https://doi.org/10.1111/j.1600-0838.2012.01478.x",
    category: "interval",
    difficulty: "beginner",
    timeCommitment: "medium",
    equipmentRequired: ["running_space", "timer"],
  },

  "billat30-30": {
    id: "billat30-30",
    name: "Billat's 30:30",
    vo2maxGain: "Maintains VO2max efficiency",
    timeToResults: "4–6 weeks",
    fitnessLevel: "Intermediate to Advanced",
    protocolDuration: "Alternating 30s at vVO2max, 30s at 50% vVO2max",
    sportModality: "Running",
    researchPopulation: "Trained distance runners",
    researchers: "Véronique Billat et al.",
    institution: "University of Lille",
    location: "France",
    year: "2000",
    doi: "https://doi.org/10.1097/00005768-200008000-00014",
    category: "interval",
    difficulty: "intermediate",
    timeCommitment: "medium",
    equipmentRequired: ["running_space", "timer", "heart_rate_monitor"],
  },

  lactateThreshold: {
    id: "lactateThreshold",
    name: "Lactate Threshold Training",
    vo2maxGain: "Modest, typically 3–5%",
    timeToResults: "~3–6 weeks",
    fitnessLevel: "Amateur to Athlete",
    protocolDuration: "~30 mins per session",
    sportModality: "Running, Cycling, Swimming",
    researchPopulation: "Endurance athletes (various levels)",
    researchers: "Jack Daniels, David Costill",
    institution: "Ball State University",
    location: "USA",
    year: "1979",
    doi: "https://doi.org/10.2165/00007256-200131020-00001",
    category: "threshold",
    difficulty: "intermediate",
    timeCommitment: "medium",
    equipmentRequired: ["cardio_equipment"],
  },

  zone2: {
    id: "zone2",
    name: "Zone 2 Training",
    vo2maxGain: "Gradual; 3–7% depending on baseline",
    timeToResults: "8–12 weeks",
    fitnessLevel: "All levels",
    protocolDuration: "45–90 mins/session",
    sportModality: "Running, Cycling, Endurance Modalities",
    researchPopulation: "Endurance athletes",
    researchers: "Stephen Seiler",
    institution: "University of Agder",
    location: "Norway",
    year: "2010",
    doi: "https://doi.org/10.1123/ijspp.5.3.276",
    category: "endurance",
    difficulty: "beginner",
    timeCommitment: "high",
    equipmentRequired: ["cardio_equipment", "heart_rate_monitor"],
  },
};

export const getAllProtocols = (): ProtocolData[] => {
  return Object.values(PROTOCOLS);
};

export const getProtocolById = (id: string): ProtocolData | undefined => {
  return PROTOCOLS[id];
};

export const getProtocolsByCategory = (
  category: ProtocolData["category"],
): ProtocolData[] => {
  return getAllProtocols().filter((protocol) => protocol.category === category);
};

export const getProtocolsByDifficulty = (
  difficulty: ProtocolData["difficulty"],
): ProtocolData[] => {
  return getAllProtocols().filter(
    (protocol) => protocol.difficulty === difficulty,
  );
};
