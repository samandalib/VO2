// Dashboard components barrel export
export { DashboardLayout } from "./DashboardLayout";
export { DashboardHeader } from "./DashboardHeader";
export { ActiveProtocolCard } from "./ActiveProtocolCard";
export { ProgressStatsGrid } from "./ProgressStatsGrid";
export { ProgressChartSection } from "./ProgressChartSection";
export { TrackingSectionsLayout } from "./TrackingSectionsLayout";
export { WeeklyTrackingPanel } from "./WeeklyTrackingPanel";
export { SessionMetricsLogging } from "./SessionMetricsLogging";
export { BloodBiomarkerSection } from "./BloodBiomarkerSection";
export { ProtocolCalendarView } from "./ProtocolCalendarView";
export { WeeklyLogPanel } from "./WeeklyLogPanel";

// Utilities
export {
  getProtocolDuration,
  getProtocolSessionsPerWeek,
} from "./DashboardProtocolUtils";
export { getProtocolDetails } from "../../lib/protocol-details";
