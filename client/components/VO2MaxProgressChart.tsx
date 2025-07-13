import React from "react";

interface VO2MaxMeasurement {
  date: string;
  vo2max: number;
  sessionType?: string;
  notes?: string;
}

interface VO2MaxProgressChartProps {
  measurements: VO2MaxMeasurement[];
  baselineVO2Max: number;
  className?: string;
}

export function VO2MaxProgressChart({
  measurements,
  baselineVO2Max,
  className = "",
}: VO2MaxProgressChartProps) {
  if (measurements.length < 2) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-muted-foreground">
          <p className="text-sm">Not enough data for progress visualization</p>
          <p className="text-xs mt-2">
            Complete more training sessions to see your progress
          </p>
        </div>
      </div>
    );
  }

  const chartWidth = 400;
  const chartHeight = 200;
  const padding = 40;

  // Calculate chart dimensions
  const dataWidth = chartWidth - padding * 2;
  const dataHeight = chartHeight - padding * 2;

  // Find min and max values for scaling
  const minVO2Max = Math.min(...measurements.map((m) => m.vo2max)) - 2;
  const maxVO2Max = Math.max(...measurements.map((m) => m.vo2max)) + 2;
  const vo2MaxRange = maxVO2Max - minVO2Max;

  // Convert measurements to chart coordinates
  const points = measurements.map((measurement, index) => {
    const x = padding + (index / (measurements.length - 1)) * dataWidth;
    const y =
      padding +
      dataHeight -
      ((measurement.vo2max - minVO2Max) / vo2MaxRange) * dataHeight;
    return { x, y, ...measurement };
  });

  // Create SVG path for the line
  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className={`w-full ${className}`}>
      <svg
        width={chartWidth}
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto"
      >
        {/* Grid lines */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect
          x={padding}
          y={padding}
          width={dataWidth}
          height={dataHeight}
          fill="url(#grid)"
        />

        {/* Baseline reference line */}
        <line
          x1={padding}
          x2={padding + dataWidth}
          y1={
            padding +
            dataHeight -
            ((baselineVO2Max - minVO2Max) / vo2MaxRange) * dataHeight
          }
          y2={
            padding +
            dataHeight -
            ((baselineVO2Max - minVO2Max) / vo2MaxRange) * dataHeight
          }
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity="0.7"
        />

        {/* Progress line */}
        <path
          d={pathData}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="hsl(var(--primary))"
              stroke="hsl(var(--background))"
              strokeWidth="2"
            />
            {/* Tooltip on hover */}
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="transparent"
              className="cursor-pointer hover:fill-primary/10"
            >
              <title>
                {new Date(point.date).toLocaleDateString()}:{" "}
                {point.vo2max.toFixed(1)} ml/kg/min
                {point.notes && ` (${point.notes})`}
              </title>
            </circle>
          </g>
        ))}

        {/* Y-axis labels */}
        <g className="text-xs fill-muted-foreground">
          <text x={padding - 10} y={padding + 5} textAnchor="end">
            {maxVO2Max.toFixed(0)}
          </text>
          <text
            x={padding - 10}
            y={padding + dataHeight / 2 + 5}
            textAnchor="end"
          >
            {((maxVO2Max + minVO2Max) / 2).toFixed(0)}
          </text>
          <text x={padding - 10} y={padding + dataHeight + 5} textAnchor="end">
            {minVO2Max.toFixed(0)}
          </text>
        </g>

        {/* X-axis labels */}
        <g className="text-xs fill-muted-foreground">
          <text x={padding} y={chartHeight - 10} textAnchor="start">
            Start
          </text>
          <text x={padding + dataWidth} y={chartHeight - 10} textAnchor="end">
            Current
          </text>
        </g>

        {/* Axis labels */}
        <text
          x={20}
          y={chartHeight / 2}
          textAnchor="middle"
          transform={`rotate(-90, 20, ${chartHeight / 2})`}
          className="text-xs fill-muted-foreground"
        >
          VO₂Max (ml/kg/min)
        </text>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-primary"></div>
          <span>Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 border-t-2 border-dashed border-muted-foreground"></div>
          <span>Baseline</span>
        </div>
      </div>
    </div>
  );
}
