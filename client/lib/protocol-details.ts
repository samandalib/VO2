// Protocol details extracted from the VO₂max Workout Rhythm Template document

export interface ProtocolDetails {
  name: string;
  reference: string;
  howToPerform: string[];
  howToControlIntensity: string[];
  duration: string;
  sessionsPerWeek: number;
  restBetweenSessions: string;
  intensityLevel: "all-out" | "very-hard" | "moderate" | "low";
  description: string;
}

export const protocolDetailsMap: Record<string, ProtocolDetails> = {
  "Tabata Protocol": {
    name: "Tabata Protocol",
    reference: "Tabata et al., 1996",
    howToPerform: [
      "Each session includes 7–8 rounds of:",
      "• 20 seconds all-out effort (e.g., sprint on a stationary bike)",
      "• 10 seconds complete rest",
      "Warm-up for 5–10 minutes and cool down for 2–3 minutes",
    ],
    howToControlIntensity: [
      "Go as hard as physically possible during the 20 seconds — like a sprint to exhaustion",
      "Use a timer app or Tabata clock",
      "You should feel completely spent by round 6–7; breathing very hard, muscles burning",
    ],
    duration: "6 weeks",
    sessionsPerWeek: 5,
    restBetweenSessions: "1 day (active recovery or rest)",
    intensityLevel: "all-out",
    description: "High-intensity interval training with maximal effort sprints",
  },
  "Billat's 30:30": {
    name: "Billat's 30:30",
    reference: "Billat et al., 2001",
    howToPerform: [
      "Run or cycle at a very hard pace for 30 seconds",
      "Recover with 30 seconds of easy jogging or pedaling",
      "Start with 12–15 reps per session; build to 20",
      "Add warm-up and cool-down",
    ],
    howToControlIntensity: [
      "Your 30-second effort should feel like the fastest pace you could hold for ~6 minutes",
      "Breathing should be heavy, but you maintain control and form",
      "Use a track or treadmill to maintain accurate pace",
    ],
    duration: "8 weeks",
    sessionsPerWeek: 3,
    restBetweenSessions: "1–2 days",
    intensityLevel: "very-hard",
    description: "VO₂max pace intervals with equal work-to-rest ratio",
  },
  "Norwegian 4x4 Interval Training": {
    name: "Norwegian 4x4 Interval Training",
    reference: "Helgerud et al., 2007",
    howToPerform: [
      "Do 4 intervals of 4 minutes at very hard effort",
      "Follow each with 3 minutes of slow jogging or walking",
      "Include a 10-minute warm-up and 5–10 minute cool-down",
    ],
    howToControlIntensity: [
      "Target 90–95% of your maximum heart rate",
      "This feels like running uphill fast — uncomfortable but steady",
      "Use a heart rate monitor; by minute 2 of each interval, HR should be near target",
    ],
    duration: "8 weeks",
    sessionsPerWeek: 3,
    restBetweenSessions: "1–2 days",
    intensityLevel: "very-hard",
    description: "Sustained aerobic intervals at near-maximal heart rate",
  },
  "10-20-30 Protocol": {
    name: "10-20-30 Protocol",
    reference: "Gunnarsson & Bangsbo, 2012",
    howToPerform: [
      "Run or cycle in repeating 1-minute blocks:",
      "• 30 seconds light effort (walk or easy spin)",
      "• 20 seconds moderate pace (steady run or cycling)",
      "• 10 seconds all-out sprint",
      "Do 3–4 sets of 5-minute blocks, with 2-minute rest in between",
    ],
    howToControlIntensity: [
      "The 10s sprint should be true all-out effort",
      "20s should feel challenging but sustainable",
      "30s is for full recovery — walk or pedal easily",
      "Use a structured timer or audio cues",
    ],
    duration: "7 weeks",
    sessionsPerWeek: 3,
    restBetweenSessions: "1–2 days",
    intensityLevel: "moderate",
    description: "Mixed-intensity intervals with brief all-out sprints",
  },
  "Zone 2 Training": {
    name: "Zone 2 Training",
    reference: "Seiler, 2010",
    howToPerform: [
      "Do long-duration cardio (walking, jogging, cycling, rowing) at a steady, easy pace",
      "Each session lasts 45–90 minutes depending on fitness",
      "Focus is on duration and consistency, not speed",
    ],
    howToControlIntensity: [
      "Keep HR between 60–75% of your max",
      "You should be able to hold a full conversation",
      "If breathing gets heavy or nasal breathing is hard, you're going too fast",
      "Heart rate monitor is ideal; RPE ~3/10",
    ],
    duration: "12 weeks",
    sessionsPerWeek: 4,
    restBetweenSessions: "0–1 day (can be done on consecutive days)",
    intensityLevel: "low",
    description:
      "Low-intensity aerobic base building for mitochondrial adaptation",
  },
  "Lactate Threshold Training": {
    name: "Lactate Threshold Training",
    reference: "Carter et al., 2000",
    howToPerform: [
      "Run or ride continuously at a 'comfortably hard' pace",
      "Session should be 20–30 minutes at threshold pace",
      "Include 10–15 minutes of warm-up and cool-down",
    ],
    howToControlIntensity: [
      "Pace should feel like your 10K race pace or a hard 30-minute run",
      "Breathing is labored, but you're in control and steady",
      "Talking is possible only in short phrases",
      "Use HR ~85% of max or pace from prior time trial",
    ],
    duration: "8 weeks",
    sessionsPerWeek: 3,
    restBetweenSessions: "1–2 days",
    intensityLevel: "very-hard",
    description: "Sustained effort at lactate threshold pace",
  },
};

export function getProtocolDetails(
  protocolName: string,
): ProtocolDetails | null {
  return protocolDetailsMap[protocolName] || null;
}
