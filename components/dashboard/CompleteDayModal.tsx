'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Award, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  score: number;
  breakdown: {
    meals: number;
    workout: number;
    hydration: number;
    sleep: number;
  };
  streakCount: number;
  pointsAwarded: number;
  isAlreadyCompleted?: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function CompleteDayModal({
  isOpen,
  score,
  breakdown,
  streakCount,
  pointsAwarded,
  isAlreadyCompleted = false,
  onClose,
  onContinue,
}: Props) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#059669', '#0d9488', '#f59e0b', '#3b82f6', '#8b5cf6'],
        });
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-emerald-200 bg-white p-5 sm:p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200 relative max-h-[92vh] overflow-y-auto safe-area-pb">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 mb-3">
          <CheckCircle2 className="h-8 w-8 sm:h-9 sm:w-9 stroke-[2.5]" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {isAlreadyCompleted ? '✅ DAY LOGGED' : '🎉 DAY COMPLETE'}
        </h2>

        <div className="mt-3 mb-4 p-3.5 sm:p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 mb-0.5">
            Your Health Score
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-950">{score}%</div>

          {/* Breakdown bars */}
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-100">
              <span className="text-slate-600 font-medium text-[11px] sm:text-xs">Meals</span>
              <span className="font-bold text-slate-900">{breakdown.meals}%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-100">
              <span className="text-slate-600 font-medium text-[11px] sm:text-xs">Workout</span>
              <span className="font-bold text-slate-900">{breakdown.workout}%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-100">
              <span className="text-slate-600 font-medium text-[11px] sm:text-xs">Hydration</span>
              <span className="font-bold text-slate-900">{breakdown.hydration}%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-100">
              <span className="text-slate-600 font-medium text-[11px] sm:text-xs">Sleep</span>
              <span className="font-bold text-slate-900">{breakdown.sleep}%</span>
            </div>
          </div>
        </div>

        {/* Health Points badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs sm:text-sm border border-emerald-200">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{pointsAwarded} Health Points</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs sm:text-sm border border-amber-200">
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>{streakCount} Day Streak Active!</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation active:scale-[0.98]"
        >
          <span>Continue Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
