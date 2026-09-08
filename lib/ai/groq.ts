import Groq from 'groq-sdk';
import { buildGroqSystemPrompt } from './systemPrompt';
import { formatContextForPrompt, HealthFitChatContext } from './context';
import { generateFallbackResponse } from './fallbackEngine';

export interface ChatHistoryMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GenerateGroqChatResponseOptions {
  message: string;
  context?: HealthFitChatContext;
  history?: ChatHistoryMessage[];
  model?: string;
}

export interface GroqChatResult {
  success: boolean;
  reply: string;
  answer?: string;
  isFallback?: boolean;
  errorCode?: 'MISSING_API_KEY' | 'RATE_LIMIT' | 'API_ERROR' | 'INVALID_REQUEST';
}

/**
 * Executes a conversational turn with Groq AI using the official SDK,
 * falling back to the local context-aware rule engine if keys are missing or offline.
 */
export async function generateGroqChatResponse({
  message,
  context = {},
  history = [],
  model,
}: GenerateGroqChatResponseOptions): Promise<GroqChatResult> {
  const apiKey = process.env.GROQ_API_KEY?.trim();

  // If no API key is provided, use the intelligent local fallback engine
  if (!apiKey || apiKey === '' || apiKey.includes('your_groq_api_key') || apiKey.includes('your-api-key')) {
    const fallbackAnswer = generateFallbackResponse(message, context as any);
    return {
      success: true,
      reply: fallbackAnswer,
      answer: fallbackAnswer,
      isFallback: true,
    };
  }

  const requestedModel = model || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const candidateModels = Array.from(
    new Set([requestedModel, 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'])
  );

  const groq = new Groq({ apiKey });
  const contextString = formatContextForPrompt(context);
  const systemPrompt = buildGroqSystemPrompt(contextString);

  const recentHistory = history.slice(-8).map((h) => ({
    role: (h.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
    content: h.content,
  }));

  const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    ...recentHistory,
    {
      role: 'user',
      content: message,
    },
  ];

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  let lastError: unknown = null;

  for (const currentModel of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const completion = await groq.chat.completions.create({
          model: currentModel,
          messages,
          temperature: 0.7,
          max_tokens: 1536,
        });

        const replyText = completion.choices?.[0]?.message?.content?.trim() || '';

        if (replyText) {
          return {
            success: true,
            reply: replyText,
            answer: replyText,
          };
        }
      } catch (error: unknown) {
        lastError = error;
        const errMsg = error instanceof Error ? error.message : String(error);
        const isRateLimit = errMsg.includes('429') || errMsg.toLowerCase().includes('rate limit');

        if (isRateLimit && attempt === 0) {
          await sleep(1000);
          continue;
        }

        break;
      }
    }
  }

  // If Groq errored or rate-limited, provide the local rule fallback answer
  console.warn('Groq API error/rate-limit, using fallback engine:', lastError);
  const fallbackReply = generateFallbackResponse(message, context as any);

  return {
    success: true,
    reply: fallbackReply,
    answer: fallbackReply,
    isFallback: true,
  };
}
