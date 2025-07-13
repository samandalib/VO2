export interface ProtocolData {
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

export const PROTOCOL_DATA: Record<string, ProtocolData> = {
  bruce: {
    name: "Bruce Protocol",
    modality: "Treadmill",
    designedFor: "Cardiac stress testing and VO₂max testing",
    structure:
      "3-minute stages, increasing both speed and incline at each stage",
    duration: "Typically 8-15 minutes total",
    progression: [
      "Stage 1: 1.7 mph at 10% incline",
      "Stage 2: 2.5 mph at 12% incline",
      "Stage 3: 3.4 mph at 14% incline",
      "Continue with increasing speed and incline each stage",
    ],
    characteristics: [
      "Very steep increases between stages",
      "Can be tough for untrained individuals",
      "VO₂max often reached by Stage 3–5",
      "Step-wise intensity increases every 3 minutes",
    ],
    measurements: [
      "VO₂ (oxygen uptake)",
      "VCO₂ (carbon dioxide production)",
      "Respiratory Exchange Ratio (RER)",
      "Heart Rate (HR)",
      "Ventilation rate (VE)",
    ],
    pros: [
      "Well-established and standardized protocol",
      "Widely used in clinical settings",
      "Good for cardiac stress testing",
      "Proven reliability and validity",
    ],
    cons: [
      "Very steep increases can be challenging",
      "May be too difficult for deconditioned individuals",
      "Large jumps in intensity between stages",
      "Not easily customizable to individual fitness",
    ],
    isCommonInClinical: true,
    specialNote: "Most commonly used CPET protocol in clinical cardiac testing",
  },

  balke: {
    name: "Balke Protocol",
    modality: "Treadmill",
    designedFor: "General population, including older adults",
    structure:
      "Constant speed (usually 3.3 or 3.4 mph); only incline increases",
    duration: "Longer test duration due to gentler progression",
    progression: [
      "Start at 0% incline at constant speed",
      "Increase incline by 1% every minute",
      "Maintain steady walking pace throughout",
      "Continue until voluntary exhaustion",
    ],
    characteristics: [
      "Gentler progression compared to Bruce",
      "More stages, longer test duration",
      "Suitable for less fit or clinical populations",
      "Gradual intensity increases",
    ],
    measurements: [
      "VO₂ (oxygen uptake)",
      "VCO₂ (carbon dioxide production)",
      "Respiratory Exchange Ratio (RER)",
      "Heart Rate (HR)",
      "Ventilation rate (VE)",
    ],
    pros: [
      "More comfortable for older adults",
      "Gentler progression reduces risk",
      "Better tolerated by deconditioned individuals",
      "More predictable intensity increases",
    ],
    cons: [
      "Longer test duration",
      "May not reach true VO₂max in fit individuals",
      "Walking gait may limit some participants",
      "Less commonly used than Bruce protocol",
    ],
    isGoodForEstimating: true,
    specialNote:
      "Preferred protocol when maximal effort may be difficult to achieve",
  },

  ramp: {
    name: "Ramp Protocol",
    modality: "Treadmill or cycle ergometer",
    designedFor: "Precision, individualization, research settings",
    structure: "Continuous increase in intensity, not in steps",
    duration: "Typically 8–12 minutes",
    progression: [
      "Increases every few seconds in small increments",
      "Example: 10–30 watts per minute on cycle ergometer",
      "Smooth, linear progression to exhaustion",
      "Customizable increments based on fitness level",
    ],
    characteristics: [
      "Smooth, linear increase in intensity",
      "Better for collecting real-time physiological data",
      "Customizable to individual's fitness level",
      "No sudden jumps in workload",
    ],
    measurements: [
      "VO₂ (oxygen uptake)",
      "VCO₂ (carbon dioxide production)",
      "Respiratory Exchange Ratio (RER)",
      "Heart Rate (HR)",
      "Ventilation rate (VE)",
      "Real-time physiological monitoring",
    ],
    pros: [
      "Highly individualized and precise",
      "Optimal for research and data collection",
      "Smooth progression reduces physiological lag",
      "Better VO₂max determination",
    ],
    cons: [
      "Requires specialized equipment programming",
      "More complex to set up and monitor",
      "Less standardized across facilities",
      "May require fitness pre-assessment",
    ],
    isMostUsedInResearch: true,
    specialNote:
      "Gold standard for research laboratories and elite sports testing",
  },

  astrand: {
    name: "Astrand-Ryhming Test",
    modality: "Stationary bike",
    designedFor: "General screening and fitness assessment",
    structure: "Single-stage submaximal test at constant workload",
    duration: "6 minutes of steady-state exercise",
    progression: [
      "Pedal at constant workload for 6 minutes",
      "Maintain pedal rate of 50 rpm",
      "Target heart rate between 125–170 bpm",
      "Record heart rate during final minutes",
    ],
    characteristics: [
      "Submaximal effort required",
      "Based on heart rate response to known workload",
      "Uses established nomogram for estimation",
      "Single workload throughout test",
    ],
    measurements: [
      "Heart Rate (steady-state)",
      "Workload (watts or kg·m/min)",
      "Age for correction factor",
    ],
    formula:
      "VO₂max estimated via Astrand nomogram or formula adjusted for age",
    pros: [
      "Simple and quick to administer",
      "Good for general fitness screening",
      "Submaximal so safer for general population",
      "Requires minimal equipment",
    ],
    cons: [
      "Assumes linear HR-VO₂ relationship",
      "Less accurate for trained athletes",
      "Less accurate for elderly populations",
      "Single workload may not suit all fitness levels",
    ],
    specialNote: "Best suited for moderately fit, healthy adults aged 20-65",
  },

  ymca: {
    name: "YMCA Cycle Ergometer Test",
    modality: "Stationary bike",
    designedFor: "Workplace and fitness center testing",
    structure: "Multi-stage submaximal test with workload adjustments",
    duration: "12-16 minutes (3-4 stages of 3 minutes each)",
    progression: [
      "Multi-stage test (~3–4 stages, each 3 minutes)",
      "Adjust workload based on initial heart rate response",
      "Progress through increasing workloads",
      "Stop before reaching maximal effort",
    ],
    characteristics: [
      "Individualized workload progression",
      "Based on heart rate response extrapolation",
      "Submaximal effort throughout",
      "Validated protocol for healthy adults",
    ],
    measurements: [
      "Heart Rate at each stage",
      "Workload progression (watts)",
      "HR vs. workload relationship",
    ],
    formula:
      "Plot HR vs. workload → extrapolate to age-predicted max HR → Calculate VO₂max from extrapolated point",
    pros: [
      "Individualized; adapts to participant fitness",
      "Validated for healthy adults",
      "Safer submaximal approach",
      "Good for fitness center settings",
    ],
    cons: [
      "Still based on predicted maximum heart rate",
      "Less valid for those on HR-altering medications",
      "Requires multiple stages and longer time",
      "Estimation errors can compound",
    ],
    specialNote:
      "Widely used in corporate wellness and fitness assessment programs",
  },

  cooper: {
    name: "Cooper 12-Minute Run Test",
    modality: "Outdoor running track (or treadmill)",
    designedFor: "Field testing and large group assessment",
    structure: "Single maximal effort run for time-distance measurement",
    duration: "Exactly 12 minutes",
    progression: [
      "Run as far as possible in 12 minutes",
      "Maintain steady, sustainable pace",
      "Measure total distance covered",
      "Can be done on track, road, or treadmill",
    ],
    characteristics: [
      "Requires maximal effort and motivation",
      "Field-based with minimal equipment needs",
      "Highly dependent on pacing strategy",
      "Environmental factors affect performance",
    ],
    measurements: [
      "Total distance covered in 12 minutes",
      "Heart rate (optional)",
      "Perceived exertion",
    ],
    formula:
      "VO₂max (ml/kg/min) = (Distance in meters – 504.9) / 44.73 OR VO₂max = 22.351 × kilometers – 11.288",
    pros: [
      "Requires no specialized equipment",
      "Excellent for large group testing",
      "Quick and cost-effective",
      "Real-world applicability",
    ],
    cons: [
      "Requires maximal effort and motivation",
      "Highly affected by pacing, motivation, and environment",
      "Weather and surface conditions influence results",
      "Not suitable for all populations",
    ],
    specialNote:
      "Developed for military fitness testing, now widely used in schools and fitness programs",
  },
};
