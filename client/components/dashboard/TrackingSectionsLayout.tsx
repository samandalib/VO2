import React from "react";
import { WeeklyTrackingPanel } from "./WeeklyTrackingPanel";
import { SessionMetricsLogging } from "./SessionMetricsLogging";
import { BloodBiomarkerSection } from "./BloodBiomarkerSection";

interface ProtocolData {
  name?: string;
}

interface TrackingSectionsLayoutProps {
  userId: string;
  protocolData: ProtocolData | null;
}

export function TrackingSectionsLayout({
  userId,
  protocolData,
}: TrackingSectionsLayoutProps) {
  return (
    <div className="space-y-10">
      {/* Logging Components Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 flex-col md:flex-row">
        {/* Weekly Tracking Panel */}
        <div className="spotify-glass rounded-2xl p-1 shadow-2xl">
          <WeeklyTrackingPanel userId={userId} />
        </div>

        {/* Session Metrics Logging */}
        <div className="spotify-glass rounded-2xl p-1 shadow-2xl">
          <SessionMetricsLogging userId={userId} />
        </div>
      </div>

      {/* Blood Biomarker Section */}
      <div className="spotify-glass rounded-2xl p-1 shadow-2xl">
        <BloodBiomarkerSection userId={userId} />
      </div>
    </div>
  );
}
