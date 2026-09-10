'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Minus,
  ShieldCheck,
  Utensils,
  Dumbbell,
  Repeat,
  Terminal,
  Brain,
  Lightbulb,
} from 'lucide-react';
import {
  useProfile,
  useMetrics,
  useWeeklyPlan,
  useTodayProgress,
  useIsMounted,
} from '@/lib/hooks';
import { buildSanitizedAiContext } from '@/lib/ai/context';
import { getDayName } from '@/lib/utils/dates';
import { ChatMessage, MessageItem } from './ChatMessage';

const SESSION_STORAGE_KEY = 'healthfit_groq_ai_chat_session';

let msgCounter = 0;
function nextMsgId(prefix: string) {
  msgCounter += 1;
  return `${prefix}-${Date.now()}-${msgCounter}`;
}

function getFormattedTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Quick action shortcuts — clicking these sends dynamic queries to Groq AI
const QUICK_ACTIONS = [
  {
    id: 'general_ai',
    label: '🤖 What is Machine Learning?',
    icon: Brain,
    prompt: 'Explain machine learning in simple words with real-world examples.',
  },
  {
    id: 'code_python',
    label: '🐍 Python String Reversal',
    icon: Terminal,
    prompt: 'Write a Python function to reverse a string and explain the time complexity.',
  },
  {
    id: 'eat_today',
    label: '🍽️ My meal plan',
    icon: Utensils,
    prompt: 'What meals do I have scheduled for today according to my HealthFit plan?',
  },
  {
    id: 'food_swap',
    label: '🔄 Food swap',
    icon: Repeat,
    prompt: 'Can I replace rice with chapati or swap chicken with high-protein vegetarian alternatives?',
  },
  {
    id: 'workout_today',
    label: '💪 My workout routine',
    icon: Dumbbell,
    prompt: 'What workout routine should I focus on today for optimal recovery and strength?',
  },
  {
    id: 'general_science',
    label: '💡 How does Wi-Fi work?',
    icon: Lightbulb,
    prompt: 'How does Wi-Fi transmission work and what frequencies does it use?',
  },
];

