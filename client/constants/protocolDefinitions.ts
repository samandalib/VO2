/**
 * VO2Max Testing Protocol Definitions
 * Reusable definitions for protocol terminology across the app
 */

export const PROTOCOL_DEFINITIONS = {
  CPET: {
    term: "CPET",
    fullName: "Cardiopulmonary Exercise Testing",
    definition:
      "A lab-based test that measures respiratory gases (O₂ and CO₂) during graded exercise to directly assess cardiovascular, pulmonary, and muscular function. It is the gold standard for measuring VO₂max and determining exercise limitations.",
  },
  MAXIMAL: {
    term: "Maximal",
    definition:
      "An exercise test taken to the point of voluntary exhaustion or reaching predicted maximum effort (e.g., 90–100% of max heart rate). It aims to reveal the subject's full aerobic capacity.",
  },
  FIELD: {
    term: "Field",
    definition:
      "A test conducted outside the lab (e.g., track, gym, or home) using simple tools like a stopwatch or heart rate monitor. It typically estimates VO₂max based on performance metrics like time or distance.",
  },
  SUBMAXIMAL: {
    term: "Submaximal",
    definition:
      "An exercise test performed below maximal effort, usually targeting 70–85% of predicted max heart rate. It estimates VO₂max using heart rate response to known workloads.",
  },
  ESTIMATED: {
    term: "Estimated",
    definition:
      "VO₂max is calculated using a formula or model based on indirect markers like heart rate, distance, or workload. No direct measurement of gas exchange is involved.",
  },
  DIRECT: {
    term: "Direct",
    definition:
      "VO₂max is measured using metabolic gas analysis during exercise (O₂ in, CO₂ out), providing objective and physiological data. It requires specialized equipment and lab conditions.",
  },
} as const;

export type ProtocolDefinitionKey = keyof typeof PROTOCOL_DEFINITIONS;
