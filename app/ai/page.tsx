'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  RotateCcw,
  ShieldCheck,
  Utensils,
  Dumbbell,
  Repeat,
  Droplets,
  Moon,
  AlertTriangle,
  Brain,
} from 'lucide-react';
import {
  useProfile,
  useMetrics,
  useWeeklyPlan,
  useTodayProgress,
} from '@/lib/hooks';
import { buildSanitizedAiContext } from '@/lib/ai/context';
import { getDayName } from '@/lib/utils/dates';
import { ChatMessage, MessageItem } from '@/components/ai/ChatMessage';

const SESSION_STORAGE_KEY = 'healthfit_groq_ai_chat_session';

let msgCounter = 0;
function nextMsgId(prefix: string) {
  msgCounter += 1;
  return `${prefix}-${Date.now()}-${msgCounter}`;
}

function getFormattedTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const QUICK_PROMPTS = [
  {
    label: '🍽️ What can I eat instead of oats?',
    prompt: 'What are 3 high-protein, healthy breakfast alternatives to oats compatible with my diet preferences?',
    icon: Utensils,
  },
  {
    label: '🔄 Can I replace chicken with paneer?',
    prompt: 'Can I replace chicken with paneer? How much paneer should I eat to match the protein and calories?',
    icon: Repeat,
  },
  {
    label: '💪 I missed today’s workout. What should I do?',
    prompt: 'I missed my workout today. How should I adjust my schedule, calories, or recovery tomorrow?',
    icon: Dumbbell,
  },
  {
    label: '💧 How much water do I have left today?',
    prompt: 'Based on my daily water target and progress, how much water should I drink for the rest of today?',
    icon: Droplets,
  },
  {
    label: '🥱 Why am I hungry after dinner?',
    prompt: 'Why do I often feel hungry after dinner and what healthy low-calorie snack or habit would help?',
    icon: Moon,
  },
];

export default function AICoachPage() {
  const profile = useProfile();
  const metrics = useMetrics();
  const weeklyPlan = useWeeklyPlan();
  const progress = useTodayProgress();

  const [messages, setMessages] = useState<MessageItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (messages.length > 0) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
      } else {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save chat session:', e);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const todayDayName = getDayName();
  const todayPlan = weeklyPlan
    ? weeklyPlan.days.find((d) => d.dayName === todayDayName) || weeklyPlan.days[0]
    : null;

  const handleSendMessage = async (textToSend?: string, historyOverride?: MessageItem[]) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: MessageItem = {
      id: nextMsgId('user'),
      role: 'user',
      content: text,
      timestamp: getFormattedTime(),
    };

    const baseHistory = historyOverride || messages;
    const newMessages = [...baseHistory, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    const aiContext = buildSanitizedAiContext(
      profile,
      metrics,
      weeklyPlan,
      progress,
      todayPlan
    );

    const historyPayload = newMessages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: aiContext,
          messages: historyPayload,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        const errorReply =
          data.answer ||
          data.reply ||
          'Sorry, I could not process that request right now. Please try again.';

        setMessages((prev) => [
          ...prev,
          {
            id: nextMsgId('assistant'),
            role: 'assistant',
            content: errorReply,
            timestamp: getFormattedTime(),
            isError: true,
          },
        ]);
      } else {
        const replyContent = data.answer || data.reply || '';
        setMessages((prev) => [
          ...prev,
          {
            id: nextMsgId('assistant'),
            role: 'assistant',
            content: replyContent,
            timestamp: getFormattedTime(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextMsgId('assistant'),
          role: 'assistant',
          content: "Sorry, I couldn't reach the AI assistant. Please check your connection and try again.",
          timestamp: getFormattedTime(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Sparkles className="h-7 w-7 text-emerald-600" />
            <span>AI Health & Nutrition Coach</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Personalized guidance grounded in your biometrics, meal plans, workouts, and adherence.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear Conversation</span>
          </button>
        )}
      </div>

      {/* User Context Strip */}
      {metrics && profile && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Active Biometric Context Attached:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-bold text-slate-700">
            <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-emerald-800">
              🔥 {metrics.targetCalories} kcal Target
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-teal-800">
              🥩 {metrics.proteinTarget}g Protein
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-cyan-800">
              💧 {metrics.waterTarget}ml Water
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-purple-800 capitalize">
              🎯 {profile.goal ? String(profile.goal).replace('_', ' ') : 'Health Goal'}
            </span>
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col h-[580px]">
        {/* Messages List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="py-6 space-y-6 max-w-2xl mx-auto text-center">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 text-left space-y-3 shadow-xs">
                <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base">
                  <div className="p-2 rounded-2xl bg-emerald-100 text-emerald-700">
                    <Brain className="h-5 w-5" />
                  </div>
                  <span>Ask your personal AI Health Coach anything</span>
                </div>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Your coach knows your current calorie goal, dietary preferences (e.g. {profile?.diet_preference || profile?.diet_type || 'vegetarian'}), allergies, water intake, and today’s workout plan.
                </p>
              </div>

              {/* Quick Prompts */}
              <div className="space-y-2 text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                  Suggested Questions
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_PROMPTS.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(item.prompt)}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/60 text-left text-xs text-slate-700 font-bold transition-all group shadow-xs cursor-pointer"
                      >
                        <div className="p-2 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            messages.map((m, idx) => (
              <ChatMessage
                key={m.id}
                message={m}
                isLast={idx === messages.length - 1}
                onRegenerate={() => {
                  if (messages.length > 0) {
                    const lastUser = [...messages].reverse().find((x) => x.role === 'user');
                    if (lastUser) handleSendMessage(lastUser.content);
                  }
                }}
                isRegenerating={isLoading}
              />
            ))
          )}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-xs text-slate-500 p-2 animate-pulse">
              <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="h-4 w-4 animate-spin" />
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-xs shadow-xs">
                <span>HealthFit AI is crafting your recommendation...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-2">
          <div className="relative flex items-center">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Ask about your diet plan, food substitutions, macro targets, or workouts..."
              disabled={isLoading}
              className="w-full pl-4 pr-14 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-sm text-slate-900 placeholder:text-slate-400 resize-none outline-none disabled:opacity-50 transition-all"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold transition-all active:scale-95 shadow-md shadow-emerald-600/20 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-medium">
            <span>Press Enter to send, Shift+Enter for newline</span>
            <span className="flex items-center gap-1 text-emerald-800 font-bold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Groq AI + Local Safety Guardrails
            </span>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium flex items-start gap-2.5">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          HealthFit AI provides general wellness, workout, and nutritional guidance. It does not replace professional medical diagnosis, treatment, or advice. Always consult a physician or registered dietitian for specialized health conditions.
        </p>
      </div>
    </div>
  );
}
