import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Clock, Users, Calendar } from "lucide-react";
import { ProtocolData } from "@/types/dashboard";
import { getProtocolDetails } from "@/lib/protocol-details";

interface ActiveProtocolCardProps {
  protocolData: ProtocolData;
  startDate?: Date;
  onStartDateChange?: (date: Date) => void;
  onChangeProtocol?: () => void;
}

export function ActiveProtocolCard({
  protocolData,
  startDate = new Date(),
  onStartDateChange,
  onChangeProtocol,
}: ActiveProtocolCardProps) {
  const protocolDetails = getProtocolDetails(protocolData.name);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    onStartDateChange?.(newDate);
  };

  // Debug logging
  console.log("Protocol name:", protocolData.name);
  console.log("Protocol details found:", !!protocolDetails);

  const getIntensityColor = (level: string) => {
    switch (level) {
      case "all-out":
        return "text-destructive bg-destructive/10";
      case "very-hard":
        return "text-warning bg-warning/10";
      case "moderate":
        return "text-accent bg-accent/10";
      case "low":
        return "text-success bg-success/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <Card className="mb-8 spotify-card border-none bg-card/80 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Current Active Training Protocol
        </CardTitle>
        <CardDescription>
          Your personalized training protocol based on assessment results
        </CardDescription>

        {/* Start Date Picker */}
        <div className="mt-4 mb-4">
          <Label
            htmlFor="start-date"
            className="text-sm font-medium text-muted-foreground"
          >
            Protocol Start Date:
          </Label>
          <Input
            id="start-date"
            type="date"
            value={startDate.toISOString().split("T")[0]}
            onChange={handleDateChange}
            className="mt-1"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-primary">
                {protocolData.name}
              </h3>
              {protocolDetails && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(
                    protocolDetails.intensityLevel,
                  )}`}
                >
                  {protocolDetails.intensityLevel
                    .replace("-", " ")
                    .toUpperCase()}
                </span>
              )}
            </div>

            {protocolDetails && (
              <div className="text-sm text-muted-foreground mb-4">
                <span className="font-medium">Reference:</span>{" "}
                {protocolDetails.reference}
              </div>
            )}

            <div className="flex items-center gap-6 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">
                  {protocolDetails?.duration || protocolData.timeToResults}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Sessions/week:</span>
                <span className="font-medium">
                  {protocolDetails?.sessionsPerWeek || "3-5"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Rest:</span>
                <span className="font-medium">
                  {protocolDetails?.restBetweenSessions || "1-2 days"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Expected Gain:</span>
                <p className="font-medium">{protocolData.vo2maxGain}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Description:</span>
                <p className="font-medium">
                  {protocolDetails?.description ||
                    protocolData.protocolDuration}
                </p>
              </div>
            </div>

            {protocolDetails && (
              <div className="mt-4 space-y-4 border-t pt-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-primary">
                    How to Perform:
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {protocolDetails.howToPerform.map((step, index) => (
                      <li key={index} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 text-primary">
                    How to Control Intensity:
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {protocolDetails.howToControlIntensity.map(
                      (instruction, index) => (
                        <li key={index} className="leading-relaxed">
                          • {instruction}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <Button
            className="bg-primary hover:bg-primary/90 mt-5"
            onClick={onChangeProtocol}
          >
            Change Protocol
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
