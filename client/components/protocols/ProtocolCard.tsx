import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { ProtocolData, ProtocolRanking } from "@/lib/protocols/types";

interface ProtocolCardProps {
  protocol: ProtocolData;
  ranking: ProtocolRanking;
  isRecommended: boolean;
  animationDelay?: number;
  onSelect: (protocolId: string) => void;
}

export function ProtocolCard({
  protocol,
  ranking,
  isRecommended,
  animationDelay = 0,
  onSelect,
}: ProtocolCardProps) {
  return (
    <div
      className={`bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8 duration-700 ${
        isRecommended
          ? "border-success bg-success/10 ring-2 ring-success/20"
          : "border-border"
      }`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {isRecommended && (
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            Recommended for You
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="text-center">
          <div className="flex flex-row gap-2">
            <h4
              className={`text-2xl font-bold mb-4 text-left sm:text-center ${
                isRecommended ? "text-green-700" : "text-primary"
              }`}
            >
              {protocol.name}
            </h4>
            <Button
              asChild
              className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
              variant="outline"
              size="sm"
            >
              <a
                href={protocol.doi}
                target="_blank"
                rel="noopener noreferrer"
                title="View Research Reference"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>

          {ranking.reasons.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap justify-start items-start gap-2">
                {ranking.reasons.slice(0, 2).map((reason, idx) => (
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

        <ProtocolInfo protocol={protocol} />
        <ProtocolFooter
          protocol={protocol}
          onSelect={onSelect}
          isRecommended={isRecommended}
        />
      </div>
    </div>
  );
}

interface ProtocolInfoProps {
  protocol: ProtocolData;
}

function ProtocolInfo({ protocol }: ProtocolInfoProps) {
  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-2 sm:gap-6">
        <InfoItem label="VO2max Gain" value={protocol.vo2maxGain} highlight />
        <InfoItem label="Time to Results" value={protocol.timeToResults} />
        <InfoItem label="Fitness Level" value={protocol.fitnessLevel} />
        <InfoItem
          label="Protocol Duration"
          value={protocol.protocolDuration}
          bold
        />
        <InfoItem label="Sport Modality" value={protocol.sportModality} />
        <InfoItem
          label="Research Population"
          value={protocol.researchPopulation}
        />
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  highlight?: boolean;
  bold?: boolean;
}

function InfoItem({ label, value, highlight, bold }: InfoItemProps) {
  return (
    <div>
      <span className="text-sm text-muted-foreground">{label}</span>
      <p
        className={`text-lg ${
          highlight
            ? "font-bold text-green-600"
            : bold
              ? "font-bold"
              : "font-semibold"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

interface ProtocolFooterProps {
  protocol: ProtocolData;
  onSelect: (protocolId: string) => void;
  isRecommended: boolean;
}

function ProtocolFooter({
  protocol,
  onSelect,
  isRecommended,
}: ProtocolFooterProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-border/50">
      <ResearchInfo protocol={protocol} />
      <SelectButton
        protocolId={protocol.id}
        onSelect={onSelect}
        isRecommended={isRecommended}
      />
    </div>
  );
}

interface ResearchInfoProps {
  protocol: ProtocolData;
}

function ResearchInfo({ protocol }: ResearchInfoProps) {
  const { researchers, institution, location, year } = protocol;

  return (
    <div className="flex flex-col sm:flex-row justify-start items-start gap-9">
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-start sm:items-center sm:gap-9">
        <ResearchItem icon="👤" text={researchers} />
        <ResearchItem icon="🏢" text={institution} />
        <ResearchItem icon="📍" text={`${location} • ${year}`} />
      </div>
    </div>
  );
}

interface ResearchItemProps {
  icon: string;
  text: string;
}

function ResearchItem({ icon, text }: ResearchItemProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

interface SelectButtonProps {
  protocolId: string;
  onSelect: (protocolId: string) => void;
  isRecommended: boolean;
}

function SelectButton({
  protocolId,
  onSelect,
  isRecommended,
}: SelectButtonProps) {
  return (
    <Button
      className={`w-full ${
        isRecommended
          ? "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
          : "bg-primary hover:bg-primary/90 text-primary-foreground"
      } transition-all duration-300`}
      onClick={() => onSelect(protocolId)}
    >
      Plan with this protocol
    </Button>
  );
}
