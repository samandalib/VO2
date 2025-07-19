import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProtocolTooltip } from "@/components/ui/ProtocolTooltip";
import { ProtocolDetailModal } from "@/components/ui/ProtocolDetailModal";
import { PROTOCOL_DATA, ProtocolData } from "@/constants/protocolData";
import {
  ArrowRight,
  Zap,
  Timer,
  Activity,
  Target,
  Users,
  Trophy,
  ExternalLink,
} from "lucide-react";

interface TestingProtocolsSectionProps {
  onStartAssessment: () => void;
}

export function TestingProtocolsSection({
  onStartAssessment,
}: TestingProtocolsSectionProps) {
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolData | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProtocolClick = (protocolKey: string) => {
    const protocol = PROTOCOL_DATA[protocolKey];
    if (protocol) {
      setSelectedProtocol(protocol);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProtocol(null);
  };

  return (
    <>
      <ProtocolDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        protocol={selectedProtocol!}
      />
      <section
        id="testing-protocols"
        className="py-20 bg-gradient-to-br from-background to-secondary/10"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                Professional VO2Max Testing Protocols
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                Understanding the science behind VO2Max measurement helps you
                make informed decisions about your fitness testing and training
                approach.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Bruce Protocol */}
              <div
                className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 cursor-pointer"
                onClick={() => handleProtocolClick("bruce")}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      Bruce Protocol
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <ProtocolTooltip term="CPET">
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                          CPET
                        </span>
                      </ProtocolTooltip>
                      <ProtocolTooltip term="DIRECT">
                        <span className="text-xs bg-destructive/5 text-destructive px-2 py-1 rounded-full border border-destructive/20">
                          Direct VO₂
                        </span>
                      </ProtocolTooltip>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Modality:
                    </span>
                    <p className="text-sm">Treadmill</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Ideal For:
                    </span>
                    <p className="text-sm">General populations, clinics</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      How It Works:
                    </span>
                    <p className="text-sm">
                      Treadmill test with 3-min stages increasing in speed and
                      incline until exhaustion.
                    </p>
                  </div>
                </div>
              </div>

              {/* Balke Protocol */}
              <div
                className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 cursor-pointer"
                onClick={() => handleProtocolClick("balke")}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <Timer className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      Balke Protocol
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <ProtocolTooltip term="CPET">
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                          CPET
                        </span>
                      </ProtocolTooltip>
                      <ProtocolTooltip term="DIRECT">
                        <span className="text-xs bg-success/5 text-success px-2 py-1 rounded-full border border-success/20">
                          Direct VO₂
                        </span>
                      </ProtocolTooltip>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Modality:
                    </span>
                    <p className="text-sm">Treadmill</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Ideal For:
                    </span>
                    <p className="text-sm">Older or deconditioned adults</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      How It Works:
                    </span>
                    <p className="text-sm">
                      Treadmill test with constant speed (3.3 mph), incline
                      increases 1% each minute.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ramp Protocol */}
              <div
                className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 cursor-pointer"
                onClick={() => handleProtocolClick("ramp")}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      Ramp Protocol
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <ProtocolTooltip term="CPET">
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                          CPET
                        </span>
                      </ProtocolTooltip>
                      <ProtocolTooltip term="DIRECT">
                        <span className="text-xs bg-success/5 text-success px-2 py-1 rounded-full border border-success/20">
                          Direct VO₂
                        </span>
                      </ProtocolTooltip>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Modality:
                    </span>
                    <p className="text-sm">Treadmill/Cycle</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Ideal For:
                    </span>
                    <p className="text-sm">Labs, athletes</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      How It Works:
                    </span>
                    <p className="text-sm">
                      Continuous increase in treadmill or cycle workload every
                      10–30 seconds to exhaustion.
                    </p>
                  </div>
                </div>
              </div>

              {/* Astrand-Ryhming */}
              <div
                className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400 cursor-pointer"
                onClick={() => handleProtocolClick("astrand")}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      Astrand-Ryhming
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <ProtocolTooltip term="SUBMAXIMAL">
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                          Submaximal
                        </span>
                      </ProtocolTooltip>
                      <ProtocolTooltip term="ESTIMATED">
                        <span className="text-xs bg-success/5 text-success px-2 py-1 rounded-full border border-success/20">
                          Estimated
                        </span>
                      </ProtocolTooltip>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Modality:
                    </span>
                    <p className="text-sm">Cycle</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Ideal For:
                    </span>
                    <p className="text-sm">General population</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      How It Works:
                    </span>
                    <p className="text-sm">
                      Cycle at constant workload for 6 minutes, use HR and
                      workload to estimate VO₂Max from a chart.
                    </p>
                  </div>
                </div>
              </div>

              {/* YMCA Submaximal */}
              <div
                className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 cursor-pointer"
                onClick={() => handleProtocolClick("ymca")}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      YMCA Submaximal
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <ProtocolTooltip term="SUBMAXIMAL">
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                          Submaximal
                        </span>
                      </ProtocolTooltip>
                      <ProtocolTooltip term="ESTIMATED">
                        <span className="text-xs bg-success/5 text-success px-2 py-1 rounded-full border border-success/20">
                          Estimated
                        </span>
                      </ProtocolTooltip>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Modality:
                    </span>
                    <p className="text-sm">Cycle</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Ideal For:
                    </span>
                    <p className="text-sm">Workplace, fitness centers</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      How It Works:
                    </span>
                    <p className="text-sm">
                      Cycle ergometer with 3+ stages, adjusting workload based
                      on HR response to estimate VO₂Max.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cooper 12-min Run */}
              <div
                className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-600 cursor-pointer"
                onClick={() => handleProtocolClick("cooper")}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      Cooper 12-min Run
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <ProtocolTooltip term="FIELD">
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                          Field
                        </span>
                      </ProtocolTooltip>
                      <ProtocolTooltip term="MAXIMAL">
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                          Maximal
                        </span>
                      </ProtocolTooltip>
                      <ProtocolTooltip term="ESTIMATED">
                        <span className="text-xs bg-success/5 text-success px-2 py-1 rounded-full border border-success/20">
                          Estimated
                        </span>
                      </ProtocolTooltip>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Modality:
                    </span>
                    <p className="text-sm">Running</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Ideal For:
                    </span>
                    <p className="text-sm">Fit individuals, athletes</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      How It Works:
                    </span>
                    <p className="text-sm">
                      Run as far as possible in 12 minutes; distance is plugged
                      into a formula to estimate VO₂Max.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wearable Testing Section */}
            <div className="mt-20">
              <div className="text-center mb-12">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  Wearables Latest Assessments
                </h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                  Accuracy assessments of consumer wearables against
                  gold-standard CPET measurements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Apple Watch Card */}
                <div className="border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-black rounded-sm"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        Apple Watch Series 9 / Ultra 2
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Consumer Wearable Validation
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <a
                        href="https://doi.org/10.1371/journal.pone.0323741"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted"
                        title="View research paper"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Primary Data (*) */}
                    <div className="border-l-4 border-green-600 pl-4 p-3 rounded-r">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-normal text-gray-400">
                            Test Publication Year
                          </span>
                          <p className="text-sm font-semibold">2025</p>
                        </div>
                        <div>
                          <span className="text-sm font-normal text-gray-400">
                            Mean VO₂max Bias
                          </span>
                          <p className="text-sm font-semibold">
                            -6.07 mL/kg/min (Underestimation)
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-normal text-gray-400">
                            Mean Absolute Percentage Error
                          </span>
                          <p className="text-sm font-semibold">13.31%</p>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Data ($) */}
                    <div className="border-l-4 border-blue-500 pl-4 p-3 rounded-r">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-normal text-gray-400">
                            Population Type
                          </span>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "#2151d9" }}
                          >
                            General healthy adults with high CRF
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-normal text-gray-400">
                            Mean Age
                          </span>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "#2151d9" }}
                          >
                            31.86 ± 13.99 years
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-normal text-gray-400">
                            VO₂max Test Type
                          </span>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "#2151d9" }}
                          >
                            Outdoor walking/running for 5–10 days
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-normal text-gray-400">
                            Gold Standard
                          </span>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "#2151d9" }}
                          >
                            Treadmill CPET (COSMED Quark)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">Sample Size:</span>{" "}
                          <span className="font-bold text-foreground">28</span>
                        </div>
                        <div>
                          <span className="font-medium">Sex:</span>{" "}
                          <span className="font-bold text-foreground">
                            50% female
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">BMI:</span>{" "}
                          <span className="font-bold text-foreground">
                            23.76 ± 2.54
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">
                            Mean Absolute Error:
                          </span>{" "}
                          <span className="font-bold text-foreground">
                            6.92
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Location:</span>{" "}
                        <span className="font-bold text-foreground">
                          University College Dublin, Ireland
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Conclusion:</span>{" "}
                        <span className="font-bold text-foreground">
                          Not yet accurate enough for clinical use; aligns with
                          submaximal test error range
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Garmin Card */}
                <div className="border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-sm"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        Garmin fēnix 6
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Athletic Wearable Validation
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <a
                        href="https://doi.org/10.3390/technologies11030071"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted"
                        title="View research paper"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Primary Data (*) */}
                    <div className="border-l-4 border-green-600 pl-4 p-3 rounded-r">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-normal text-gray-400">
                            Test Publication Year
                          </span>
                          <p className="text-sm font-semibold">2023</p>
                        </div>
                        <div>
                          <span className="text-sm font-normal text-gray-400">
                            Mean VO₂max Bias
                          </span>
                          <p className="text-sm font-semibold">
                            -2.65 mL/kg/min (Underestimation)
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-normal text-gray-400">
                            Mean Absolute Percentage Error
                          </span>
                          <p className="text-sm font-semibold">6.85%</p>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Data ($) */}
                    <div className="border-l-4 border-blue-500 pl-4 p-3 rounded-r">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-normal text-gray-400">
                            Population Type
                          </span>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "#2151d9" }}
                          >
                            Athletic individuals (&gt;95th percentile VO₂max)
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-normal text-gray-400">
                            Mean Age
                          </span>
                          <p
                            className="text-sm font-bold"
                            style={{ color: "#2151d9" }}
                          >
                            24.24 ± 6.30 years
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-normal text-gray-400">
                            VO₂max Test Type
                          </span>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "#2151d9" }}
                          >
                            Outdoor run &ge;70% HR, then graded test
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-normal text-gray-400">
                            Gold Standard
                          </span>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "#2151d9" }}
                          >
                            Treadmill CPET (ParvoMedics TrueOne 2400)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">Sample Size:</span>{" "}
                          <span className="font-bold text-foreground">20</span>
                        </div>
                        <div>
                          <span className="font-medium">Sex:</span>{" "}
                          <span className="font-bold text-foreground">
                            11 male, 10 female
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">BMI:</span>{" "}
                          <span className="font-bold text-foreground">
                            22.01 ± 1.91
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">
                            Mean Absolute Error:
                          </span>{" "}
                          <span className="font-bold text-foreground">
                            Not reported
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Location:</span>{" "}
                        <span className="font-bold text-foreground">
                          University of Nevada, Las Vegas, USA
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Conclusion:</span>{" "}
                        <span className="font-bold text-foreground">
                          Valid for VO₂max (1-min avg); suitable for athletic
                          training decisions
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Note about other wearables */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground italic bg-muted/50 rounded-lg p-4 max-w-3xl mx-auto">
                  <strong>Note:</strong> Polar, Fitbit, Whoop, Oura: Lack
                  strong, publicly available CPET-based validation for VO₂max at
                  present.
                </p>
              </div>
            </div>

            <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
              <p className="text-sm text-muted-foreground mb-4">
                Our assessment combines principles from these established
                protocols to provide you with accurate, personalized
                recommendations.
              </p>
              <Button
                onClick={onStartAssessment}
                variant="outline"
                className="group hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Learn More About Your Assessment
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
