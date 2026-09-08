export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessageItem {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isError?: boolean;
}

export interface SanitizedAiContext {
  userSummary: string;
  targetCalories: number;
  proteinTarget: number;
  waterTarget: number;
  dietPreference: string;
  allergies: string[];
  todayProgressSummary: string;
  todayMealsSummary: string;
}

export interface ChatApiRequest {
  message: string;
  context?: string | SanitizedAiContext;
  messages?: { role: string; content: string }[];
}

export interface ChatApiResponse {
  success: boolean;
  reply?: string;
  answer?: string;
  error?: string;
}
