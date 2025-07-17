import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Activity,
  Heart,
  User,
  Scale,
  Ruler,
  TrendingUp,
  ArrowLeft,
  ExternalLink,
  Users,
  Building,
  MapPin,
  Calendar,
  Clock,
  Target,
  AlertTriangle,
  Info,
} from "lucide-react";
import { VO2MaxData } from "@shared/api";
import { SimpleAuthModal } from "@/components/auth/SimpleAuthModal";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useNavigate } from "react-router-dom";
import { UserProtocolsService } from "@/lib/api/userProtocols";

interface ExtendedVO2MaxData extends VO2MaxData {
  ageGroup?: string;
  vo2maxKnown?: boolean;
  activityLevel?: string;
  healthConditions?: string[];
  medications?: string[];
  jointPain?: boolean;
  trainingTime?: string;
  equipmentAccess?: string[];
  primaryGoal?: string;
}

interface VO2MaxFormProps {
  onSubmit: (data: VO2MaxData) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export function VO2MaxForm({
  onSubmit,
  onBack,
  isLoading = false,
}: VO2MaxFormProps) {
  const navigate = useNavigate();

  // Safe auth hooks with error handling
  let isAuthenticated = false;
  let user = null;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(
    null,
  );

  try {
    const authState = useAuth();
    isAuthenticated = !!authState.user;
    user = authState.user;
  } catch (error) {
    console.error("Auth hooks error:", error);
  }

  const requireAuth = (callback?: () => void) => {
    console.log("requireAuth called", {
      isAuthenticated,
      callback: !!callback,
    });

    if (isAuthenticated) {
      console.log("User is authenticated, executing callback");
      callback?.();
    } else {
      console.log("User not authenticated, opening modal");
      setPendingCallback(() => callback);
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    console.log("Auth success, executing pending callback");
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
    setShowAuthModal(false);
  };

  const [formData, setFormData] = useState<Partial<ExtendedVO2MaxData>>({});
  const [errors, setErrors] = useState<
    Partial<Record<keyof ExtendedVO2MaxData, string>>
  >({});
  const [currentTab, setCurrentTab] = useState(0);
  const [showOnlyRequired, setShowOnlyRequired] = useState(false);

  // Ensure current tab is always visible when tabs are filtered
  React.useEffect(() => {
    const visibleTabs = getVisibleTabs();
    if (
      visibleTabs.length > 0 &&
      !visibleTabs.some((tab) => tab.id === currentTab)
    ) {
      setCurrentTab(visibleTabs[0].id);
    }
  }, [showOnlyRequired]);

  // Required fields configuration
  const requiredFields = {
    ageGroup: true,
    sex: false, // Q2 does not have (Required)
    height: false, // Q3 does not have (Required)
    weight: false, // Q3 does not have (Required)

    currentVO2Max: true,
    activityLevel: true,
    healthConditions: true,
    medications: true,
    jointPain: true,
    restingHeartRate: false, // Q12 does not have (Required)
    trainingTime: false,
    equipmentAccess: false,
    primaryGoal: false,
  };

  // Tab configuration
  const tabs = [
    {
      id: 0,
      title: "Age & Demographics",
      icon: User,
      color: "blue",
      fields: ["ageGroup", "sex", "height", "weight"],
    },
    {
      id: 1,
      title: "Current Fitness Level",
      icon: TrendingUp,
      color: "green",
      fields: ["currentVO2Max", "activityLevel"],
    },
    {
      id: 2,
      title: "Health Limitations",
      icon: AlertTriangle,
      color: "red",
      fields: ["healthConditions", "medications", "jointPain"],
    },
    {
      id: 3,
      title: "Time & Lifestyle",
      icon: Clock,
      color: "purple",
      fields: ["trainingTime", "equipmentAccess"],
    },
    {
      id: 4,
      title: "Goals & Recovery",
      icon: Target,
      color: "orange",
      fields: ["primaryGoal", "restingHeartRate"],
    },
  ];

  // Get tabs that should be visible (have questions to show)
  const getVisibleTabs = () => {
    return tabs.filter((tab) => {
      const fieldsToShow = showOnlyRequired
        ? tab.fields.filter(
            (field) => requiredFields[field as keyof typeof requiredFields],
          )
        : tab.fields;
      return fieldsToShow.length > 0;
    });
  };

  // Get fields to consider for a tab (all or only required)
  const getTabFields = (tabIndex: number) => {
    const tab = tabs[tabIndex];
    return showOnlyRequired
      ? tab.fields.filter(
          (field) => requiredFields[field as keyof typeof requiredFields],
        )
      : tab.fields;
  };

  // Calculate completion percentage for current tab
  const getCurrentTabCompletion = (tabIndex: number) => {
    const fieldsToCheck = getTabFields(tabIndex);
    if (fieldsToCheck.length === 0) return 100; // If no fields to check, consider complete

    const completedFields = fieldsToCheck.filter((field) => {
      const value = formData[field as keyof ExtendedVO2MaxData];
      if (field === "currentVO2Max") {
        return value && Number(value) > 0;
      }
      if (
        field === "equipmentAccess" ||
        field === "healthConditions" ||
        field === "medications"
      ) {
        return Array.isArray(value) && value.length > 0;
      }
      if (
        field === "height" ||
        field === "weight" ||
        field === "restingHeartRate"
      ) {
        return value && Number(value) > 0;
      }
      return value !== undefined && value !== null && value !== "";
    }).length;
    return Math.round((completedFields / fieldsToCheck.length) * 100);
  };

  // Calculate overall completion percentage
  const getAllFields = () => {
    const allFields = tabs.flatMap((tab) => tab.fields);
    return showOnlyRequired
      ? allFields.filter(
          (field) => requiredFields[field as keyof typeof requiredFields],
        )
      : allFields;
  };

  const totalFields = getAllFields().length;
  const completedFieldsList = [
    formData.ageGroup,
    formData.sex,
    formData.weight && formData.weight > 0,
    formData.height && formData.height > 0,
    formData.currentVO2Max && formData.currentVO2Max > 0,
    formData.activityLevel,
    formData.healthConditions !== undefined,
    formData.medications !== undefined,
    formData.jointPain !== undefined,
    formData.trainingTime,
    formData.equipmentAccess && formData.equipmentAccess.length > 0,
    formData.restingHeartRate && formData.restingHeartRate > 0,
  ];

  const fieldMapping = [
    "ageGroup",
    "sex",
    "weight",
    "height",
    "currentVO2Max",
    "activityLevel",
    "healthConditions",
    "medications",
    "jointPain",
    "trainingTime",
    "equipmentAccess",
    "restingHeartRate",
  ];

  const relevantFields = getAllFields();
  const completedFields = completedFieldsList
    .filter((_, index) => relevantFields.includes(fieldMapping[index]))
    .filter(Boolean).length;

  const completionPercentage =
    totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 100;

  // Check if current tab is complete and auto-advance
  const handleTabCompletion = () => {
    const currentTabCompletion = getCurrentTabCompletion(currentTab);
    if (currentTabCompletion === 100 && currentTab < tabs.length - 1) {
      setTimeout(() => setCurrentTab(currentTab + 1), 500);
    }
  };

  // Tooltip component for info icons
  const InfoTooltip = ({
    children,
    content,
  }: {
    children: React.ReactNode;
    content: string;
  }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="relative inline-block">
        <div
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          onClick={() => setIsVisible(!isVisible)}
          className="cursor-help"
        >
          {children}
        </div>
        {isVisible && (
          <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-popover border border-border rounded-lg shadow-lg max-w-sm">
            <div className="text-sm text-popover-foreground">
              <strong>Why?</strong> {content}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-200"></div>
          </div>
        )}
      </div>
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ExtendedVO2MaxData, string>> = {};

    // Required validations
    if (!formData.ageGroup) {
      newErrors.ageGroup = "Please select your age group";
    }

    // Q2, Q3 (sex, height, weight) are not required since they don't have (Required) labels

    if (
      !formData.currentVO2Max ||
      formData.currentVO2Max < 10 ||
      formData.currentVO2Max > 90
    ) {
      newErrors.currentVO2Max = "VO2Max must be between 10 and 90 ml/kg/min";
    }

    if (!formData.activityLevel) {
      newErrors.activityLevel = "Please select your activity level";
    }

    // Q12 (resting heart rate) is not required since it doesn't have (Required) label

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to check if any questions have been answered
  const hasAnyAnswers = (): boolean => {
    return !!(
      formData.ageGroup ||
      formData.sex ||
      formData.height ||
      formData.weight ||
      formData.currentVO2Max ||
      formData.vo2maxKnown ||
      formData.activityLevel ||
      formData.healthConditions?.length ||
      formData.medications?.length ||
      formData.trainingTime ||
      formData.equipmentAccess ||
      formData.primaryGoal ||
      formData.restingHeartRate
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission is now handled by individual protocol buttons
    // This prevents automatic navigation after completing all questions
  };

  const updateFormData = (field: keyof ExtendedVO2MaxData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user updates field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Protocol data mapping
  const getProtocolData = (protocolId: string) => {
    const protocolMap = {
      tabata: {
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
      },
      norwegian4x4: {
        name: "Norwegian 4x4 Interval Training",
        vo2maxGain: "~7.2%",
        timeToResults: "8 weeks",
        fitnessLevel: "Moderately trained",
        protocolDuration:
          "4 intervals of 4 min at 90–95% HRmax + 3 min rest (~40 mins total)",
        sportModality: "Running (treadmill)",
        researchPopulation: "Moderately trained healthy men, avg. age 24.6 yrs",
        researchers: "Jan Helgerud et al.",
        institution: "Norwegian University of Science and Technology",
        location: "Norway",
        year: "2007",
        doi: "https://doi.org/10.1249/mss.0b013e3180304570",
      },
      "10-20-30": {
        name: "10-20-30 Protocol",
        vo2maxGain: "~13% improvement",
        timeToResults: "7–8 weeks",
        fitnessLevel: "Amateur to Recreational Athlete",
        protocolDuration:
          "Running: 30s low, 20s moderate, 10s sprint x 5 reps/set x 3 sets",
        sportModality: "Running",
        researchPopulation:
          "Moderately trained runners (avg. age ~41 yrs, male/female)",
        researchers: "Thomas Gunnarsson et al.",
        institution: "University of Copenhagen",
        location: "Denmark",
        year: "2012",
        doi: "https://doi.org/10.1152/japplphysiol.00334.2012",
      },
      "billat30-30": {
        name: "Billat's 30:30",
        vo2maxGain:
          "Not quantified directly but improves max velocity and endurance",
        timeToResults: "4–6 weeks",
        fitnessLevel: "Advanced to Athlete",
        protocolDuration: "30s at 100% vVO2max, 30s jog, repeated ~12–20 mins",
        sportModality: "Running",
        researchPopulation: "Well-trained middle and long-distance runners",
        researchers: "Veronique Billat",
        institution: "University of Evry-Val-d'Essonne",
        location: "France",
        year: "1999",
        doi: "https://doi.org/10.2165/00007256-200131020-00001",
      },
      lactateThreshold: {
        name: "Lactate Threshold Training",
        vo2maxGain: "Modest, typically 3–5%",
        timeToResults: "~3–6 weeks",
        fitnessLevel: "Amateur to Athlete",
        protocolDuration: "~30 mins per session",
        sportModality: "Treadmill Running",
        researchPopulation: "Healthy males (age ~22)",
        researchers: "Hamish Carter et al.",
        institution: "University of Brighton",
        location: "UK",
        year: "2000",
        doi: "https://doi.org/10.1152/jappl.2000.89.5.1744",
      },
      zone2: {
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
      },
    };

    return (
      protocolMap[protocolId as keyof typeof protocolMap] ||
      protocolMap["zone2"]
    );
  };

  // Protocol ranking based on VO₂max Protocol Selection Flowchart
  const calculateProtocolRanking = () => {
    const protocols = [
      { id: "tabata", name: "Tabata Protocol", score: 0, reasons: [] },
      {
        id: "norwegian4x4",
        name: "Norwegian 4x4 Interval Training",
        score: 0,
        reasons: [],
      },
      { id: "10-20-30", name: "10-20-30 Protocol", score: 0, reasons: [] },
      { id: "billat30-30", name: "Billat's 30:30", score: 0, reasons: [] },
      {
        id: "lactateThreshold",
        name: "Lactate Threshold Training",
        score: 0,
        reasons: [],
      },
      { id: "zone2", name: "Zone 2 Training", score: 0, reasons: [] },
    ];

    // Step 1: Check for health risks or joint pain [Q6, Q7, Q8]
    const hasHealthRisks =
      formData.healthConditions &&
      formData.healthConditions.length > 0 &&
      !formData.healthConditions.includes("None of the above");

    const takesBetaBlockers =
      formData.medications && formData.medications.includes("Beta blockers");

    const takesStatins =
      formData.medications && formData.medications.includes("Statins");

    const hasJointPain = formData.jointPain === true;

    if (hasHealthRisks || hasJointPain || takesBetaBlockers) {
      // Recommend low-impact, low-to-moderate intensity
      protocols.find((p) => p.id === "zone2").score += 10;
      protocols
        .find((p) => p.id === "zone2")
        .reasons.push("Safe for health conditions");
      protocols.find((p) => p.id === "10-20-30").score += 8;
      protocols
        .find((p) => p.id === "10-20-30")
        .reasons.push("Moderate intensity option");
      protocols.find((p) => p.id === "lactateThreshold").score += 6;
      protocols
        .find((p) => p.id === "lactateThreshold")
        .reasons.push("Lower intensity alternative");

      if (takesBetaBlockers) {
        // Penalize HR-based protocols
        protocols.find((p) => p.id === "norwegian4x4").score -= 5;
        protocols
          .find((p) => p.id === "norwegian4x4")
          .reasons.push("Less suitable with beta blockers");
      }

      if (takesStatins) {
        // Penalize high-intensity protocols
        protocols.find((p) => p.id === "tabata").score -= 3;
        protocols.find((p) => p.id === "billat30-30").score -= 3;
      }
    } else {
      // Step 2: Check activity level [Q5]
      if (
        formData.activityLevel === "Inactive" ||
        formData.activityLevel === "Light"
      ) {
        protocols.find((p) => p.id === "zone2").score += 9;
        protocols
          .find((p) => p.id === "zone2")
          .reasons.push("Ideal for beginners");
        protocols.find((p) => p.id === "lactateThreshold").score += 7;
        protocols
          .find((p) => p.id === "lactateThreshold")
          .reasons.push("Good progression option");
        protocols.find((p) => p.id === "10-20-30").score += 6;
        protocols
          .find((p) => p.id === "10-20-30")
          .reasons.push("Entry-level HIIT");
      } else if (
        formData.activityLevel === "Moderate" ||
        formData.activityLevel === "High"
      ) {
        // Step 3: Check VO₂max level and age [Q1, Q4]
        const age =
          formData.ageGroup === "Under 30"
            ? 25
            : formData.ageGroup === "30–49"
              ? 40
              : formData.ageGroup === "50–64"
                ? 57
                : 70;

        const vo2max = formData.currentVO2Max || 0;

        if (vo2max < 40 || age >= 50) {
          protocols.find((p) => p.id === "10-20-30").score += 9;
          protocols
            .find((p) => p.id === "10-20-30")
            .reasons.push("Age/fitness appropriate");
          protocols.find((p) => p.id === "zone2").score += 8;
          protocols
            .find((p) => p.id === "zone2")
            .reasons.push("Conservative progression");
          protocols.find((p) => p.id === "norwegian4x4").score += 6;
          protocols
            .find((p) => p.id === "norwegian4x4")
            .reasons.push("Modified version suitable");
        } else if (vo2max >= 40 && age < 50) {
          // Step 4: Check primary goal [Q11]
          if (
            formData.primaryGoal === "General health / energy" ||
            formData.primaryGoal === "Weight loss"
          ) {
            protocols.find((p) => p.id === "zone2").score += 9;
            protocols
              .find((p) => p.id === "zone2")
              .reasons.push("Perfect for health goals");
            protocols.find((p) => p.id === "10-20-30").score += 8;
            protocols
              .find((p) => p.id === "10-20-30")
              .reasons.push("Effective for general fitness");
          } else if (
            formData.primaryGoal === "Improve cardiovascular fitness / VO₂max"
          ) {
            protocols.find((p) => p.id === "norwegian4x4").score += 10;
            protocols
              .find((p) => p.id === "norwegian4x4")
              .reasons.push("Proven VO₂max improvement");
            protocols.find((p) => p.id === "tabata").score += 9;
            protocols
              .find((p) => p.id === "tabata")
              .reasons.push("High VO₂max gains");
            protocols.find((p) => p.id === "10-20-30").score += 7;
            protocols
              .find((p) => p.id === "10-20-30")
              .reasons.push("Good VO₂max option");
          } else if (formData.primaryGoal === "Athletic performance") {
            protocols.find((p) => p.id === "billat30-30").score += 10;
            protocols
              .find((p) => p.id === "billat30-30")
              .reasons.push("Elite performance focus");
            protocols.find((p) => p.id === "tabata").score += 9;
            protocols
              .find((p) => p.id === "tabata")
              .reasons.push("High-intensity training");
            protocols.find((p) => p.id === "lactateThreshold").score += 8;
            protocols
              .find((p) => p.id === "lactateThreshold")
              .reasons.push("Race-specific adaptation");
          }
        }
      }
    }

    // Step 5: Time considerations [Q9]
    if (formData.trainingTime === "<1 hour") {
      protocols.find((p) => p.id === "tabata").score += 5;
      protocols
        .find((p) => p.id === "tabata")
        .reasons.push("Very time efficient");
      protocols.find((p) => p.id === "10-20-30").score += 3;
      protocols
        .find((p) => p.id === "10-20-30")
        .reasons.push("Short sessions possible");
      protocols.find((p) => p.id === "zone2").score -= 3; // Requires longer sessions
    } else if (
      formData.trainingTime === "3–4 hours" ||
      formData.trainingTime === "5+ hours"
    ) {
      protocols.find((p) => p.id === "zone2").score += 3;
      protocols
        .find((p) => p.id === "zone2")
        .reasons.push("Benefits from longer sessions");
    }

    // Step 6: Equipment considerations [Q10]
    const hasLowImpactEquipment =
      formData.equipmentAccess &&
      (formData.equipmentAccess.includes("Stationary bike") ||
        formData.equipmentAccess.includes("Elliptical") ||
        formData.equipmentAccess.includes("Rowing machine"));

    if (hasJointPain && hasLowImpactEquipment) {
      protocols.forEach((p) => {
        if (p.score > 0) p.reasons.push("Low-impact equipment available");
      });
    }

    // Default scores for protocols that haven't been scored yet
    protocols.forEach((protocol) => {
      if (protocol.score === 0) {
        protocol.score = 3; // Base score
        protocol.reasons.push("General fitness option");
      }
    });

    return protocols.sort((a, b) => b.score - a.score);
  };

  // Calculate confidence level based on answered questions
  const getConfidenceLevel = () => {
    const requiredAnswered = [
      formData.ageGroup,
      formData.currentVO2Max,
      formData.activityLevel,
      formData.healthConditions !== undefined,
      formData.medications !== undefined,
      formData.jointPain !== undefined,
    ].filter(Boolean).length;

    const optionalAnswered = [
      formData.sex,
      formData.height,
      formData.weight,
      formData.trainingTime,
      formData.equipmentAccess,
      formData.primaryGoal,
      formData.restingHeartRate,
    ].filter(Boolean).length;

    const totalAnswered = requiredAnswered + optionalAnswered;

    if (requiredAnswered < 6)
      return {
        level: "Low",
        percentage: Math.round((totalAnswered / 12) * 100),
      };
    if (totalAnswered >= 10)
      return {
        level: "High",
        percentage: Math.round((totalAnswered / 12) * 100),
      };
    return {
      level: "Medium",
      percentage: Math.round((totalAnswered / 12) * 100),
    };
  };

  const rankedProtocols = calculateProtocolRanking();
  const confidence = getConfidenceLevel();

  // Update form data and check for tab completion
  const updateFormDataWithTabCheck = (
    field: keyof ExtendedVO2MaxData,
    value: any,
  ) => {
    updateFormData(field, value);
    // Delay the tab check to allow state to update
    setTimeout(handleTabCompletion, 100);
  };

  const handleHealthConditionChange = (condition: string, checked: boolean) => {
    const current = formData.healthConditions || [];
    const updated = checked
      ? [...current, condition]
      : current.filter((c) => c !== condition);
    updateFormDataWithTabCheck("healthConditions", updated);
  };

  const handleMedicationChange = (medication: string, checked: boolean) => {
    const current = formData.medications || [];
    const updated = checked
      ? [...current, medication]
      : current.filter((m) => m !== medication);
    updateFormDataWithTabCheck("medications", updated);
  };

  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    const current = formData.equipmentAccess || [];
    const updated = checked
      ? [...current, equipment]
      : current.filter((e) => e !== equipment);
    updateFormDataWithTabCheck("equipmentAccess", updated);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Top Section - Questions Form */}
      <div className="bg-card border-b border-border">
        <div className="w-full max-w-4xl mx-auto p-8">
          {/* Back Button */}
          {onBack && (
            <div className="mb-6 animate-in fade-in slide-in-from-left-4 duration-500">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                Back to Home
              </Button>
            </div>
          )}

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 animate-in fade-in duration-500">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              Pick the VO₂Max training protocol that works for you
            </h2>

            {/* Progress Indicator */}
            <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>
                  {showOnlyRequired ? "Required Fields" : "Overall Progress"}
                </span>
                <span
                  className={`font-medium transition-colors duration-300 ${completedFields > 0 ? "text-primary" : ""}`}
                >
                  {completedFields} / {totalFields} questions answered
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {getVisibleTabs().map((tab) => {
                const completion = getCurrentTabCompletion(tab.id);
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      currentTab === tab.id
                        ? `bg-${tab.color}-100 text-${tab.color}-700 border-2 border-${tab.color}-300`
                        : "bg-muted text-muted-foreground border-2 border-transparent hover:bg-muted/80"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.title}</span>
                    {completion === 100 && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Required Questions Filter */}
          <div className="flex items-center justify-start gap-3 p-4 pr-0">
            <Checkbox
              id="show-required-only"
              checked={showOnlyRequired}
              onCheckedChange={(checked) =>
                setShowOnlyRequired(checked as boolean)
              }
              className="data-[state=checked]:bg-primary border-primary"
            />
            <Label
              htmlFor="show-required-only"
              className="text-sm font-medium text-primary cursor-pointer"
            >
              Answer only required questions
            </Label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Tab 1: Age & Demographics */}
            {currentTab === 0 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">I. Age & Demographics</h3>
                </div>

                {/* Q1: Age Group */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    Q1. What is your age group? (Required)
                    <InfoTooltip content="Age affects cardiovascular adaptability, recovery, and risk profile. Older adults may respond better to moderate or progressive protocols.">
                      <Info className="w-4 h-4 text-blue-600 cursor-help" />
                    </InfoTooltip>
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Under 30", "30–49", "50–64", "65 or older"].map(
                      (age) => (
                        <label
                          key={age}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                            formData.ageGroup === age
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="ageGroup"
                            value={age}
                            checked={formData.ageGroup === age}
                            onChange={(e) =>
                              updateFormDataWithTabCheck(
                                "ageGroup",
                                e.target.value,
                              )
                            }
                            className="sr-only"
                          />
                          <span className="font-medium text-sm">{age}</span>
                        </label>
                      ),
                    )}
                  </div>
                  {errors.ageGroup && (
                    <p className="text-sm text-destructive">
                      {errors.ageGroup}
                    </p>
                  )}
                </div>

                {/* Q2: Sex */}
                {(!showOnlyRequired || requiredFields.sex) && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      Q2. What is your sex assigned at birth?
                      <InfoTooltip content="Sex affects oxygen delivery capacity and VO₂max baseline due to differences in hemoglobin levels and heart size.">
                        <Info className="w-4 h-4 text-blue-600 cursor-help" />
                      </InfoTooltip>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {["male", "female"].map((sex) => (
                        <label
                          key={sex}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                            formData.sex === sex
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="sex"
                            value={sex}
                            checked={formData.sex === sex}
                            onChange={(e) =>
                              updateFormDataWithTabCheck("sex", e.target.value)
                            }
                            className="sr-only"
                          />
                          <span className="font-medium text-sm capitalize">
                            {sex}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.sex && (
                      <p className="text-sm text-destructive">{errors.sex}</p>
                    )}
                  </div>
                )}

                {/* Q3: Height & Weight */}
                {(!showOnlyRequired ||
                  requiredFields.height ||
                  requiredFields.weight) && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      Q3. What is your current height and weight?
                      <InfoTooltip content="Used to calculate BMI. Higher BMI affects joint loading and reduces relative VO₂max, which guides protocol intensity and impact level.">
                        <Info className="w-4 h-4 text-blue-600 cursor-help" />
                      </InfoTooltip>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="height"
                          className="flex items-center gap-2 mb-2"
                        >
                          <Ruler className="w-4 h-4" />
                          Height (cm)
                        </Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="Enter height in cm"
                          value={formData.height || ""}
                          onChange={(e) =>
                            updateFormDataWithTabCheck(
                              "height",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className={errors.height ? "border-destructive" : ""}
                        />
                        {errors.height && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.height}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="weight"
                          className="flex items-center gap-2 mb-2"
                        >
                          <Scale className="w-4 h-4" />
                          Weight (kg)
                        </Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="Enter weight in kg"
                          value={formData.weight || ""}
                          onChange={(e) =>
                            updateFormDataWithTabCheck(
                              "weight",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className={errors.weight ? "border-destructive" : ""}
                        />
                        {errors.weight && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.weight}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Current Fitness Level */}
            {currentTab === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold">
                    II. Current Fitness Level
                  </h3>
                </div>

                {/* Q4: Current VO2Max */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    Q4. What is your current VO₂max? (Required)
                    <InfoTooltip content="Baseline VO���max helps set training intensity zones and predict improvement potential.">
                      <Info className="w-4 h-4 text-green-600 cursor-help" />
                    </InfoTooltip>
                  </Label>
                  <div className="space-y-3">
                    <div>
                      <Label
                        htmlFor="vo2max"
                        className="flex items-center gap-2 mb-2"
                      >
                        <TrendingUp className="w-4 h-4" />
                        Enter value in ml/kg/min
                      </Label>
                      <Input
                        id="vo2max"
                        type="number"
                        step="0.1"
                        placeholder="Enter your current VO2Max"
                        value={formData.currentVO2Max || ""}
                        onChange={(e) =>
                          updateFormDataWithTabCheck(
                            "currentVO2Max",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className={
                          errors.currentVO2Max ? "border-destructive" : ""
                        }
                      />
                      {errors.currentVO2Max && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.currentVO2Max}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Q5: Activity Level */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    Q5. What is your current activity level? (Required)
                    <InfoTooltip content="Your current training load determines which protocols your body can safely adapt to.">
                      <Info className="w-4 h-4 text-green-600 cursor-help" />
                    </InfoTooltip>
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { value: "Inactive", label: "Inactive (0–1×/week)" },
                      { value: "Light", label: "Light (2–3×/week)" },
                      { value: "Moderate", label: "Moderate (3–4×/week)" },
                      { value: "High", label: "High (5+×/week)" },
                    ].map((level) => (
                      <label
                        key={level.value}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          formData.activityLevel === level.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="activityLevel"
                          value={level.value}
                          checked={formData.activityLevel === level.value}
                          onChange={(e) =>
                            updateFormDataWithTabCheck(
                              "activityLevel",
                              e.target.value,
                            )
                          }
                          className="sr-only"
                        />
                        <span className="font-medium text-sm">
                          {level.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.activityLevel && (
                    <p className="text-sm text-destructive">
                      {errors.activityLevel}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Health Limitations */}
            {currentTab === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold">
                    III. Health Limitations (Risks & Contraindications)
                  </h3>
                </div>

                {/* Q6: Health Conditions */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    Q6. Do you currently have any of these conditions?
                    (Required)
                    <InfoTooltip content="These conditions may limit the intensity or type of training that's safe to perform without medical supervision.">
                      <Info className="w-4 h-4 text-red-600 cursor-help" />
                    </InfoTooltip>
                  </Label>
                  <div className="space-y-2">
                    {[
                      "High blood pressure",
                      "Cardiovascular disease",
                      "Type 2 diabetes",
                    ].map((condition) => (
                      <div
                        key={condition}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={condition}
                          checked={(formData.healthConditions || []).includes(
                            condition,
                          )}
                          onCheckedChange={(checked) =>
                            handleHealthConditionChange(
                              condition,
                              checked as boolean,
                            )
                          }
                        />
                        <Label htmlFor={condition}>{condition}</Label>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="none-conditions"
                        checked={(formData.healthConditions || []).includes(
                          "None of the above",
                        )}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormDataWithTabCheck("healthConditions", [
                              "None of the above",
                            ]);
                          } else {
                            updateFormDataWithTabCheck("healthConditions", []);
                          }
                        }}
                      />
                      <Label htmlFor="none-conditions">None of the above</Label>
                    </div>
                  </div>
                </div>

                {/* Q7: Medications */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    Q7. Are you taking any of the following medications?
                    (Required)
                    <InfoTooltip content="Beta blockers reduce heart rate response, limiting HR-based protocols like 4×4 intervals. Statins may increase risk of muscle soreness and fatigue in high-intensity training.">
                      <Info className="w-4 h-4 text-red-600 cursor-help" />
                    </InfoTooltip>
                  </Label>
                  <div className="space-y-2">
                    {["Beta blockers", "Statins"].map((medication) => (
                      <div
                        key={medication}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={medication}
                          checked={(formData.medications || []).includes(
                            medication,
                          )}
                          onCheckedChange={(checked) =>
                            handleMedicationChange(
                              medication,
                              checked as boolean,
                            )
                          }
                        />
                        <Label htmlFor={medication}>{medication}</Label>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="none-medications"
                        checked={(formData.medications || []).includes(
                          "None of the above",
                        )}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormDataWithTabCheck("medications", [
                              "None of the above",
                            ]);
                          } else {
                            updateFormDataWithTabCheck("medications", []);
                          }
                        }}
                      />
                      <Label htmlFor="none-medications">
                        None of the above
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Q8: Joint Pain */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    Q8. Do you experience joint or movement-related pain during
                    exercise? (Required)
                    <InfoTooltip content="Joint discomfort makes high-impact protocols (e.g., treadmill HIIT) less appropriate. Lower-impact options (bike, elliptical) are safer.">
                      <Info className="w-4 h-4 text-red-600 cursor-help" />
                    </InfoTooltip>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: true, label: "Yes" },
                      { value: false, label: "No" },
                    ].map((option) => (
                      <label
                        key={option.label}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          formData.jointPain === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="jointPain"
                          value={option.value.toString()}
                          checked={formData.jointPain === option.value}
                          onChange={(e) =>
                            updateFormDataWithTabCheck(
                              "jointPain",
                              e.target.value === "true",
                            )
                          }
                          className="sr-only"
                        />
                        <span className="font-medium text-sm">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Time & Lifestyle Constraints */}
            {currentTab === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold">
                    IV. Time & Lifestyle Constraints
                  </h3>
                </div>

                {/* Q9: Training Time */}
                {(!showOnlyRequired || requiredFields.trainingTime) && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      Q9. How many hours per week can you realistically dedicate
                      to training?
                      <InfoTooltip content="Some protocols (e.g., Tabata) are effective with minimal time. Others (e.g., Zone 2) require longer durations for results.">
                        <Info className="w-4 h-4 text-purple-600 cursor-help" />
                      </InfoTooltip>
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["<1 hour", "1–2 hours", "3–4 hours", "5+ hours"].map(
                        (time) => (
                          <label
                            key={time}
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                              formData.trainingTime === time
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="trainingTime"
                              value={time}
                              checked={formData.trainingTime === time}
                              onChange={(e) =>
                                updateFormDataWithTabCheck(
                                  "trainingTime",
                                  e.target.value,
                                )
                              }
                              className="sr-only"
                            />
                            <span className="font-medium text-sm">{time}</span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Q10: Equipment Access */}
                {(!showOnlyRequired || requiredFields.equipmentAccess) && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      Q10. Which training modalities do you have access to or
                      prefer?
                      <InfoTooltip content="VO₂max protocols must match your available equipment and impact tolerance for long-term adherence.">
                        <Info className="w-4 h-4 text-purple-600 cursor-help" />
                      </InfoTooltip>
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        "Treadmill",
                        "Outdoor walk/run",
                        "Stationary bike",
                        "Elliptical",
                        "Stair stepper",
                        "Rowing machine",
                      ].map((equipment) => (
                        <div
                          key={equipment}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={equipment}
                            checked={(formData.equipmentAccess || []).includes(
                              equipment,
                            )}
                            onCheckedChange={(checked) =>
                              handleEquipmentChange(
                                equipment,
                                checked as boolean,
                              )
                            }
                          />
                          <Label htmlFor={equipment} className="text-sm">
                            {equipment}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Training Goals & Recovery Capacity */}
            {currentTab === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold">
                    V. Training Goals & Recovery Capacity
                  </h3>
                </div>

                {/* Q11: Primary Goal */}
                {(!showOnlyRequired || requiredFields.primaryGoal) && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      Q11. What is your primary fitness goal?
                      <InfoTooltip content="Your goal defines whether we focus on aerobic base, max oxygen uptake, fat metabolism, or sport-specific gains.">
                        <Info className="w-4 h-4 text-orange-600 cursor-help" />
                      </InfoTooltip>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "General health / energy",
                        "Improve cardiovascular fitness / VO₂max",
                        "Weight loss",
                        "Athletic performance",
                      ].map((goal) => (
                        <label
                          key={goal}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                            formData.primaryGoal === goal
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="primaryGoal"
                            value={goal}
                            checked={formData.primaryGoal === goal}
                            onChange={(e) =>
                              updateFormDataWithTabCheck(
                                "primaryGoal",
                                e.target.value,
                              )
                            }
                            className="sr-only"
                          />
                          <span className="font-medium text-sm">{goal}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Q12: Resting Heart Rate */}
                {(!showOnlyRequired || requiredFields.restingHeartRate) && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      Q12. What is your resting heart rate (seated, morning)?
                      <InfoTooltip content="Resting HR is an indirect marker of cardiovascular fitness and recovery status. Higher HR may suggest a need for more gradual progression.">
                        <Info className="w-4 h-4 text-orange-600 cursor-help" />
                      </InfoTooltip>
                    </Label>
                    <div>
                      <Label
                        htmlFor="rhr"
                        className="flex items-center gap-2 mb-2"
                      >
                        <Heart className="w-4 h-4" />
                        Enter value (bpm)
                      </Label>
                      <Input
                        id="rhr"
                        type="number"
                        placeholder="Enter your resting heart rate"
                        value={formData.restingHeartRate || ""}
                        onChange={(e) =>
                          updateFormDataWithTabCheck(
                            "restingHeartRate",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className={
                          errors.restingHeartRate ? "border-destructive" : ""
                        }
                      />
                      {errors.restingHeartRate && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.restingHeartRate}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-8">
              {(() => {
                const visibleTabs = getVisibleTabs();
                const currentIndex = visibleTabs.findIndex(
                  (tab) => tab.id === currentTab,
                );
                const isFirstTab = currentIndex === 0;
                const isLastTab = currentIndex === visibleTabs.length - 1;

                return (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (currentIndex > 0) {
                          setCurrentTab(visibleTabs[currentIndex - 1].id);
                        }
                      }}
                      disabled={isFirstTab}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    {!isLastTab && (
                      <Button
                        type="button"
                        onClick={() => {
                          if (currentIndex < visibleTabs.length - 1) {
                            setCurrentTab(visibleTabs[currentIndex + 1].id);
                          }
                        }}
                        className="flex items-center gap-2"
                      >
                        Next
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Button>
                    )}
                  </>
                );
              })()}
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Section - Training Protocol Cards */}
      <div className="py-5 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                {hasAnyAnswers()
                  ? "Training protocols ranked based on your responses using our science-backed algorithm"
                  : "Explore all training protocols below. Answer questions above to get personalized recommendations"}
              </p>

              {/* Confidence Level Indicator */}
              <div className="mt-8 mx-auto flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-start">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        confidence.level === "High"
                          ? "bg-emerald-500"
                          : confidence.level === "Medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    <span className="font-medium text-sm">
                      Recommendation confidence: {confidence.level}
                    </span>
                  </div>
                </div>
                {confidence.level === "Low" && (
                  <p className="text-sm text-muted-foreground">
                    Answer the required questions for better recommendations
                  </p>
                )}
              </div>
            </div>

            {/* Training Protocol Cards - Dynamically Ranked */}
            <div className="space-y-8">
              {rankedProtocols.map((protocol, index) => {
                const protocolData = getProtocolData(protocol.id);
                const isRecommended = hasAnyAnswers() && index === 0;

                return (
                  <div
                    key={protocol.id}
                    className={`bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8 duration-700 ${
                      isRecommended
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 ring-2 ring-emerald-200 dark:ring-emerald-800"
                        : "border-border"
                    }`}
                    style={{ animationDelay: `${index * 100 + 100}ms` }}
                  >
                    {isRecommended && (
                      <div className="mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-medium">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          Recommended for You
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="flex flex-row gap-2">
                          <h4
                            className={`text-2xl font-bold mb-4 text-left sm:text-center ${
                              isRecommended
                                ? "text-emerald-700 dark:text-emerald-300"
                                : "text-primary"
                            }`}
                          >
                            {protocolData.name}
                          </h4>
                          <Button
                            asChild
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                            variant="outline"
                            size="sm"
                          >
                            <a
                              href={protocolData.doi}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View Research Reference"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>

                        {protocol.reasons.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap justify-start items-start gap-2">
                              {protocol.reasons
                                .slice(0, 2)
                                .map((reason, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                                  >
                                    {reason}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-4 mt-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-2 sm:gap-6">
                          <div>
                            <span className="text-sm text-muted-foreground">
                              VO2max Gain
                            </span>
                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                              {protocolData.vo2maxGain}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Time to Results
                            </span>
                            <p className="text-lg font-semibold">
                              {protocolData.timeToResults}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Fitness Level
                            </span>
                            <p className="text-lg font-semibold">
                              {protocolData.fitnessLevel}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Protocol Duration
                            </span>
                            <p className="text-lg font-bold">
                              {protocolData.protocolDuration}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Sport Modality
                            </span>
                            <p className="text-lg font-semibold">
                              {protocolData.sportModality}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Research Population
                            </span>
                            <p className="text-lg font-semibold">
                              {protocolData.researchPopulation}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-border/50">
                        <div className="flex flex-col sm:flex-row justify-start items-start gap-9">
                          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-start sm:items-center sm:gap-9">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Users className="w-3 h-3" />
                              <span>{protocolData.researchers}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Building className="w-3 h-3" />
                              <span>{protocolData.institution}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span>{protocolData.location}</span>
                              <Calendar className="w-3 h-3 ml-2" />
                              <span>{protocolData.year}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          className={`w-full ${
                            isRecommended
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
                              : "bg-primary hover:bg-primary/90 text-primary-foreground"
                          } transition-all duration-300`}
                          onClick={() => {
                            console.log(
                              "Protocol button clicked for:",
                              protocol.id,
                            );

                            const handleProtocolSelection = async () => {
                              console.log(
                                "Executing protocol selection for:",
                                protocol.id,
                              );
                              // Convert extended data back to base VO2MaxData format
                              const baseData: VO2MaxData = {
                                age:
                                  formData.ageGroup === "Under 30"
                                    ? 25
                                    : formData.ageGroup === "30–49"
                                      ? 40
                                      : formData.ageGroup === "50–64"
                                        ? 57
                                        : 70,
                                sex: formData.sex || "male",
                                weight: formData.weight || 70,
                                height: formData.height || 170,
                                currentVO2Max: formData.currentVO2Max || 35,
                                restingHeartRate:
                                  formData.restingHeartRate || 60,
                              };

                              // Register protocol for user
                              try {
                                if (isAuthenticated && user?.id) {
                                  await UserProtocolsService.setCurrentProtocol(user.id, protocol.id);
                                }
                              } catch (err) {
                                console.error("Failed to register protocol for user:", err);
                                // Optionally show a toast or error message
                              }

                              // Navigate to dashboard with protocol data
                              navigate(`/dashboard?protocol=${protocol.id}`);

                              // Also call the original onSubmit for backward compatibility
                              onSubmit({
                                ...baseData,
                                selectedProtocol: protocol.id,
                              });
                            };

                            // Require authentication before proceeding
                            console.log("About to call requireAuth");
                            try {
                              if (isAuthenticated) {
                                console.log(
                                  "User is authenticated, proceeding",
                                );
                                handleProtocolSelection();
                              } else {
                                console.log(
                                  "User not authenticated, calling requireAuth",
                                );
                                requireAuth(handleProtocolSelection);
                              }
                            } catch (error) {
                              console.error("Error in auth check:", error);
                              // Fallback: show alert if auth system fails
                              alert(
                                "Authentication system temporarily unavailable. Please try again later.",
                              );
                            }
                          }}
                        >
                          Plan with this protocol
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <SimpleAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign in to create your training plan"
        description="Secure your personalized VO₂Max training protocol and track your progress"
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