export function HealthFitAIChat() {
  const isMounted = useIsMounted();
  const profile = useProfile();
  const metrics = useMetrics();
  const weeklyPlan = useWeeklyPlan();
  const progress = useTodayProgress();

  const [isOpen, setIsOpen] = useState(false);
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Listen for open_healthfit_ai window events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOpenEvent = (e: Event) => {
      setIsOpen(true);
      const custom = e as CustomEvent<{ prompt?: string }>;
      if (custom.detail?.prompt) {
        setInputValue(custom.detail.prompt);
      }
    };

    window.addEventListener('open_healthfit_ai', handleOpenEvent);
    return () => window.removeEventListener('open_healthfit_ai', handleOpenEvent);
  }, []);

  // Save session chat on updates
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

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isLoading) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isLoading]);

  if (!isMounted) return null;

  // Identify today's day plan
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

    // Build sanitized HealthFit context
    const aiContext = buildSanitizedAiContext(
      profile,
      metrics,
      weeklyPlan,
      progress,
      todayPlan
    );

    // Format past history for request
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
          (res.status === 503
            ? 'Groq AI key is required. Please add `GROQ_API_KEY` to `.env.local`.'
            : res.status === 429
            ? 'Groq AI is currently experiencing high traffic. Please try again shortly.'
            : 'Sorry, I could not process that request right now. Please try again.');

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

  // Regenerate last AI response
  const handleRegenerateLast = () => {
    if (isLoading || messages.length === 0) return;

    // Find last user message
    let lastUserIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return;

    const lastUserMsg = messages[lastUserIndex];
    // Keep history up to (excluding) the last user message
    const historyBefore = messages.slice(0, lastUserIndex);
    handleSendMessage(lastUserMsg.content, historyBefore);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    if (messages.length > 0 && !showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }
    setMessages([]);
    setShowResetConfirm(false);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  return (
    <>
      {/* 1. Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 right-4 sm:right-6 z-40 animate-in fade-in zoom-in-95 duration-300">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open HealthFit AI Assistant"
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all border border-white/20 cursor-pointer min-h-[44px]"
          >
            {/* Status Pulse Dot */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>

            <Sparkles className="h-4 w-4 text-white animate-spin-slow" />
            <span className="tracking-tight font-extrabold">✨ Ask HealthFit AI</span>
          </button>
        </div>
      )}

      {/* 2. Floating AI Chat Modal / Panel */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 top-10 sm:top-auto sm:inset-auto sm:right-5 sm:bottom-5 z-50 flex flex-col w-full sm:w-[440px] h-[calc(100dvh-2.5rem)] sm:h-[640px] max-h-[100dvh] sm:max-h-[92vh] rounded-t-3xl sm:rounded-3xl bg-white/95 border border-slate-200/90 backdrop-blur-2xl shadow-2xl shadow-slate-900/15 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-250">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-white/90 border-b border-slate-200/80 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">HealthFit AI Coach</h3>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {isLoading ? 'Thinking...' : 'Groq Powered'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Personalized diet, meal swaps & workouts</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Reset / New Chat */}
              <button
                type="button"
                onClick={handleResetChat}
                title="Start a new chat session"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              {/* Minimize / Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors hidden sm:inline-flex cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Reset Confirmation Overlay */}
          {showResetConfirm && (
            <div className="bg-rose-50 border-b border-rose-200 p-3 flex items-center justify-between text-xs text-rose-900 animate-in fade-in duration-150">
              <span className="font-medium">Clear current chat conversation?</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1 rounded bg-white hover:bg-slate-100 text-[11px] font-semibold text-slate-700 border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] cursor-pointer"
                >
                  Yes, Clear
                </button>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="py-2 space-y-4 text-center">
                {/* Welcome Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white border border-emerald-200 text-left space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    Hi! I&apos;m your HealthFit AI Coach 👋
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Ask me anything about your diet plan, food substitutions, macro goals, healthy recipes, or workout routines!
                  </p>

                  {metrics && profile ? (
                    <div className="pt-2 border-t border-emerald-100 flex flex-wrap gap-1.5 text-[10px] text-slate-600 font-semibold">
                      <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-emerald-800 shadow-2xs">
                        🎯 {metrics.targetCalories} kcal
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-teal-800 shadow-2xs">
                        🥩 {metrics.proteinTarget}g Protein
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-cyan-800 shadow-2xs">
                        💧 {metrics.waterTarget} mL Water
                      </span>
                    </div>
                  ) : (
                    <div className="pt-1 text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Groq AI Intelligence ready for any prompt.
                    </div>
                  )}
                </div>

                {/* Quick Action Suggestion Chips */}
                <div className="space-y-2 text-left">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
                    Suggested Prompts
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {QUICK_ACTIONS.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          type="button"
                          key={action.id}
                          onClick={() => handleSendMessage(action.prompt)}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/60 text-left text-xs text-slate-700 hover:text-emerald-900 transition-all group shadow-xs cursor-pointer"
                        >
                          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-semibold truncate">{action.label}</span>
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
                  onRegenerate={handleRegenerateLast}
                  isRegenerating={isLoading}
                />
              ))
            )}

            {/* Thinking / Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2.5 text-xs text-slate-500 p-2 animate-pulse">
                <div className="h-6 w-6 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-xs">
                  <span className="text-[11px] font-semibold">Groq AI is thinking</span>
                  <span className="inline-flex gap-0.5 ml-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] bg-white border-t border-slate-200 shrink-0 space-y-2">
            <div className="relative flex items-center">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask anything — health, diet, workouts, coding, science..."
                disabled={isLoading}
                className="w-full pl-3.5 pr-11 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-xs text-slate-900 placeholder:text-slate-400 resize-none outline-none disabled:opacity-50 transition-all max-h-24 overflow-y-auto"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold transition-all disabled:scale-100 active:scale-95 shadow-md shadow-emerald-600/20 cursor-pointer disabled:cursor-not-allowed min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-medium">
              <span>Enter to send • Shift+Enter for new line</span>
              <span className="flex items-center gap-1 text-[9px] text-emerald-800 font-semibold">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                Groq AI Active
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

