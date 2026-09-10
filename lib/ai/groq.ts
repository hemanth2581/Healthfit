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
  modelUsed?: string;
  errorCode?: 'MISSING_API_KEY' | 'RATE_LIMIT' | 'API_ERROR' | 'INVALID_REQUEST';
}

// Preferred candidate model hierarchy for highest reasoning accuracy and speed
const DEFAULT_CANDIDATE_MODELS = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b',
  'qwen/qwen3.6-27b',
  'groq/compound',
  'groq/compound-mini',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
];

let cachedAvailableModels: string[] | null = null;
let lastModelFetchTimestamp = 0;

/**
 * Dynamically queries Groq for currently enabled chat models on this API key.
 * Caches result for 15 minutes to minimize network overhead.
 */
async function getDynamicGroqModels(groq: Groq): Promise<string[]> {
  const now = Date.now();
  if (cachedAvailableModels && cachedAvailableModels.length > 0 && now - lastModelFetchTimestamp < 1000 * 60 * 15) {
    return cachedAvailableModels;
  }

  try {
    const list = await groq.models.list();
    const chatModels = (list.data || [])
      .map((m) => m.id)
      .filter(
        (id) =>
          !id.includes('whisper') &&
          !id.includes('guard') &&
          !id.includes('orpheus') &&
          !id.includes('safeguard')
      );

    if (chatModels.length > 0) {
      cachedAvailableModels = chatModels;
      lastModelFetchTimestamp = now;
      return chatModels;
    }
  } catch (err) {
    console.warn('[Groq] Failed to fetch dynamic model list:', err);
  }

  return [];
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

  const groq = new Groq({ apiKey });

  // Build model candidate list (user requested / env first, followed by known good models)
  const envModel = process.env.GROQ_MODEL?.trim();
  const requestedModel = model?.trim();

  const initialCandidates = [
    ...(requestedModel ? [requestedModel] : []),
    ...(envModel ? [envModel] : []),
    ...DEFAULT_CANDIDATE_MODELS,
  ];

  const candidateModels = Array.from(new Set(initialCandidates.filter(Boolean)));

  const contextString = formatContextForPrompt(context);
  const systemPrompt = buildGroqSystemPrompt(contextString);

  const recentHistory = history.slice(-12).map((h) => ({
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

  // Try predefined candidates first
  for (const currentModel of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const completion = await groq.chat.completions.create({
          model: currentModel,
          messages,
          temperature: 0.4,
          max_tokens: 2048,
          top_p: 0.95,
        });

        const replyText = completion.choices?.[0]?.message?.content?.trim() || '';

        if (replyText) {
          return {
            success: true,
            reply: replyText,
            answer: replyText,
            modelUsed: currentModel,
          };
        }
      } catch (error: unknown) {
        lastError = error;
        const errMsg = error instanceof Error ? error.message : String(error);
        const is404 = errMsg.includes('404') || errMsg.includes('does not exist') || errMsg.includes('model_not_found');
        const isRateLimit = errMsg.includes('429') || errMsg.toLowerCase().includes('rate limit');

        // If model doesn't exist, immediately try next model candidate without retrying this model
        if (is404) {
          break;
        }

        if (isRateLimit && attempt === 0) {
          await sleep(1000);
          continue;
        }

        break;
      }
    }
  }

  // If initial candidates failed (e.g. model name changes), discover models dynamically
  try {
    const liveModels = await getDynamicGroqModels(groq);
    const untriedModels = liveModels.filter((m) => !candidateModels.includes(m));

    for (const dynamicModel of untriedModels) {
      try {
        const completion = await groq.chat.completions.create({
          model: dynamicModel,
          messages,
          temperature: 0.4,
          max_tokens: 2048,
          top_p: 0.95,
        });

        const replyText = completion.choices?.[0]?.message?.content?.trim() || '';
        if (replyText) {
          return {
            success: true,
            reply: replyText,
            answer: replyText,
            modelUsed: dynamicModel,
          };
        }
      } catch (dynErr) {
        lastError = dynErr;
      }
    }
  } catch (dynFetchErr) {
    console.warn('[Groq] Dynamic model discovery fallback failed:', dynFetchErr);
  }

  // If Groq completely errored or is offline, provide local rule fallback answer
  console.warn('[Groq API Error] Using fallback engine:', lastError);
  const fallbackReply = generateFallbackResponse(message, context as any);

  return {
    success: true,
    reply: fallbackReply,
    answer: fallbackReply,
    isFallback: true,
  };
}
