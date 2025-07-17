import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabase";
import { getProtocolById } from "@/lib/protocols/data";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Activity, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dashboard components
import {
  DashboardLayout,
  DashboardHeader,
  ActiveProtocolCard,
  ProgressStatsGrid,
  ProgressChartSection,
  TrackingSectionsLayout,
  ProtocolCalendarView,
} from "@/components/dashboard";
import {
  BottomNavigation,
  TabId,
} from "@/components/dashboard/BottomNavigation";
import { LoggingModal } from "@/components/dashboard/LoggingModal";
import { FloatingChat } from "@/components/FloatingChat";
import { WeeklyTrackingPanel } from "@/components/dashboard/WeeklyTrackingPanel";
import { SessionMetricsLogging } from "@/components/dashboard/SessionMetricsLogging";
import { BloodBiomarkerSection } from "@/components/dashboard/BloodBiomarkerSection";

// Hooks
import { useDashboardData } from "@/hooks/useDashboardData";

// Utils
import {
  getProtocolDuration,
  getProtocolSessionsPerWeek,
} from "@/components/dashboard/DashboardProtocolUtils";

export function Dashboard() {
  const { user, signOut, loading } = useAuth();

  // Fallback: Check localStorage directly if auth context doesn't have user
  const [localUser, setLocalUser] = useState(null);
  const [profileChecked, setProfileChecked] = useState(false);

  // Check and ensure user profile exists in database
  useEffect(() => {
    const ensureUserProfile = async () => {
      const currentUser = user || localUser;
      if (currentUser && !profileChecked) {
        // Skip database operations in demo mode
        const isDemoMode =
          import.meta.env.DEV &&
          localStorage.getItem("mock_auth_user") !== null;
        if (isDemoMode) {
          console.log("🚀 Demo mode: Skipping user profile database check");
          setProfileChecked(true);
          return;
        }

        console.log(
          "🔍 Dashboard: Ensuring user profile exists for:",
          currentUser.id,
        );

        try {
          const { data: existingProfile, error: selectError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", currentUser.id)
            .single();

          if (selectError && selectError.code !== "PGRST116") {
            console.error("❌ Dashboard: Error checking user profile:");
            console.error("Message:", selectError.message);
            console.error("Code:", selectError.code);
            console.error("Details:", selectError.details);
            console.error("Hint:", selectError.hint);
            console.error("Full error:", JSON.stringify(selectError, null, 2));
          }

          if (!existingProfile && selectError?.code === "PGRST116") {
            console.log("➕ Dashboard: Creating missing user profile");

            const { error: insertError } = await supabase
              .from("user_profiles")
              .insert([
                {
                  id: currentUser.id,
                  email: currentUser.email || currentUser.user_metadata?.email,
                  name: currentUser.user_metadata?.name || currentUser.name,
                  picture:
                    currentUser.user_metadata?.picture || currentUser.picture,
                },
              ]);

            if (insertError) {
              console.error("❌ Dashboard: Error creating user profile:");
              console.error("Message:", insertError.message);
              console.error("Code:", insertError.code);
              console.error("Details:", insertError.details);
              console.error("Hint:", insertError.hint);
              console.error(
                "Full error:",
                JSON.stringify(insertError, null, 2),
              );
            } else {
              console.log("✅ Dashboard: User profile created successfully");
            }
          } else if (existingProfile) {
            console.log("✅ Dashboard: User profile already exists");
          }
        } catch (error) {
          console.error("❌ Dashboard: Error in ensureUserProfile:", error);
        }

        setProfileChecked(true);
      }
    };

    ensureUserProfile();
  }, [user, localUser]);

  useEffect(() => {
    if (!user && !loading) {
      const mockUser = localStorage.getItem("mock_auth_user");
      if (mockUser) {
        try {
          const parsedUser = JSON.parse(mockUser);
          setLocalUser({
            id: parsedUser.id,
            email: parsedUser.email,
            user_metadata: {
              name: parsedUser.name,
              picture: parsedUser.picture,
            },
          });
        } catch (error) {
          console.error("Error parsing localStorage user:", error);
        }
      }
    } else if (user) {
      setLocalUser(null);
    }
  }, [user, loading]);

  // Use either auth context user or localStorage user
  const effectiveUser = user || localUser;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [protocolStartDate, setProtocolStartDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [isLoggingModalOpen, setIsLoggingModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const selectedProtocol = searchParams.get("protocol");
  const protocolData = selectedProtocol
    ? getProtocolById(selectedProtocol)
    : null;

  // Use custom hook for dashboard data
  const { progressStats, userProgress, isLoading } =
    useDashboardData(effectiveUser);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleChangeProtocol = () => {
    navigate("/protocols");
  };

  const handleAddProtocol = () => {
    navigate("/protocols");
  };

  const handleLogTap = () => {
    setIsLoggingModalOpen(true);
  };

  const handleLoggingOptionSelect = (
    optionId: "weekly" | "session" | "biomarkers",
  ) => {
    setActiveTab(optionId);
    setIsLoggingModalOpen(false);
  };

  const handleChatTap = () => {
    setIsChatOpen(true);
  };

  const renderTabContent = () => {
    if (!effectiveUser) return null;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Progress Stats */}
            <div className="flex flex-col gap-4">
              <ProgressStatsGrid progressStats={progressStats} />
              <Button
                onClick={handleAddProtocol}
                className="bg-spotify-green hover:bg-spotify-green/90 text-white font-medium rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 w-full"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Training Protocol
              </Button>
            </div>

            {/* Active Protocol if available */}
            {protocolData && (
              <ActiveProtocolCard
                protocolData={protocolData}
                startDate={protocolStartDate}
                onStartDateChange={setProtocolStartDate}
                onChangeProtocol={handleChangeProtocol}
              />
            )}
          </div>
        );

      case "protocol":
        return protocolData ? (
          <div className="space-y-6">
            <ActiveProtocolCard
              protocolData={protocolData}
              startDate={protocolStartDate}
              onStartDateChange={setProtocolStartDate}
              onChangeProtocol={handleChangeProtocol}
            />
            <ProtocolCalendarView protocol={protocolData.id} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Protocol Selected</h3>
            <p className="text-muted-foreground mb-6">
              Choose a training protocol to get started with your VO₂max
              improvement journey.
            </p>
            <Button
              onClick={handleAddProtocol}
              className="bg-spotify-green hover:bg-spotify-green/90 text-white font-medium rounded-full px-6 py-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Select Protocol
            </Button>
          </div>
        );

      case "weekly":
        return <WeeklyTrackingPanel userId={effectiveUser.id} />;

      case "session":
        return <SessionMetricsLogging userId={effectiveUser.id} />;

      case "biomarkers":
        return <BloodBiomarkerSection userId={effectiveUser.id} />;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-muted-foreground mb-2">
              Loading...
            </h2>
            <p className="text-muted-foreground">
              Checking authentication status
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!effectiveUser) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-muted-foreground mb-2">
              Access Denied
            </h2>
            <p className="text-muted-foreground">
              Please sign in to access your dashboard
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Desktop Layout - Show all content */}
      <div className="hidden md:block">
        {/* Dashboard Header */}
        <DashboardHeader user={effectiveUser} onSignOut={handleSignOut} />
        {/* Dashboard Grid */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:justify-between md:items-start">
            <ProgressStatsGrid progressStats={progressStats} />
            <Button
              onClick={handleAddProtocol}
              className="bg-spotify-green hover:bg-spotify-green/90 text-white font-medium rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 w-full md:w-[300px] md:flex-shrink-0"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Training Protocol
            </Button>
          </div>

          {/* Protocol Card and Calendar Side-by-Side */}
          {protocolData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ActiveProtocolCard
                protocolData={protocolData}
                startDate={protocolStartDate}
                onStartDateChange={setProtocolStartDate}
                onChangeProtocol={handleChangeProtocol}
              />
              <ProtocolCalendarView
                protocolName={protocolData.name || "Training Protocol"}
                protocolDuration={getProtocolDuration(protocolData.name || "")}
                sessionsPerWeek={getProtocolSessionsPerWeek(protocolData.name || "")}
                startDate={protocolStartDate}
              />
            </div>
          )}
        </div>

        {/* Tracking Sections */}
        <div className="mt-12">
          <TrackingSectionsLayout
            userId={effectiveUser.id}
            protocolData={protocolData}
          />
        </div>
      </div>

      {/* Mobile Layout - Tab-based content */}
      <div className="md:hidden pb-20">{renderTabContent()}</div>

      {/* Bottom Navigation - Mobile only */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogTap={handleLogTap}
        onChatTap={handleChatTap}
      />

      {/* Logging Modal */}
      <LoggingModal
        isOpen={isLoggingModalOpen}
        onClose={() => setIsLoggingModalOpen(false)}
        onSelectOption={handleLoggingOptionSelect}
      />

      {/* Chat - Always show on desktop, conditional on mobile */}
      <div className="hidden md:block">
        <FloatingChat />
      </div>

      {/* Mobile chat - show when tapped */}
      {isChatOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Chat Assistant</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="p-2 h-auto"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1">
              <FloatingChat />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
