import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateGroqChatResponse, ChatHistoryMessage } from '@/lib/ai/groq';
import { HealthFitChatContext } from '@/lib/ai/context';

const chatRequestSchema = z.object({
  message: z.string().trim().min(1, 'Message cannot be empty').max(2000, 'Message is too long (max 2000 characters)').optional(),
  prompt: z.string().trim().min(1).max(2000).optional(),
  context: z.custom<HealthFitChatContext>().optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().max(4000),
      })
    )
    .max(20, 'History cannot exceed 20 messages')
    .optional(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().max(4000),
      })
    )
    .max(20, 'History cannot exceed 20 messages')
    .optional(),
  model: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = chatRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          reply: parseResult.error.issues[0]?.message || 'Invalid request format.',
          answer: parseResult.error.issues[0]?.message || 'Invalid request format.',
          errorCode: 'INVALID_REQUEST',
        },
        { status: 400 }
      );
    }

    const { message, prompt, context, messages, history, model } = parseResult.data;
    const userMessage = (message || prompt || '').trim();

    if (!userMessage) {
      return NextResponse.json(
        {
          success: false,
          reply: 'Message cannot be empty.',
          answer: 'Message cannot be empty.',
          errorCode: 'INVALID_REQUEST',
        },
        { status: 400 }
      );
    }

    const conversationHistory: ChatHistoryMessage[] = messages || history || [];

    const result = await generateGroqChatResponse({
      message: userMessage,
      context: context || {},
      history: conversationHistory,
      model,
    });

    if (!result.success) {
      if (result.errorCode === 'MISSING_API_KEY') {
        return NextResponse.json(result, { status: 503 });
      }
      if (result.errorCode === 'RATE_LIMIT') {
        return NextResponse.json(result, { status: 429 });
      }
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        answer: result.reply,
        reply: result.reply,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unhandled Groq chat API error:', error);
    return NextResponse.json(
      {
        success: false,
        reply: "Sorry, I couldn't process that request right now. Please try again.",
        answer: "Sorry, I couldn't process that request right now. Please try again.",
        errorCode: 'API_ERROR',
      },
      { status: 500 }
    );
  }
}
