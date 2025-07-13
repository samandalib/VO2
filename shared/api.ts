/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * VO2Max related API types
 */
export interface VO2MaxData {
  age: number;
  sex: "male" | "female";
  weight: number;
  height: number;
  currentVO2Max: number;
  restingHeartRate: number;
  selectedProtocol?: string;
}

export interface ImprovementPlan {
  level: "Beginner" | "Intermediate" | "Advanced";
  trainingProtocol: string;
  reason: string;
  timeCommitment: string;
  resultsTimeframe: string;
  realisticProgress: string;
  researchPopulation: string;
  researchResults: string;
  recommended?: boolean;
}

export interface GeneratePlansRequest extends VO2MaxData {}

export interface GeneratePlansResponse {
  plans: ImprovementPlan[];
}

/**
 * Chat API types
 */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  message: string;
  threadId?: string;
}

export interface ChatResponse {
  message: string;
  threadId: string;
  timestamp: number;
}
