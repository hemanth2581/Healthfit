'use client';

import React from 'react';
import { Moon, Sun, Clock, Sparkles, CheckCircle2, ShieldCheck, Bed } from 'lucide-react';
import { generateSleepRecommendation } from '@/lib/nutrition/sleep';
import { ActivityLevel, Goal } from '@/types/health';
import { DailyProgress } from '@/types/progress';

interface SleepScheduleProps {
  age: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  progress: DailyProgress;
}

export function SleepScheduleView({ age, activityLevel, goal, progress }: SleepScheduleProps) {
  const sleepRec = generateSleepRecommendation(age, activityLevel, goal, '06:30');

  return (
    <div className="space-y-8">
      {/* Top Banner with Recommended Bedtime & Wake Time */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 inline-flex items-center gap-1.5">
              <Moon className="h-3.5 w-3.5" />
              Circadian Sleep & Recovery Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {sleepRec.targetHours} Hours <span className="text-slate-400 font-normal text-lg sm:text-xl">Optimal Sleep Target</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
              Based on your age ({age}) and {activityLevel.replace('_', ' ')} physical training, you require approximately {sleepRec.sleepCycles} complete 90-minute NREM/REM sleep cycles for complete nervous system and muscular restoration.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/70 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Moon className="h-4 w-4 text-indigo-400" />
                Target Bedtime
              </span>
              <span className="text-base font-black text-indigo-300">{sleepRec.recommendedBedtime}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-2">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sun className="h-4 w-4 text-amber-400" />
                Target Wake-up
              </span>
              <span className="text-base font-black text-amber-300">{sleepRec.recommendedWakeTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Step Circadian Wind-Down Protocol */}
      <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-400" />
            4-Stage Nighttime Wind-Down Protocol
          </h3>
          <p className="text-xs text-slate-400">
            Gradual parasympathetic activation optimizes natural melatonin synthesis and sleep latency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {sleepRec.windDownProtocol.map((protocol, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1.5 hover:border-indigo-500/25 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300">{protocol.step}</span>
                <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                  {protocol.time}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{protocol.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sleep Hygiene Tips */}
      <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          Scientifically-Backed Sleep Hygiene
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
          {sleepRec.tips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
