import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Clock,
  Target,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Activity,
  Calendar,
} from "lucide-react";
import { VO2MaxData, ImprovementPlan } from "@shared/api";

interface ImprovementPlansProps {
  userData: VO2MaxData;
  plans: ImprovementPlan[];
  onSelectPlan: (plan: ImprovementPlan) => void;
  onBackToForm: () => void;
}

export function ImprovementPlans({
  userData,
  plans,
  onSelectPlan,
  onBackToForm,
}: ImprovementPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<ImprovementPlan | null>(
    null,
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-success/10 text-success border-success/20";
      case "Intermediate":
        return "bg-primary/10 text-primary border-primary/20";
      case "Advanced":
        return "bg-accent/10 text-accent border-accent/20";
      default:
        return "bg-muted text-foreground border-border";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Beginner":
        return <Star className="w-5 h-5" />;
      case "Intermediate":
        return <Target className="w-5 h-5" />;
      case "Advanced":
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 animate-in fade-in duration-500 hover:scale-110 transition-transform duration-300">
          <TrendingUp className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          Your Personalized VO2Max Improvement Plans
        </h2>
        <p className="text-muted-foreground mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          Based on your profile: {userData.age} years old, {userData.sex},{" "}
          {userData.weight}kg, {userData.height}cm
        </p>
        <div className="inline-flex items-center gap-4 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 hover:bg-secondary/70 transition-colors duration-300">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Current VO2Max: {userData.currentVO2Max} ml/kg/min
          </span>
          <span className="flex items-center gap-1">
            <Activity className="w-4 h-4" />
            Resting HR: {userData.restingHeartRate} bpm
          </span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group animate-in fade-in slide-in-from-bottom-8 duration-700 ${
              plan.recommended
                ? "ring-2 ring-primary shadow-lg scale-105"
                : "hover:scale-105"
            } ${
              selectedPlan?.level === plan.level
                ? "ring-2 ring-primary bg-primary/5 shadow-xl"
                : ""
            }`}
            style={{ animationDelay: `${index * 200}ms` }}
            onClick={() => setSelectedPlan(plan)}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Recommended
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-lg ${getLevelColor(plan.level)} border`}
              >
                {getLevelIcon(plan.level)}
              </div>
              <h3 className="text-xl font-bold">{plan.level}</h3>
            </div>

            <div className="space-y-4">
              {/* Time Commitment */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Time Commitment</p>
                  <p className="text-sm text-muted-foreground">
                    {plan.timeCommitment}
                  </p>
                </div>
              </div>

              {/* Results Timeframe */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Expected Results</p>
                  <p className="text-sm text-muted-foreground">
                    {plan.resultsTimeframe}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Realistic Progress</p>
                  <p className="text-sm text-muted-foreground">
                    {plan.realisticProgress}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant={
                selectedPlan?.level === plan.level ? "default" : "outline"
              }
              className="w-full mt-6"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPlan(plan);
              }}
            >
              {selectedPlan?.level === plan.level ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : null}
              {selectedPlan?.level === plan.level ? "Selected" : "Select Plan"}
            </Button>
          </Card>
        ))}
      </div>

      {/* Detailed View */}
      {selectedPlan && (
        <Card className="p-6 mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${getLevelColor(selectedPlan.level)} border`}
            >
              {getLevelIcon(selectedPlan.level)}
            </div>
            {selectedPlan.level} Plan Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Training Protocol
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPlan.trainingProtocol}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Why This Plan Works for You
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPlan.reason}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Realistic Progress Expectations
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPlan.realisticProgress}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Training Tips
                </h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="bg-primary/5 rounded-lg p-3">
                    <p className="font-medium text-primary mb-1">💡 Pro Tip:</p>
                    <p>
                      Start gradually and focus on consistency over intensity.
                      Listen to your body and allow adequate recovery between
                      sessions.
                    </p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="font-medium text-primary mb-1">
                      🎯 Focus Areas:
                    </p>
                    <p>
                      Monitor your heart rate zones, maintain proper form, and
                      track your progress weekly to stay motivated.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Research Population
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPlan.researchPopulation}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Research Results
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPlan.researchResults}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Timeline
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPlan.resultsTimeframe}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button
          variant="outline"
          onClick={onBackToForm}
          className="flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Assessment
        </Button>

        {selectedPlan && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const planText = `VO2Max ${selectedPlan.level} Plan\n\nTraining Protocol:\n${selectedPlan.trainingProtocol}\n\nReason:\n${selectedPlan.reason}\n\nTime Commitment:\n${selectedPlan.timeCommitment}\n\nResults Timeframe:\n${selectedPlan.resultsTimeframe}\n\nRealistic Progress:\n${selectedPlan.realisticProgress}\n\nResearch Population:\n${selectedPlan.researchPopulation}\n\nResearch Results:\n${selectedPlan.researchResults}`;

                const blob = new Blob([planText], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `VO2Max-${selectedPlan.level}-Plan.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              Export Plan
            </Button>
            <Button
              onClick={() => onSelectPlan(selectedPlan)}
              className="flex items-center gap-2 text-lg px-8 py-6 hover:scale-105 transition-transform duration-300"
            >
              Start {selectedPlan.level} Plan
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
