import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  ArrowRight,
  Calculator,
  Target,
  TrendingDown,
  User,
  Flower2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface CalculatorInputs {
  currentAge: number;
  sex: string;
  currentVO2Max: number;
  targetAge: number;
}

interface FunctionalStatus {
  status: string;
  risk: string;
  color: string;
  icon: any;
}

interface ProjectionResults {
  classification: string;
  percentileClassification: string;
  chartData: any[];
  declineRate: string;
  decades: string;
  projectedVO2Max: string;
  functionalStatus: FunctionalStatus;
}

interface VO2MaxCalculatorSectionProps {
  calculatorInputs: CalculatorInputs;
  setCalculatorInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
  projectionResults: ProjectionResults | null;
  generateProjectionChartData: (
    currentAge: number,
    targetAge: number,
    currentVO2Max: number,
    projectedVO2Max: number,
    sex: string,
  ) => any[];
}

export function VO2MaxCalculatorSection({
  calculatorInputs,
  setCalculatorInputs,
  projectionResults,
  generateProjectionChartData,
}: VO2MaxCalculatorSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 animate-in fade-in duration-700">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
              VO2Max Aging & Longevity Projection
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Discover your projected VO2Max at any target age and understand
              the implications for your long-term health and independence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:flex sm:flex-row sm:items-start sm:justify-center">
            {/* Input Panel */}
            <div className="bg-card rounded-xl p-8 shadow-lg border animate-in fade-in slide-in-from-left-8 duration-700 delay-300">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                Your Information
              </h3>

              <div className="space-y-8">
                {/* Current Age Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Current Age</Label>
                    <span className="text-lg font-bold text-primary">
                      <span className="text-4xl font-bold">
                        {calculatorInputs.currentAge}
                      </span>
                      <span> years</span>
                    </span>
                  </div>
                  <Slider
                    value={[calculatorInputs.currentAge]}
                    onValueChange={(value) =>
                      setCalculatorInputs((prev) => ({
                        ...prev,
                        currentAge: value[0],
                        targetAge: Math.max(value[0] + 1, prev.targetAge), // Ensure target age is always greater
                      }))
                    }
                    max={100}
                    min={18}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>18</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Sex at Birth */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Sex at Birth</Label>
                  <div className="flex gap-4">
                    <label
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 flex-1 ${
                        calculatorInputs.sex === "male"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="sex"
                        value="male"
                        checked={calculatorInputs.sex === "male"}
                        onChange={(e) =>
                          setCalculatorInputs((prev) => ({
                            ...prev,
                            sex: e.target.value,
                          }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          calculatorInputs.sex === "male"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        <User className="w-5 h-5" />
                      </div>
                      <span className="font-medium">Male</span>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 flex-1 ${
                        calculatorInputs.sex === "female"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="sex"
                        value="female"
                        checked={calculatorInputs.sex === "female"}
                        onChange={(e) =>
                          setCalculatorInputs((prev) => ({
                            ...prev,
                            sex: e.target.value,
                          }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          calculatorInputs.sex === "female"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        <Flower2 className="w-5 h-5" />
                      </div>
                      <span className="font-medium">Female</span>
                    </label>
                  </div>
                </div>

                {/* Current VO2Max Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">
                      Current VO2Max
                    </Label>
                    <span className="font-bold text-primary">
                      <span className="text-4xl">
                        {calculatorInputs.currentVO2Max.toFixed(1)}
                      </span>
                      <span className="text-xl"> ml/kg/min</span>
                    </span>
                  </div>
                  <Slider
                    value={[calculatorInputs.currentVO2Max]}
                    onValueChange={(value) =>
                      setCalculatorInputs((prev) => ({
                        ...prev,
                        currentVO2Max: value[0],
                      }))
                    }
                    max={80}
                    min={15}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>15</span>
                    <span>80</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Don't know your VO2Max? Take our assessment to get started!
                  </p>
                </div>

                {/* Target Age Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Target Age</Label>
                    <span className="text-4xl font-bold text-primary">
                      <span>{calculatorInputs.targetAge}</span>
                      <span className="text-xl font-bold"> years</span>
                    </span>
                  </div>
                  <Slider
                    value={[calculatorInputs.targetAge]}
                    onValueChange={(value) =>
                      setCalculatorInputs((prev) => ({
                        ...prev,
                        targetAge: value[0],
                      }))
                    }
                    max={120}
                    min={calculatorInputs.currentAge + 1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{calculatorInputs.currentAge + 1}</span>
                    <span>120</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set your target age for the longevity projection.
                  </p>
                </div>

                <Button
                  onClick={() => {
                    const testingSection =
                      document.getElementById("testing-protocols");
                    if (testingSection) {
                      testingSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Don't Know Your VO2Max? See Testing Protocols
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="bg-card rounded-xl p-8 shadow-lg border animate-in fade-in slide-in-from-right-8 duration-700 delay-500">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <TrendingDown className="w-6 h-6 text-primary" />
                Projection Results
              </h3>

              {projectionResults ? (
                <div className="space-y-6">
                  {/* Projected VO2Max */}
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mt-6">
                    <h4 className="font-semibold mb-2">
                      Projected VO2Max at Age {calculatorInputs.targetAge}
                    </h4>
                    <p className="text-3xl font-bold text-primary">
                      <span>{projectionResults.projectedVO2Max}</span>
                      <span className="text-xl font-bold"> ml/kg/min</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      From current {calculatorInputs.currentVO2Max.toFixed(1)}{" "}
                      ml/kg/min
                    </p>

                    {/* Research Note */}
                    <div className="py-4 bg-emerald-50/10 dark:bg-emerald-950/10 rounded-lg mt-1 mb-0.5">
                      <p className="text-xs text-muted-foreground">
                        <strong>Note:</strong> The 18 ml/kg/min threshold is
                        widely cited as the minimum needed for independent
                        living in older adults (Paterson & Warburton, 2004;
                        Mazzeo et al., 1998; Fleg et al., 2005).
                      </p>
                    </div>
                  </div>

                  {/* Functional Status */}
                  <div
                    className={`p-4 rounded-lg border mt-6 ${
                      projectionResults.functionalStatus.color.includes(
                        "emerald",
                      )
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                        : projectionResults.functionalStatus.color.includes(
                              "yellow",
                            )
                          ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
                          : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                    }`}
                  >
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <projectionResults.functionalStatus.icon
                        className={`w-5 h-5 ${projectionResults.functionalStatus.color}`}
                      />
                      Functional Status at {calculatorInputs.targetAge}:{" "}
                      {projectionResults.functionalStatus.status}
                    </h4>
                    <p
                      className={`text-sm ${projectionResults.functionalStatus.color}`}
                    >
                      {projectionResults.functionalStatus.risk}
                    </p>
                  </div>

                  {/* Current Classification */}
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mt-6">
                    <h4 className="font-semibold mb-2">
                      Current Fitness Classification
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          projectionResults.classification === "Elite"
                            ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
                            : projectionResults.classification ===
                                "Highly Active"
                              ? "bg-primary/10 text-primary"
                              : projectionResults.classification ===
                                  "Moderately Active"
                                ? "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300"
                                : "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {projectionResults.classification}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                        {projectionResults.percentileClassification}
                      </span>
                    </div>

                    {/* VO2Max Projection Timeline Chart */}
                    <div className="mb-3">
                      <div
                        className="rounded-lg border border-border p-4 relative overflow-hidden bg-card"
                        style={{
                          height: "240px",
                        }}
                      >
                        {(() => {
                          const projectionData = generateProjectionChartData(
                            calculatorInputs.currentAge,
                            calculatorInputs.targetAge,
                            calculatorInputs.currentVO2Max,
                            parseFloat(projectionResults.projectedVO2Max),
                            calculatorInputs.sex,
                          );

                          // Chart dimensions (match the actual SVG size)
                          const chartHeight = 132;
                          const chartWidth = 349;
                          const padding = {
                            left: 40,
                            right: 40,
                            top: 60,
                            bottom: 60,
                          };

                          // Dynamic VO2Max scale based on user values
                          const minVO2 = 15;
                          const userMaxVO2 = Math.max(
                            calculatorInputs.currentVO2Max,
                            parseFloat(projectionResults.projectedVO2Max),
                          );
                          const maxVO2 = userMaxVO2 > 60 ? 70 : 60;
                          const scale = (value: number) =>
                            ((value - minVO2) / (maxVO2 - minVO2)) *
                            chartHeight;

                          // Age scale
                          const ageSpan =
                            calculatorInputs.targetAge -
                            calculatorInputs.currentAge;
                          const ageScale = (age: number) =>
                            ((age - calculatorInputs.currentAge) / ageSpan) *
                            chartWidth;

                          return (
                            <>
                              {/* Grid lines */}
                              {(() => {
                                const gridValues = [];
                                for (let i = 20; i <= maxVO2; i += 10) {
                                  gridValues.push(i);
                                }
                                return gridValues;
                              })().map((value) => (
                                <div
                                  key={value}
                                  className="absolute border-t border-border"
                                  style={{
                                    left: `${padding.left + 10}px`,
                                    right: `${padding.right}px`,
                                    bottom: `${padding.bottom + scale(value)}px`,
                                  }}
                                >
                                  <span className="absolute -left-10 -top-2 text-xs text-muted-foreground font-medium">
                                    {value}
                                  </span>
                                </div>
                              ))}

                              {/* Activity level bands for each time point */}
                              <div
                                className="absolute"
                                style={{
                                  left: `${padding.left + 34}px`,
                                  right: `${padding.right}px`,
                                  bottom: `${padding.bottom}px`,
                                  height: `${chartHeight}px`,
                                }}
                              >
                                {projectionData.map((point, index) => {
                                  const x = ageScale(point.age);
                                  const barWidth = Math.max(
                                    (chartWidth / projectionData.length) * 0.8,
                                    20,
                                  );

                                  return (
                                    <div
                                      key={point.age}
                                      className="absolute flex flex-col items-center"
                                      style={{
                                        left: `${x - barWidth / 2}px`,
                                        bottom: "0px",
                                        width: `${barWidth}px`,
                                        height: `${chartHeight}px`,
                                      }}
                                    >
                                      {/* Sedentary band (bottom) */}
                                      <div
                                        className="absolute bottom-0 bg-destructive/20 border-r border-border/50"
                                        style={{
                                          width: `${barWidth}px`,
                                          height: `${scale(point.norms.average)}px`,
                                        }}
                                      />

                                      {/* Moderately Active band */}
                                      <div
                                        className="absolute bg-yellow-500/20 dark:bg-yellow-400/20 border-r border-border/50"
                                        style={{
                                          width: `${barWidth}px`,
                                          bottom: `${scale(point.norms.average)}px`,
                                          height: `${scale(point.norms.aboveAverage) - scale(point.norms.average)}px`,
                                        }}
                                      />

                                      {/* Highly Active band */}
                                      <div
                                        className="absolute bg-primary/20 border-r border-border/50"
                                        style={{
                                          width: `${barWidth}px`,
                                          bottom: `${scale(point.norms.aboveAverage)}px`,
                                          height: `${scale(point.norms.high) - scale(point.norms.aboveAverage)}px`,
                                        }}
                                      />

                                      {/* Elite band (top) */}
                                      <div
                                        className="absolute bg-primary/30 border-r border-border/50"
                                        style={{
                                          width: `${barWidth}px`,
                                          bottom: `${scale(point.norms.high)}px`,
                                          height: `${scale(point.norms.elite) - scale(point.norms.high)}px`,
                                        }}
                                      />

                                      {/* Age label */}
                                      <div
                                        className="absolute -bottom-8 text-xs text-muted-foreground font-medium whitespace-nowrap text-center"
                                        style={{
                                          left: "50%",
                                          transform: "translateX(-50%)",
                                        }}
                                      >
                                        {point.label}
                                      </div>
                                    </div>
                                  );
                                })}

                                {/* Decline line */}
                                <svg
                                  className="absolute pointer-events-none"
                                  style={{
                                    left: "-2px",
                                    right: `${padding.right}px`,
                                    bottom: `${padding.bottom + 20}px`,
                                    top: "-1px",
                                    width: "367px",
                                    height: "200px",
                                  }}
                                >
                                  <polyline
                                    points={projectionData
                                      .map((point, index) => {
                                        const x = ageScale(point.age);
                                        const y =
                                          chartHeight - scale(point.userVO2Max);
                                        return `${x},${y}`;
                                      })
                                      .join(" ")}
                                    fill="none"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="3"
                                    strokeDasharray="none"
                                  />

                                  {/* Data points */}
                                  {projectionData.map((point, index) => {
                                    const x = ageScale(point.age);
                                    const y =
                                      chartHeight - scale(point.userVO2Max);
                                    return (
                                      <circle
                                        key={point.age}
                                        cx={x}
                                        cy={y}
                                        r="4"
                                        fill="hsl(var(--primary))"
                                        stroke="hsl(var(--background))"
                                        strokeWidth="2"
                                      />
                                    );
                                  })}

                                  {/* Value labels at line endpoints */}
                                  {projectionData.length > 0 && (
                                    <>
                                      {/* Current VO2Max label (start of line) */}
                                      <text
                                        x={Math.max(
                                          ageScale(projectionData[0].age),
                                          25,
                                        )}
                                        y={
                                          chartHeight -
                                          scale(projectionData[0].userVO2Max) -
                                          25
                                        }
                                        textAnchor="middle"
                                        className="text-xs font-semibold fill-primary"
                                      >
                                        {projectionData[0].userVO2Max.toFixed(
                                          1,
                                        )}
                                      </text>
                                      <text
                                        x={Math.max(
                                          ageScale(projectionData[0].age),
                                          25,
                                        )}
                                        y={
                                          chartHeight -
                                          scale(projectionData[0].userVO2Max) -
                                          12
                                        }
                                        textAnchor="middle"
                                        className="text-xs fill-muted-foreground"
                                      >
                                        Current
                                      </text>

                                      {/* Projected VO2Max label (end of line) */}
                                      <text
                                        x={ageScale(
                                          projectionData[
                                            projectionData.length - 1
                                          ].age,
                                        )}
                                        y={
                                          chartHeight -
                                          scale(
                                            projectionData[
                                              projectionData.length - 1
                                            ].userVO2Max,
                                          ) -
                                          25
                                        }
                                        textAnchor="middle"
                                        className="text-xs font-semibold fill-primary"
                                      >
                                        {projectionData[
                                          projectionData.length - 1
                                        ].userVO2Max.toFixed(1)}
                                      </text>
                                      <text
                                        x={ageScale(
                                          projectionData[
                                            projectionData.length - 1
                                          ].age,
                                        )}
                                        y={
                                          chartHeight -
                                          scale(
                                            projectionData[
                                              projectionData.length - 1
                                            ].userVO2Max,
                                          ) -
                                          12
                                        }
                                        textAnchor="middle"
                                        className="text-xs fill-muted-foreground"
                                      >
                                        Projected
                                      </text>
                                    </>
                                  )}
                                </svg>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      {/* Chart Legend */}
                      <div className="mt-3 px-2">
                        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-2 bg-destructive/20 rounded-sm"></div>
                            <span>Sedentary</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-2 bg-yellow-500/20 dark:bg-yellow-400/20 rounded-sm"></div>
                            <span>Moderate</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-2 bg-primary/20 rounded-sm"></div>
                            <span>Active</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-2 bg-primary/30 rounded-sm"></div>
                            <span>Elite</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <h4 className="font-semibold mb-2">
                      Your Decline Rate: {projectionResults.declineRate}% per
                      decade
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Based on your current fitness classification. The fitter
                      you are now, the slower your decline rate. Regular
                      exercise can help maintain a lower decline rate.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Select your sex to see your personalized projection results.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
