'use client';

import React from 'react';
import { Droplets, Clock, Sparkles, Plus, CheckCircle2, Waves, GlassWater } from 'lucide-react';
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
  const hydrationPlan = generateHydrationPlan(weightKg, activityLevel);
  const currentLitres = (progress.water_completed_ml / 1000).toFixed(1);
  const targetLitres = (hydrationPlan.dailyTargetMl / 1000).toFixed(1);
  const percent = Math.min(
    100,
    Math.round((progress.water_completed_ml / hydrationPlan.dailyTargetMl) * 100)
  );

  return (
    <div className="space-y-8">
      {/* Top Banner with Animated Water Fill Gauge */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-sky-950/40 to-slate-900/90 border border-sky-500/20 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 inline-flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5" />
              Dynamic Cellular Hydration Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentLitres} L <span className="text-slate-400 font-normal text-lg sm:text-xl">/ {targetLitres} L Target</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
              Calculated for your {weightKg} kg body mass and {activityLevel.replace('_', ' ')} lifestyle to maintain peak metabolic function, joint lubrication, and cognitive stamina.
            </p>

            {/* Quick logging buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <button
                type="button"
                onClick={() => onAddWater(250)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500/20 border border-sky-400/40 hover:bg-sky-500/30 text-sky-300 font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                +250 ml Glass
              </button>
              <button
                type="button"
                onClick={() => onAddWater(500)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500/20 border border-sky-400/40 hover:bg-sky-500/30 text-sky-300 font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                +500 ml Bottle
              </button>
              <button
                type="button"
                onClick={() => onAddWater(750)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-sky-500/40 text-slate-200 text-xs font-semibold transition-all hover:scale-105"
              >
                <Plus className="h-3.5 w-3.5" />
                +750 ml Shaker
              </button>
            </div>
          </div>

          {/* Visual Hydration Meter */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/70 border border-white/10">
            <div className="relative w-24 h-36 rounded-2xl border-2 border-sky-400/40 bg-slate-900/90 overflow-hidden flex flex-col justify-end p-1">
              <div
                className="w-full bg-gradient-to-t from-sky-600 to-cyan-400 rounded-xl transition-all duration-700 relative"
                style={{ height: `${percent}%` }}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-white/40 animate-pulse" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-lg text-white drop-shadow-md">
                {percent}%
              </div>
            </div>
            <span className="text-[11px] font-semibold text-sky-300 mt-2">
              {progress.water_completed_ml} / {hydrationPlan.dailyTargetMl} ml
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Intake Schedule */}
      <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-sky-400" />
            Recommended Daily Hydration Schedule
          </h3>
          <p className="text-xs text-slate-400">
            Pacing your fluid intake prevents kidney overload and maintains steady cellular osmosis throughout the day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {hydrationPlan.schedule.map((slot, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-start gap-3.5 hover:border-sky-500/20 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 shrink-0 mt-0.5">
                <GlassWater className="h-4 w-4" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{slot.timeLabel}</span>
                  <span className="text-xs font-bold text-sky-300 bg-sky-500/15 px-2 py-0.5 rounded-full border border-sky-500/20">
                    {slot.amountMl} ml
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">{slot.recommendedTime}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{slot.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hydration Tips */}
      <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-sky-400" />
          Pro Hydration Tips
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
          {hydrationPlan.tips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
