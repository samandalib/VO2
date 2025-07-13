import { RequestHandler } from "express";

interface VO2MaxRequest {
  age: number;
  sex: "male" | "female";
  weight: number;
  height: number;
  currentVO2Max: number;
  restingHeartRate: number;
}

interface ImprovementPlan {
  level: "Beginner" | "Intermediate" | "Advanced";
  trainingProtocol: string;
  reason: string;
  timeCommitment: string;
  resultsTimeframe: string;
  realisticProgress: string;
  researchPopulation: string;
  researchResults: string;
  recommended?: boolean;
}

export const generatePlans: RequestHandler = async (req, res) => {
  try {
    const userData = req.body as VO2MaxRequest;

    // Validate the input data
    if (
      !userData.age ||
      !userData.sex ||
      !userData.weight ||
      !userData.height ||
      !userData.currentVO2Max ||
      !userData.restingHeartRate
    ) {
      return res.status(400).json({ error: "Missing required user data" });
    }

    console.log("Generating static evidence-based plans for user:", {
      age: userData.age,
      sex: userData.sex,
      currentVO2Max: userData.currentVO2Max,
    });

    // Generate evidence-based improvement plans based on user's current VO2Max
    const plans: ImprovementPlan[] = [
      {
        level: "Beginner",
        trainingProtocol:
          "Week 1-4: 3×30min moderate intensity (65-75% HRmax) + 2×strength\nWeek 5-8: Add 1×HIIT session (4×3min at 85-90% HRmax, 3min recovery)",
        reason: `Perfect for building aerobic base. Your current VO₂max of ${userData.currentVO2Max} ml/kg/min suggests you'll respond well to moderate intensity training first.`,
        timeCommitment: "4-5 hours per week (5 sessions)",
        resultsTimeframe: "6-8 weeks for noticeable improvements",
        realisticProgress: `8-15% improvement (${(userData.currentVO2Max * 1.08).toFixed(1)}-${(userData.currentVO2Max * 1.15).toFixed(1)} ml/kg/min)`,
        researchPopulation: "Sedentary and recreationally active adults",
        researchResults:
          "Helgerud et al. (2007): 12% VO₂max improvement in 8 weeks with moderate training",
        recommended: userData.currentVO2Max < 35,
      },
      {
        level: "Intermediate",
        trainingProtocol:
          "2×4×4 HIIT (4min at 90-95% HRmax, 3min active recovery) + 2×moderate + 1×strength + 1×long easy session",
        reason: `Optimal for your fitness level. The 4×4 protocol is proven most effective for VO₂max gains in individuals with ${userData.currentVO2Max > 35 ? "moderate" : "developing"} fitness.`,
        timeCommitment: "6-7 hours per week (6 sessions)",
        resultsTimeframe: "4-6 weeks for significant improvements",
        realisticProgress: `10-20% improvement (${(userData.currentVO2Max * 1.1).toFixed(1)}-${(userData.currentVO2Max * 1.2).toFixed(1)} ml/kg/min)`,
        researchPopulation: "Recreationally trained adults and athletes",
        researchResults:
          "Helgerud et al. (2007): 13% improvement vs 6% with moderate training. Gold standard protocol.",
        recommended:
          userData.currentVO2Max >= 35 && userData.currentVO2Max <= 50,
      },
      {
        level: "Advanced",
        trainingProtocol:
          "Polarized: 80% easy training + 20% high-intensity (VO₂max intervals, threshold work) with periodization cycles",
        reason: `Advanced approach for high performers. Your ${userData.currentVO2Max > 50 ? "excellent" : "good"} base fitness requires sophisticated stimulus for further gains.`,
        timeCommitment: "8-12 hours per week (7-8 sessions)",
        resultsTimeframe: "8-12 weeks with periodized progression",
        realisticProgress: `5-12% improvement (${(userData.currentVO2Max * 1.05).toFixed(1)}-${(userData.currentVO2Max * 1.12).toFixed(1)} ml/kg/min)`,
        researchPopulation: "Competitive endurance athletes",
        researchResults:
          "Seiler (2010): Polarized training superior to threshold-based programs in trained athletes",
        recommended: userData.currentVO2Max > 50,
      },
    ];

    console.log("Successfully generated evidence-based plans");
    res.json({ plans });
  } catch (error) {
    console.error("Error generating plans:", error);
    res.status(500).json({
      error: "Failed to generate improvement plans. Please try again.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
