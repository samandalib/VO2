import { useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface ProtocolDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  protocol: ProtocolData;
}

interface ProtocolData {
  name: string;
  modality: string;
  designedFor: string;
  structure: string;
  progression: string[];
  characteristics: string[];
  measurements?: string[];
  formula?: string;
  pros: string[];
  cons: string[];
  duration?: string;
  specialNote?: string;
  isCommonInClinical?: boolean;
  isGoodForEstimating?: boolean;
  isMostUsedInResearch?: boolean;
}

export function ProtocolDetailModal({
  isOpen,
  onClose,
  protocol,
}: ProtocolDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {protocol.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {protocol.modality} • {protocol.designedFor}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          <div className="space-y-8">
            {/* Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Protocol Structure
                  </h3>
                  <p className="text-muted-foreground">{protocol.structure}</p>
                </div>

                {protocol.duration && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Duration
                    </h3>
                    <p className="text-muted-foreground">{protocol.duration}</p>
                  </div>
                )}
              </div>

              {/* Progression */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Progression
                </h3>
                <ul className="space-y-2">
                  {protocol.progression.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {step}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Characteristics */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Key Characteristics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {protocol.characteristics.map((characteristic, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                  >
                    <Info className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">
                      {characteristic}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Measurements */}
            {protocol.measurements && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Measurements Taken
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {protocol.measurements.map((measurement, index) => (
                    <div
                      key={index}
                      className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm text-center font-medium"
                    >
                      {measurement}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formula */}
            {protocol.formula && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  VO₂max Calculation Formula
                </h3>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <code className="text-purple-800 dark:text-purple-300 font-mono text-sm">
                    {protocol.formula}
                  </code>
                </div>
              </div>
            )}

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pros */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Advantages
                </h3>
                <ul className="space-y-2">
                  {protocol.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">
                        {pro}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Limitations
                </h3>
                <ul className="space-y-2">
                  {protocol.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">
                        {con}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Special Notes */}
            {(protocol.isCommonInClinical ||
              protocol.isGoodForEstimating ||
              protocol.isMostUsedInResearch ||
              protocol.specialNote) && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Clinical Notes
                </h3>
                <div className="space-y-2">
                  {protocol.isCommonInClinical && (
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-primary text-sm font-medium">
                        ✅ Common in clinical settings
                      </p>
                    </div>
                  )}
                  {protocol.isGoodForEstimating && (
                    <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                      <p className="text-success text-sm font-medium">
                        ✅ Good for estimating VO₂max when maximal effort is
                        difficult
                      </p>
                    </div>
                  )}
                  {protocol.isMostUsedInResearch && (
                    <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                      <p className="text-accent text-sm font-medium">
                        ✅ Most used in research labs and elite sports settings
                      </p>
                    </div>
                  )}
                  {protocol.specialNote && (
                    <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <p className="text-warning text-sm font-medium">
                        {protocol.specialNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
