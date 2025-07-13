import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity } from "lucide-react";
import { FormProvider, useForm } from "@/contexts/FormContext";
import { DemographicsTab } from "@/components/form-tabs/DemographicsTab";
import { FitnessTab } from "@/components/form-tabs/FitnessTab";
import { ProtocolCard } from "@/components/protocols/ProtocolCard";
import {
  calculateProtocolRanking,
  getConfidenceLevel,
  hasAnyAnswers,
} from "@/lib/protocols/ranking";
import { getProtocolById } from "@/lib/protocols/data";
import { VO2MaxData } from "@shared/api";

interface VO2MaxFormProps {
  onSubmit: (data: VO2MaxData) => void;
  onBack?: () => void;
}

// Tab configuration
const TABS = [
  { id: "demographics", title: "Demographics", component: DemographicsTab },
  { id: "fitness", title: "Fitness", component: FitnessTab },
  // Add more tabs as needed
] as const;

export function VO2MaxFormRefactored({ onSubmit, onBack }: VO2MaxFormProps) {
  return (
    <FormProvider>
      <VO2MaxFormContent onSubmit={onSubmit} onBack={onBack} />
    </FormProvider>
  );
}

function VO2MaxFormContent({ onSubmit, onBack }: VO2MaxFormProps) {
  const [currentTab, setCurrentTab] = useState(TABS[0].id);
  const { state, validateForm, hasAnyData } = useForm();

  // Calculate protocol rankings
  const rankings = calculateProtocolRanking(state.data);
  const confidence = getConfidenceLevel(state.data);
  const showProtocols = hasAnyAnswers(state.data);

  const handleProtocolSelect = (protocolId: string) => {
    // Convert form data to VO2MaxData format
    const baseData: VO2MaxData = {
      age:
        state.data.ageGroup === "Under 30"
          ? 25
          : state.data.ageGroup === "30–49"
            ? 40
            : state.data.ageGroup === "50–64"
              ? 57
              : 70,
      sex: (state.data.sex as "male" | "female") || "male",
      weight: state.data.weight || 70,
      height: state.data.height || 170,
      currentVO2Max: state.data.currentVO2Max || 35,
      restingHeartRate: state.data.restingHeartRate || 60,
      selectedProtocol: protocolId,
    };

    onSubmit(baseData);
  };

  const currentTabIndex = TABS.findIndex((tab) => tab.id === currentTab);
  const isLastTab = currentTabIndex === TABS.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <FormHeader confidence={confidence} hasData={hasAnyData()} />

          {/* Form Tabs */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <FormNavigation
              tabs={TABS}
              currentTab={currentTab}
              onTabChange={(tabId: string) =>
                setCurrentTab(tabId as "demographics")
              }
            />

            <form className="p-8">
              <TabContent currentTab={currentTab} />

              {/* Navigation */}
              <FormButtons
                currentTabIndex={currentTabIndex}
                isLastTab={isLastTab}
                onBack={onBack}
                onNext={() => {
                  if (currentTabIndex < TABS.length - 1) {
                    setCurrentTab(
                      TABS[currentTabIndex + 1].id as "demographics",
                    );
                  }
                }}
                canProgress={true} // Add validation logic here
              />
            </form>
          </div>

          {/* Protocol Recommendations */}
          {showProtocols && (
            <ProtocolRecommendations
              rankings={rankings}
              onProtocolSelect={handleProtocolSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface FormHeaderProps {
  confidence: ReturnType<typeof getConfidenceLevel>;
  hasData: boolean;
}

function FormHeader({ confidence, hasData }: FormHeaderProps) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
        <Activity className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-3xl font-bold text-foreground mb-2">
        Pick the VO₂Max training protocol that works for you
      </h2>

      {/* Description */}
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
        {hasData
          ? "Training protocols ranked based on your responses using our science-backed algorithm"
          : "Explore all training protocols below. Answer questions above to get personalized recommendations"}
      </p>

      {/* Confidence Indicator */}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center max-w-md mx-auto">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                confidence.level === "High"
                  ? "bg-green-500"
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
        {confidence.message && (
          <p className="text-sm text-muted-foreground">{confidence.message}</p>
        )}
      </div>
    </div>
  );
}

interface FormNavigationProps {
  tabs: typeof TABS;
  currentTab: string;
  onTabChange: (tabId: string) => void;
}

function FormNavigation({
  tabs,
  currentTab,
  onTabChange,
}: FormNavigationProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
              currentTab === tab.id
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
            }`}
          >
            <span className="text-sm">Step {index + 1}</span>
            <div className="font-semibold">{tab.title}</div>
          </button>
        ))}
      </nav>
    </div>
  );
}

interface TabContentProps {
  currentTab: string;
}

function TabContent({ currentTab }: TabContentProps) {
  const tab = TABS.find((t) => t.id === currentTab);
  const Component = tab?.component;

  if (!Component) {
    return <div>Tab not found</div>;
  }

  return <Component />;
}

interface FormButtonsProps {
  currentTabIndex: number;
  isLastTab: boolean;
  onBack?: () => void;
  onNext: () => void;
  canProgress: boolean;
}

function FormButtons({
  currentTabIndex,
  isLastTab,
  onBack,
  onNext,
  canProgress,
}: FormButtonsProps) {
  return (
    <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="flex items-center gap-2"
        disabled={!onBack}
      >
        <ArrowLeft className="w-4 h-4" />
        Previous
      </Button>

      {!isLastTab && (
        <Button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2"
          disabled={!canProgress}
        >
          Next
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </Button>
      )}
    </div>
  );
}

interface ProtocolRecommendationsProps {
  rankings: ReturnType<typeof calculateProtocolRanking>;
  onProtocolSelect: (protocolId: string) => void;
}

function ProtocolRecommendations({
  rankings,
  onProtocolSelect,
}: ProtocolRecommendationsProps) {
  return (
    <div className="py-5 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {rankings.map((ranking, index) => {
              const protocol = getProtocolById(ranking.id);
              if (!protocol) return null;

              return (
                <ProtocolCard
                  key={ranking.id}
                  protocol={protocol}
                  ranking={ranking}
                  isRecommended={index === 0}
                  animationDelay={index * 100 + 100}
                  onSelect={onProtocolSelect}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
