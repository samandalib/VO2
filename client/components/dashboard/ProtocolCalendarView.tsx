import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Activity, Heart, Droplets, Target, Zap } from "lucide-react";

interface DailyActivity {
  day: string;
  date: string;
  activities: {
    type: "training" | "recovery" | "rest" | "assessment" | "logging";
    description: string;
    icon: string;
    priority: "high" | "medium" | "low";
  }[];
}

interface WeekSchedule {
  week: number;
  title: string;
  dateRange: string;
  phase: "baseline" | "training" | "midpoint" | "final" | "recovery";
  days: DailyActivity[];
}

interface ProtocolCalendarViewProps {
  protocolName?: string;
  protocolDuration?: number; // weeks
  sessionsPerWeek?: number;
  startDate?: Date;
}

// Generate daily activities for the protocol
const generateWeekSchedule = (
  week: number,
  duration: number,
  sessionsPerWeek: number,
  startDate: Date,
): WeekSchedule => {
  const weekStartDate = new Date(startDate);
  weekStartDate.setDate(startDate.getDate() + (week - 1) * 7);

  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekStartDate.getDate() + 6);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const dateRange = `${formatDate(weekStartDate)} - ${formatDate(weekEndDate)}`;

  // Determine week phase
  let phase: WeekSchedule["phase"] = "training";
  const midWeek = Math.ceil(duration / 2);

  if (week === 1) phase = "baseline";
  else if (week === midWeek && duration >= 6) phase = "midpoint";
  else if (week === duration) phase = "final";
  else if (week > duration) phase = "recovery";

  const days: DailyActivity[] = [];
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const currentDate = new Date(weekStartDate);
    currentDate.setDate(weekStartDate.getDate() + dayIndex);

    const dayName = dayNames[dayIndex];
    const dateStr = formatDate(currentDate);

    const activities: DailyActivity["activities"] = [];

    // Generate activities based on week phase and day
    if (phase === "baseline" && week === 1) {
      if (dayIndex === 0) {
        // Monday
        activities.push({
          type: "assessment",
          description: "Baseline VO₂max & RHR measurement",
          icon: "📊",
          priority: "high",
        });
        activities.push({
          type: "logging",
          description: "Log baseline biomarkers",
          icon: "🩸",
          priority: "high",
        });
      } else if (dayIndex === 2) {
        // Wednesday
        activities.push({
          type: "training",
          description: "First training session (light intensity)",
          icon: "🏃",
          priority: "high",
        });
      } else if (dayIndex === 5) {
        // Saturday
        activities.push({
          type: "training",
          description: "Second training session",
          icon: "🏃",
          priority: "medium",
        });
      }
    } else if (phase === "midpoint") {
      if (dayIndex === 0) {
        // Monday
        activities.push({
          type: "assessment",
          description: "Midpoint VO₂max & RHR check",
          icon: "📊",
          priority: "high",
        });
        activities.push({
          type: "logging",
          description: "Optional blood biomarkers",
          icon: "🩸",
          priority: "medium",
        });
      } else if (dayIndex === 3) {
        // Thursday
        activities.push({
          type: "training",
          description: "Light training session",
          icon: "🏃",
          priority: "medium",
        });
      }
    } else if (phase === "final") {
      if (dayIndex === 0) {
        // Monday
        activities.push({
          type: "assessment",
          description: "Final VO₂max & RHR assessment",
          icon: "📊",
          priority: "high",
        });
      } else if (dayIndex === 2) {
        // Wednesday
        activities.push({
          type: "logging",
          description: "Complete final biomarkers",
          icon: "🩸",
          priority: "high",
        });
      } else if (dayIndex === 4) {
        // Friday
        activities.push({
          type: "training",
          description: "Final training session",
          icon: "🏃",
          priority: "medium",
        });
      }
    } else if (phase === "recovery") {
      if (dayIndex === 1) {
        // Tuesday
        activities.push({
          type: "recovery",
          description: "Light recovery session",
          icon: "🚶",
          priority: "low",
        });
      } else if (dayIndex === 5) {
        // Saturday
        activities.push({
          type: "recovery",
          description: "Optional recovery activity",
          icon: "🚶",
          priority: "low",
        });
      }
    } else {
      // Regular training weeks
      const trainingDays =
        sessionsPerWeek === 3
          ? [1, 3, 5]
          : sessionsPerWeek === 4
            ? [1, 2, 4, 5]
            : [0, 2, 4];

      if (trainingDays.includes(dayIndex)) {
        const intensity =
          week <= 2 ? "moderate" : week >= duration - 1 ? "high" : "moderate";
        activities.push({
          type: "training",
          description: `Training session (${intensity} intensity)`,
          icon: "🏃",
          priority: "high",
        });
        activities.push({
          type: "logging",
          description: "Log HR metrics after session",
          icon: "❤️",
          priority: "medium",
        });
      } else if (dayIndex === 6) {
        // Sunday - rest day
        activities.push({
          type: "rest",
          description: "Rest day - full recovery",
          icon: "😴",
          priority: "low",
        });
      }

      // Weekly logging on Mondays
      if (dayIndex === 0) {
        activities.push({
          type: "logging",
          description: "Weekly VO₂max & RHR logging",
          icon: "📝",
          priority: "medium",
        });
      }
    }

    // Add rest day if no activities
    if (activities.length === 0) {
      activities.push({
        type: "rest",
        description: "Rest day",
        icon: "😴",
        priority: "low",
      });
    }

    days.push({
      day: dayName,
      date: dateStr,
      activities,
    });
  }

  return {
    week,
    title: `Week ${week}`,
    dateRange,
    phase,
    days,
  };
};

