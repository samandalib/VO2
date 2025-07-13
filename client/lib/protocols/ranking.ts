import { FormData, ProtocolRanking, ConfidenceLevel } from "./types";
import { getAllProtocols } from "./data";

export class ProtocolRankingEngine {
  private formData: FormData;

  constructor(formData: FormData) {
    this.formData = formData;
  }

  /**
   * Calculate ranking for all protocols based on user responses
   */
  calculateRanking(): ProtocolRanking[] {
    const protocols = getAllProtocols();
    const rankings: ProtocolRanking[] = [];

    for (const protocol of protocols) {
      const score = this.calculateProtocolScore(protocol.id);
      const reasons = this.generateReasons(protocol.id, score);
      const confidence = this.calculateConfidence();

      rankings.push({
        id: protocol.id,
        score,
        reasons,
        confidence,
      });
    }

    // Sort by score (highest first)
    return rankings.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate confidence level based on form completion
   */
  getConfidenceLevel(): ConfidenceLevel {
    const totalQuestions = 12; // Total questions in the form
    const answeredQuestions = this.countAnsweredQuestions();
    const percentage = Math.round((answeredQuestions / totalQuestions) * 100);

    let level: ConfidenceLevel["level"];
    let message: string | undefined;

    if (percentage >= 80) {
      level = "High";
    } else if (percentage >= 50) {
      level = "Medium";
    } else {
      level = "Low";
      message = "Answer the required questions for better recommendations";
    }

    return { level, percentage, message };
  }

  /**
   * Check if any questions have been answered
   */
  hasAnyAnswers(): boolean {
    return !!(
      this.formData.ageGroup ||
      this.formData.sex ||
      this.formData.height ||
      this.formData.weight ||
      this.formData.currentVO2Max ||
      this.formData.vo2maxKnown ||
      this.formData.activityLevel ||
      this.formData.healthConditions?.length ||
      this.formData.medications?.length ||
      this.formData.timeAvailability ||
      this.formData.equipmentAccess ||
      this.formData.primaryGoal ||
      this.formData.restingHeartRate
    );
  }

  private calculateProtocolScore(protocolId: string): number {
    let score = 100; // Base score

    // Health and safety considerations (highest priority)
    score += this.assessHealthFactors(protocolId);

    // Activity level assessment
    score += this.assessActivityLevel(protocolId);

    // VO2max level and age considerations
    score += this.assessFitnessLevel(protocolId);

    // Goal alignment
    score += this.assessGoalAlignment(protocolId);

    // Time availability
    score += this.assessTimeAvailability(protocolId);

    // Equipment preferences
    score += this.assessEquipmentAccess(protocolId);

    return Math.max(0, score); // Ensure non-negative
  }

  private assessHealthFactors(protocolId: string): number {
    let adjustment = 0;
    const conditions = this.formData.healthConditions || [];
    const medications = this.formData.medications || [];

    // High-intensity protocols get penalties for health issues
    const highIntensityProtocols = ["tabata", "norwegian4x4"];

    if (highIntensityProtocols.includes(protocolId)) {
      if (conditions.includes("heart_condition")) adjustment -= 50;
      if (conditions.includes("joint_problems")) adjustment -= 30;
      if (medications.includes("beta_blockers")) adjustment -= 40;
    }

    // Zone 2 gets bonus for health issues (safer option)
    if (protocolId === "zone2" && conditions.length > 0) {
      adjustment += 20;
    }

    return adjustment;
  }

  private assessActivityLevel(protocolId: string): number {
    const activityLevel = this.formData.activityLevel;
    if (!activityLevel) return 0;

    const protocolDifficultyMap: Record<string, string> = {
      "10-20-30": "beginner",
      zone2: "beginner",
      lactateThreshold: "intermediate",
      "billat30-30": "intermediate",
      norwegian4x4: "advanced",
      tabata: "advanced",
    };

    const levelScoreMap = {
      sedentary: { beginner: 30, intermediate: -10, advanced: -30 },
      lightly_active: { beginner: 20, intermediate: 10, advanced: -20 },
      moderately_active: { beginner: 10, intermediate: 20, advanced: 0 },
      very_active: { beginner: 0, intermediate: 15, advanced: 20 },
      athlete: { beginner: -10, intermediate: 10, advanced: 30 },
    };

    const protocolDifficulty = protocolDifficultyMap[
      protocolId
    ] as keyof typeof levelScoreMap.sedentary;
    return (
      levelScoreMap[activityLevel as keyof typeof levelScoreMap]?.[
        protocolDifficulty
      ] || 0
    );
  }

  private assessFitnessLevel(protocolId: string): number {
    const vo2max = this.formData.currentVO2Max;
    const ageGroup = this.formData.ageGroup;

    if (!vo2max || !ageGroup) return 0;

    let adjustment = 0;

    // VO2max level considerations
    if (vo2max < 30) {
      // Lower fitness - favor gentler protocols
      if (protocolId === "zone2") adjustment += 25;
      if (protocolId === "10-20-30") adjustment += 15;
      if (["tabata", "norwegian4x4"].includes(protocolId)) adjustment -= 20;
    } else if (vo2max > 50) {
      // Higher fitness - can handle intense protocols
      if (["tabata", "norwegian4x4"].includes(protocolId)) adjustment += 20;
      if (protocolId === "zone2") adjustment -= 10;
    }

    // Age considerations
    if (ageGroup === "Over 65") {
      if (protocolId === "zone2") adjustment += 20;
      if (["tabata", "norwegian4x4"].includes(protocolId)) adjustment -= 15;
    }

    return adjustment;
  }

  private assessGoalAlignment(protocolId: string): number {
    const goal = this.formData.primaryGoal;
    if (!goal) return 0;

    const goalProtocolMap: Record<string, Record<string, number>> = {
      weight_loss: {
        zone2: 25,
        "10-20-30": 15,
        lactateThreshold: 10,
        tabata: 20,
      },
      athletic_performance: {
        tabata: 30,
        norwegian4x4: 25,
        "billat30-30": 20,
        lactateThreshold: 15,
      },
      general_fitness: {
        "10-20-30": 25,
        zone2: 20,
        lactateThreshold: 15,
      },
      endurance_improvement: {
        norwegian4x4: 30,
        lactateThreshold: 25,
        zone2: 20,
        "billat30-30": 15,
      },
    };

    return goalProtocolMap[goal]?.[protocolId] || 0;
  }

  private assessTimeAvailability(protocolId: string): number {
    const timeAvailable = this.formData.timeAvailability;
    if (!timeAvailable) return 0;

    const timeCommitmentMap: Record<string, string> = {
      tabata: "low",
      "10-20-30": "medium",
      "billat30-30": "medium",
      norwegian4x4: "medium",
      lactateThreshold: "medium",
      zone2: "high",
    };

    const protocolCommitment = timeCommitmentMap[protocolId];

    if (timeAvailable === "minimal" && protocolCommitment === "low") return 25;
    if (timeAvailable === "moderate" && protocolCommitment === "medium")
      return 15;
    if (timeAvailable === "flexible" && protocolCommitment === "high")
      return 20;
    if (timeAvailable === "minimal" && protocolCommitment === "high")
      return -20;

    return 0;
  }

  private assessEquipmentAccess(protocolId: string): number {
    const equipment = this.formData.equipmentAccess || [];
    if (equipment.length === 0) return 0;

    // Simple equipment matching - protocols that need less equipment get bonus
    if (equipment.includes("none")) {
      if (["10-20-30"].includes(protocolId)) return 20; // Running only
      return -10; // Other protocols need equipment
    }

    return 5; // Small bonus for having equipment
  }

  private generateReasons(protocolId: string, score: number): string[] {
    const reasons: string[] = [];
    const activityLevel = this.formData.activityLevel;
    const goal = this.formData.primaryGoal;
    const timeAvailable = this.formData.timeAvailability;

    // Add reasons based on various factors
    if (
      activityLevel === "sedentary" &&
      ["zone2", "10-20-30"].includes(protocolId)
    ) {
      reasons.push("Ideal for beginners");
    }

    if (goal === "weight_loss" && protocolId === "zone2") {
      reasons.push("Excellent for fat burning");
    }

    if (
      goal === "athletic_performance" &&
      ["tabata", "norwegian4x4"].includes(protocolId)
    ) {
      reasons.push("Proven for elite athletes");
    }

    if (timeAvailable === "minimal" && protocolId === "tabata") {
      reasons.push("Quick 4-minute sessions");
    }

    if (timeAvailable === "flexible" && protocolId === "zone2") {
      reasons.push("Flexible session length");
    }

    // Limit to top 3 reasons
    return reasons.slice(0, 3);
  }

  private countAnsweredQuestions(): number {
    let count = 0;

    if (this.formData.ageGroup) count++;
    if (this.formData.sex) count++;
    if (this.formData.height) count++;
    if (this.formData.weight) count++;
    if (this.formData.currentVO2Max) count++;
    if (this.formData.vo2maxKnown !== undefined) count++;
    if (this.formData.activityLevel) count++;
    if (this.formData.healthConditions?.length) count++;
    if (this.formData.medications?.length) count++;
    if (this.formData.primaryGoal) count++;
    if (this.formData.timeAvailability) count++;
    if (this.formData.equipmentAccess?.length) count++;

    return count;
  }

  private calculateConfidence(): number {
    return this.getConfidenceLevel().percentage;
  }
}

// Convenience functions
export const calculateProtocolRanking = (
  formData: FormData,
): ProtocolRanking[] => {
  const engine = new ProtocolRankingEngine(formData);
  return engine.calculateRanking();
};

export const getConfidenceLevel = (formData: FormData): ConfidenceLevel => {
  const engine = new ProtocolRankingEngine(formData);
  return engine.getConfidenceLevel();
};

export const hasAnyAnswers = (formData: FormData): boolean => {
  const engine = new ProtocolRankingEngine(formData);
  return engine.hasAnyAnswers();
};
