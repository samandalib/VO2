import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { TestingProtocolsSection } from "@/components/sections/TestingProtocolsSection";
import { TrainingProtocolsSection } from "@/components/sections/TrainingProtocolsSection";
import { VO2MaxCalculatorSection } from "@/components/sections/VO2MaxCalculatorSection";
import { AuthModal } from "@/components/auth/AuthModal";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { VO2MaxData } from "@shared/api";
import { DatabaseConnectionTest } from "@/components/debug/DatabaseConnectionTest";


export default function Index() {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Refs for scrolling to sections
  const projectionCalculatorRef = useRef<HTMLDivElement>(null);
  const testingProtocolsRef = useRef<HTMLDivElement>(null);

  // VO2Max Longevity Calculator State
  const [calculatorInputs, setCalculatorInputs] = useState({
    currentAge: 35,
    sex: "",
    currentVO2Max: 40,
    targetAge: 85,
  });

  // Fitness classification functions based on Cooper Institute and ACSM Guidelines
  const getFitnessClassification = (
    age: number,
    sex: string,
    vo2max: number,
  ) => {
    // Get normative ranges based on exact PDF specifications
    const ranges = getVO2MaxNorms(age, sex);

    if (vo2max >= ranges.elite) return "Elite";
    if (vo2max >= ranges.high) return "Highly Active";
    if (vo2max >= ranges.aboveAverage) return "Moderately Active";
    return "Sedentary";
  };

  // VO₂max Normative Percentile Tables by Age and Sex (Cooper Institute and ACSM Guidelines)
  const getVO2MaxNorms = (age: number, sex: string) => {
    if (sex === "male") {
      if (age >= 20 && age <= 29) {
        return {
          elite: 55, // ≥97.7th percentile
          high: 49, // 75-97.6th percentile (49-54 range, using minimum)
          aboveAverage: 44, // 50-74th percentile (44-48 range, using minimum)
          average: 40, // 25-49th percentile (40-43 range, using minimum)
          low: 40, // <25th percentile threshold
        };
      } else if (age >= 30 && age <= 39) {
        return {
          elite: 54, // ≥97.7th percentile
          high: 48, // 75-97.6th percentile (48-53 range, using minimum)
          aboveAverage: 43, // 50-74th percentile (43-47 range, using minimum)
          average: 39, // 25-49th percentile (39-42 range, using minimum)
          low: 39, // <25th percentile threshold
        };
      } else if (age >= 40 && age <= 49) {
        return {
          elite: 52, // ≥97.7th percentile
          high: 46, // 75-97.6th percentile (46-51 range, using minimum)
          aboveAverage: 41, // 50-74th percentile (41-45 range, using minimum)
          average: 36, // 25-49th percentile (36-40 range, using minimum)
          low: 36, // <25th percentile threshold
        };
      } else if (age >= 50 && age <= 59) {
        return {
          elite: 48, // ≥97.7th percentile
          high: 43, // 75-97.6th percentile (43-47 range, using minimum)
          aboveAverage: 38, // 50-74th percentile (38-42 range, using minimum)
          average: 34, // 25-49th percentile (34-37 range, using minimum)
          low: 34, // <25th percentile threshold
        };
      } else {
        // 60+
        return {
          elite: 45, // ≥97.7th percentile
          high: 39, // 75-97.6th percentile (39-44 range, using minimum)
          aboveAverage: 34, // 50-74th percentile (34-38 range, using minimum)
          average: 30, // 25-49th percentile (30-33 range, using minimum)
          low: 30, // <25th percentile threshold
        };
      }
    } else {
      // female
      if (age >= 20 && age <= 29) {
        return {
          elite: 49, // ≥97.7th percentile
          high: 44, // 75-97.6th percentile (44-48 range, using minimum)
          aboveAverage: 38, // 50-74th percentile (38-43 range, using minimum)
          average: 33, // 25-49th percentile (33-37 range, using minimum)
          low: 33, // <25th percentile threshold
        };
      } else if (age >= 30 && age <= 39) {
        return {
          elite: 45, // ≥97.7th percentile
          high: 41, // 75-97.6th percentile (41-44 range, using minimum)
          aboveAverage: 36, // 50-74th percentile (36-40 range, using minimum)
          average: 31, // 25-49th percentile (31-35 range, using minimum)
          low: 31, // <25th percentile threshold
        };
      } else if (age >= 40 && age <= 49) {
        return {
          elite: 43, // ≥97.7th percentile
          high: 38, // 75-97.6th percentile (38-42 range, using minimum)
          aboveAverage: 33, // 50-74th percentile (33-37 range, using minimum)
          average: 29, // 25-49th percentile (29-32 range, using minimum)
          low: 29, // <25th percentile threshold
        };
      } else if (age >= 50 && age <= 59) {
        return {
          elite: 40, // ≥97.7th percentile
          high: 35, // 75-97.6th percentile (35-39 range, using minimum)
          aboveAverage: 31, // 50-74th percentile (31-34 range, using minimum)
          average: 26, // 25-49th percentile (26-30 range, using minimum)
          low: 26, // <25th percentile threshold
        };
      } else {
        // 60+
        return {
          elite: 38, // ≥97.7th percentile
          high: 33, // 75-97.6th percentile (33-37 range, using minimum)
          aboveAverage: 28, // 50-74th percentile (28-32 range, using minimum)
          average: 24, // 25-49th percentile (24-27 range, using minimum)
          low: 24, // <25th percentile threshold
        };
      }
    }
  };

  const getPercentileClassification = (
    age: number,
    sex: string,
    vo2max: number,
  ) => {
    const ranges = getVO2MaxNorms(age, sex);

    if (vo2max >= ranges.elite) return "≥97.7th percentile (Elite)";
    if (vo2max >= ranges.high) return "75th-97.6th percentile (High)";
    if (vo2max >= ranges.aboveAverage)
      return "50th-74th percentile (Above Average)";
    if (vo2max >= ranges.average) return "25th-49th percentile (Average)";
    return "<25th percentile (Low)";
  };

  const generateProjectionChartData = (
    currentAge: number,
    targetAge: number,
    currentVO2Max: number,
    projectedVO2Max: number,
    sex: string,
  ) => {
    const decades = [];

    // Generate data points for each decade from current age to target age
    for (let age = currentAge; age <= targetAge; age += 10) {
      const actualAge = Math.min(age, targetAge);
      const norms = getVO2MaxNorms(actualAge, sex);

      // Calculate VO2Max at this age point for the decline line
      const decadesPassed = (actualAge - currentAge) / 10;
      const classification = getFitnessClassification(
        currentAge,
        sex,
        currentVO2Max,
      );
      const declineRate = getDeclineRate(classification);
      const vo2MaxAtAge =
        currentVO2Max * Math.pow(1 - declineRate, decadesPassed);

      decades.push({
        age: actualAge,
        label: actualAge === targetAge ? `${actualAge}` : `${actualAge}`,
        norms,
        userVO2Max: vo2MaxAtAge,
        isTargetAge: actualAge === targetAge,
      });
    }

    return decades;
  };

  const generateChartData = (
    userAge: number,
    sex: string,
    userVO2Max: number,
  ) => {
    const ageGroups = [
      { label: "20-29", range: [20, 29] },
      { label: "30-39", range: [30, 39] },
      { label: "40-49", range: [40, 49] },
      { label: "50-59", range: [50, 59] },
      { label: "60+", range: [60, 100] },
    ];

    return ageGroups.map((group) => {
      // Use exact age group midpoint to get the correct norms
      const midAge = group.range[0] + 5; // Use start of range + 5 for consistency
      const norms = getVO2MaxNorms(midAge, sex);

      const ranges = {
        excellent: norms.elite,
        high: norms.high,
        aboveAverage: norms.aboveAverage,
        average: norms.average,
        belowAverage: Math.max(norms.low - 10, 10), // Set floor for chart
        poor: Math.max(norms.low - 15, 5), // Set minimum for chart display
      };

      const isUserAge = userAge >= group.range[0] && userAge <= group.range[1];
      let userPosition = null;

      if (isUserAge) {
        if (userVO2Max >= ranges.excellent) userPosition = "excellent";
        else if (userVO2Max >= ranges.high) userPosition = "high";
        else if (userVO2Max >= ranges.aboveAverage)
          userPosition = "aboveAverage";
        else if (userVO2Max >= ranges.average) userPosition = "average";
        else if (userVO2Max >= ranges.belowAverage)
          userPosition = "belowAverage";
        else userPosition = "poor";
      }

      return {
        ...group,
        ranges,
        isUserAge,
        userPosition,
        userVO2Max: isUserAge ? userVO2Max : null,
      };
    });
  };

  const getDeclineRate = (classification: string) => {
    // Updated decline rates based on PDF specifications
    switch (classification) {
      case "Elite":
        return 0.025; // 2-3% per decade (using midpoint 2.5%)
      case "Highly Active":
        return 0.04; // 3-5% per decade (using midpoint 4%)
      case "Moderately Active":
        return 0.06; // 5-7% per decade (using midpoint 6%)
      default: // Sedentary
        return 0.1125; // 10-12.5% per decade (using midpoint 11.25%)
    }
  };

  const calculateProjectedVO2Max = () => {
    const currentAge = calculatorInputs.currentAge;
    const targetAge = calculatorInputs.targetAge;
    const currentVO2Max = calculatorInputs.currentVO2Max;

    if (!currentAge || !targetAge || !currentVO2Max || !calculatorInputs.sex) {
      return null;
    }

    const classification = getFitnessClassification(
      currentAge,
      calculatorInputs.sex,
      currentVO2Max,
    );
    const percentileClassification = getPercentileClassification(
      currentAge,
      calculatorInputs.sex,
      currentVO2Max,
    );
    const chartData = generateChartData(
      currentAge,
      calculatorInputs.sex,
      currentVO2Max,
    );
    const declineRate = getDeclineRate(classification);
    const decades = (targetAge - currentAge) / 10;
    const projectedVO2Max = currentVO2Max * Math.pow(1 - declineRate, decades);

    const getFunctionalStatus = (vo2max: number) => {
      if (vo2max >= 30)
        return {
          status: "Robust",
          risk: "Low risk of functional decline",
          color: "text-emerald-600 dark:text-emerald-400",
          icon: CheckCircle,
        };
      if (vo2max >= 18)
        return {
          status: "Independent",
          risk: "Likely independent, moderate healthspan",
          color: "text-yellow-600 dark:text-yellow-400",
          icon: AlertTriangle,
        };
      return {
        status: "At Risk",
        risk: "High risk of dependency or frailty",
        color: "text-red-600 dark:text-red-400",
        icon: AlertTriangle,
      };
    };

    const functionalStatus = getFunctionalStatus(projectedVO2Max);

    return {
      classification,
      percentileClassification,
      chartData,
      declineRate: (declineRate * 100).toFixed(1),
      decades: decades.toFixed(1),
      projectedVO2Max: projectedVO2Max.toFixed(1),
      functionalStatus,
    };
  };

  const projectionResults = calculateProjectedVO2Max();

  const handleStartAssessment = () => {
    // Navigate directly to protocol selection
    navigate("/protocols");
  };

  const handleNavigateToDashboard = () => {
    navigate("/dashboard");
  };

  const handleShowProjectionCalculator = () => {
    projectionCalculatorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleShowTestingProtocols = () => {
    testingProtocolsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSignIn = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    // Redirect to dashboard after successful authentication
    navigate("/dashboard");
  };

  // Always render the main homepage content
  return (
    <div className="min-h-screen">
      <HeroSection
        onStartAssessment={handleStartAssessment}
        onNavigateToDashboard={handleNavigateToDashboard}
        onShowProjectionCalculator={handleShowProjectionCalculator}
        onShowTestingProtocols={handleShowTestingProtocols}
        onSignIn={handleSignIn}
      />
      <div ref={projectionCalculatorRef}>
        <VO2MaxCalculatorSection
          calculatorInputs={calculatorInputs}
          setCalculatorInputs={setCalculatorInputs}
          projectionResults={projectionResults}
          generateProjectionChartData={generateProjectionChartData}
        />
      </div>
      <div ref={testingProtocolsRef}>
        <TestingProtocolsSection onStartAssessment={handleStartAssessment} />
      </div>
      <FeaturesSection />
      <TrainingProtocolsSection onStartAssessment={handleStartAssessment} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
