'use client';

import React, { useState } from 'react';
import { Droplets, Clock, Plus } from 'lucide-react';
import { generateHydrationPlan } from '@/lib/nutrition/hydration';
import { ActivityLevel } from '@/types/health';
import { DailyProgress } from '@/types/progress';

interface HydrationViewProps {
  weightKg: number;
  activityLevel: ActivityLevel;
  progress: DailyProgress;
  onAddWater: (amountMl: number) => void;
}

export function HydrationScheduleView({
  weightKg,
  activityLevel,
  progress,
  onAddWater,
}: HydrationViewProps) {
  const [customAmount, setCustomAmount] = useState<string>('');
  const hydrationPlan = generateHydrationPlan(weightKg, activityLevel);
  const currentMl = progress.water_completed_ml || 0;
  const targetMl = hydrationPlan.dailyTargetMl || 2500;
  const remainingMl = Math.max(0, targetMl - currentMl);
  const percent = Math.min(100, Math.round((currentMl / targetMl) * 100));

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customAmount, 10);
    if (val && val > 0) {
      onAddWater(val);
      setCustomAmount('');
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Banner with Progress & Quick Logging */}
      <div className="p-5 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-center">
          <div className="space-y-3 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 inline-flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
              Today&apos;s Hydration
            </span>

            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {currentMl.toLocaleString()}{' '}
                <span className="text-slate-400 font-normal text-base sm:text-xl">
                  / {targetMl.toLocaleString()} ml
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {percent >= 100
                  ? '🎉 Daily target reached! Great job maintaining cellular hydration.'
                  : `${remainingMl.toLocaleString()} ml remaining to reach your daily hydration target.`}
              </p>
            </div>

            {/* Quick logging buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onAddWater(250)}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer touch-manipulation min-h-[44px]"
              >
                <Plus className="h-3.5 w-3.5" />
                +250 ml
              </button>
              <button
                type="button"
                onClick={() => onAddWater(500)}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer touch-manipulation min-h-[44px]"
              >
                <Plus className="h-3.5 w-3.5" />
                +500 ml
              </button>
              <button
                type="button"
                onClick={() => onAddWater(750)}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-cyan-50 border border-cyan-200 hover:bg-cyan-100 text-cyan-800 text-xs font-bold transition-all active:scale-95 cursor-pointer touch-manipulation min-h-[44px]"
              >
                <Plus className="h-3.5 w-3.5" />
                +750 ml
              </button>
            </div>

            {/* Custom Add Form */}
            <form onSubmit={handleCustomAdd} className="flex flex-wrap items-center gap-2 pt-1">
              <input
                type="number"
                min="50"
                max="2000"
                step="50"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Custom ml (e.g. 350)"
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 w-40 sm:w-44 min-h-[44px]"
              />
              <button
                type="submit"
                disabled={!customAmount}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer touch-manipulation min-h-[44px]"
              >
                Add Water
              </button>
            </form>
          </div>

          {/* Progress Circular visual */}
          <div className="flex flex-col items-center justify-center p-5 bg-cyan-50/60 border border-cyan-100 rounded-3xl">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-cyan-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-600 transition-all duration-500"
                  strokeDasharray={`${percent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-black text-cyan-950">{percent}%</span>
                <span className="text-[10px] text-cyan-700 font-bold uppercase">Hydrated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7 Daily Checkpoints Schedule */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-cyan-600 shrink-0" />
            <span>7-Stage Cellular Hydration Schedule</span>
          </h3>
          <p className="text-xs text-slate-500">
            Timing checkpoints spread evenly from waking to evening for continuous metabolic efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {hydrationPlan.schedule.map((slot, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-900">{slot.recommendedTime}</span>
                  <span className="text-[10px] font-semibold text-slate-400">Slot {idx + 1}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">{slot.timeLabel}</h4>
                <p className="text-[11px] text-slate-500">{slot.reason}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-extrabold text-cyan-700 bg-cyan-100/70 px-2 py-0.5 rounded-lg inline-block">
                  {slot.amountMl} ml
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