const generateProtocolSchedule = (
  duration: number,
  sessionsPerWeek: number,
  startDate: Date,
): WeekSchedule[] => {
  const schedule: WeekSchedule[] = [];

  // Generate exact number of weeks as specified in duration
  for (let week = 1; week <= duration; week++) {
    schedule.push(
      generateWeekSchedule(week, duration, sessionsPerWeek, startDate),
    );
  }

  return schedule;
};

export function ProtocolCalendarView({
  protocolName = "Training Protocol",
  protocolDuration = 8,
  sessionsPerWeek = 3,
  startDate = new Date(),
}: ProtocolCalendarViewProps) {
  const protocolSchedule = useMemo(
    () =>
      generateProtocolSchedule(protocolDuration, sessionsPerWeek, startDate),
    [protocolDuration, sessionsPerWeek, startDate],
  );

  const getPhaseColor = (phase: WeekSchedule["phase"]) => {
    // Single blue theme for all phases
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  // Mock logging data for demonstration
  const isDev = process.env.NODE_ENV === "development";

  const getWeekLoggingStatus = (week: number) => {
    if (!isDev) {
      // In production, return empty (no mock data)
      return { completed: [], missing: [] };
    }
    const mockData = {
      1: {
        completed: ["Baseline VO₂max measurement", "Baseline biomarkers"],
        missing: ["First training session HR log"],
      },
      2: {
        completed: ["Training session HR logs (2/3)", "Weekly VO₂max log"],
        missing: ["1 training session HR log"],
      },
      3: {
        completed: ["All training session HR logs", "Weekly RHR log"],
        missing: [],
      },
      4: {
        completed: ["Training session HR logs (1/3)"],
        missing: ["Weekly VO₂max log", "2 training session HR logs"],
      },
    };

    return (
      mockData[week as keyof typeof mockData] || {
        completed: [],
        missing: [],
      }
    );
  };

  // Mock logged data for specific dates - dynamic based on week and day
  const getDateLoggedData = (date: string, week: number, dayName: string) => {
    if (!isDev) {
      // In production, return empty (no mock data)
      return [];
    }
    const logs: {
      metric: string;
      value: string;
      status: "completed" | "pending";
    }[] = [];

    // Generate mock data based on week and day patterns
    if (week === 1) {
      if (dayName === "Monday") {
        logs.push(
          { metric: "VO₂max", value: "45.2 ml/kg/min", status: "completed" },
          { metric: "RHR", value: "62 bpm", status: "completed" },
          {
            metric: "Blood biomarkers",
            value: "Lab results pending",
            status: "pending",
          },
        );
      } else if (dayName === "Wednesday") {
        logs.push({
          metric: "Session HR",
          value: "Not logged",
          status: "pending",
        });
      } else if (dayName === "Saturday") {
        logs.push(
          { metric: "Session HR", value: "155 avg bpm", status: "completed" },
          { metric: "RPE", value: "7/10", status: "completed" },
        );
      }
    } else if (week === 2) {
      if (dayName === "Monday") {
        logs.push(
          {
            metric: "Weekly VO₂max",
            value: "45.8 ml/kg/min",
            status: "completed",
          },
          { metric: "Weekly RHR", value: "60 bpm", status: "completed" },
        );
      } else if (dayName === "Wednesday") {
        logs.push(
          { metric: "Session HR", value: "162 avg bpm", status: "completed" },
          { metric: "RPE", value: "8/10", status: "completed" },
        );
      } else if (dayName === "Saturday") {
        logs.push({
          metric: "Session HR",
          value: "Not logged",
          status: "pending",
        });
      }
    } else if (week === 3) {
      if (dayName === "Monday") {
        logs.push({
          metric: "Weekly RHR",
          value: "59 bpm",
          status: "completed",
        });
      } else if (dayName === "Wednesday") {
        logs.push(
          { metric: "Session HR", value: "158 avg bpm", status: "completed" },
          { metric: "RPE", value: "6/10", status: "completed" },
        );
      } else if (dayName === "Saturday") {
        logs.push(
          { metric: "Session HR", value: "165 avg bpm", status: "completed" },
          { metric: "RPE", value: "8/10", status: "completed" },
        );
      }
    } else if (week >= 4) {
      // For later weeks, randomly show some data
      if (dayName === "Monday") {
        logs.push({
          metric: "Weekly RHR",
          value: `${58 + week} bpm`,
          status: "completed",
        });
      } else if (dayName === "Wednesday" || dayName === "Friday") {
        const completed = Math.random() > 0.3; // 70% chance of being completed
        logs.push({
          metric: "Session HR",
          value: completed
            ? `${150 + Math.floor(Math.random() * 20)} avg bpm`
            : "Not logged",
          status: completed ? "completed" : "pending",
        });
        if (completed) {
          logs.push({
            metric: "RPE",
            value: `${Math.floor(Math.random() * 4) + 6}/10`,
            status: "completed",
          });
        }
      }
    }

    return logs;
  };

  const WeekCard = ({ weekSchedule }: { weekSchedule: WeekSchedule }) => {
    const loggingStatus = getWeekLoggingStatus(weekSchedule.week);

    // Only show days that have activities other than rest
    const activeDays = weekSchedule.days.filter((day) =>
      day.activities.some((activity) => activity.type !== "rest"),
    );

    return (
      <Card className="h-full spotify-card border-none bg-card/80 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{weekSchedule.title}</CardTitle>
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20"
            >
              {weekSchedule.phase}
            </Badge>
          </div>
          <CardDescription className="text-sm">
            {weekSchedule.dateRange}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Active Days Only */}
          <div className="space-y-2">
            {activeDays.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="border-l-2 border-primary/20 pl-3 py-1"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {day.day}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {day.date}
                  </span>
                </div>
                <div className="space-y-1">
                  {day.activities
                    .filter((activity) => activity.type !== "rest")
                    .map((activity, actIndex) => (
                      <div
                        key={actIndex}
                        className="text-xs p-2 rounded bg-primary/10 text-primary border border-primary/20"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <span>{activity.icon}</span>
                          <span>{activity.description}</span>
                        </div>
                      </div>
                    ))}

                  {/* Logged Data for this date */}
                  {(() => {
                    const loggedData = getDateLoggedData(
                      day.date,
                      weekSchedule.week,
                      day.day,
                    );
                    if (loggedData.length > 0) {
                      return (
                        <div className="mt-2 pl-2 border-l border-border">
                          <div className="text-xs font-medium text-muted-foreground mb-1">
                            📊 Logged Data:
                          </div>
                          <div className="space-y-1">
                            {loggedData.map((log, logIndex) => (
                              <div
                                key={logIndex}
                                className={`text-xs p-1.5 rounded flex items-center justify-between ${
                                  log.status === "completed"
                                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                    : "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
                                }`}
                              >
                                <span className="font-medium">
                                  {log.metric}:
                                </span>
                                <span
                                  className={
                                    log.status === "pending" ? "italic" : ""
                                  }
                                >
                                  {log.value}
                                </span>
                                <span className="text-xs">
                                  {log.status === "completed" ? "✓" : "⏳"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            ))}
          </div>

          {/* Logging Status */}
          <div className="border-t border-border pt-3 mt-4">
            <h5 className="text-xs font-medium text-foreground mb-2">
              Week Status
            </h5>

            {loggingStatus.completed.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-1">
                  ✓ Completed:
                </p>
                <ul className="text-xs text-emerald-600 dark:text-emerald-400 space-y-0.5">
                  {loggingStatus.completed.map((item, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {loggingStatus.missing.length > 0 && (
              <div>
                <p className="text-xs text-orange-700 dark:text-orange-300 mb-1">
                  ⚠ Missing:
                </p>
                <ul className="text-xs text-orange-600 dark:text-orange-400 space-y-0.5">
                  {loggingStatus.missing.map((item, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {loggingStatus.completed.length === 0 &&
              loggingStatus.missing.length === 0 && (
                <p className="text-xs text-primary">
                  No tracking required this week
                </p>
              )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="spotify-card border-none bg-card/80 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Weekly Schedule
        </CardTitle>
        <CardDescription>
          {protocolName} - Week by week schedule
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Horizontal Scrolling Week Cards */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
          {protocolSchedule.map((weekSchedule) => (
            <div
              key={weekSchedule.week}
              className="flex-shrink-0 w-72 md:w-80 snap-start"
            >
              <WeekCard weekSchedule={weekSchedule} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
