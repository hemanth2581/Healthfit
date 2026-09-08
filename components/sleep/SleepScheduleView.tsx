'use client';

import React, { useState } from 'react';
import { Moon, Sun, Clock, Bed, Save } from 'lucide-react';
import { generateSleepRecommendation } from '@/lib/nutrition/sleep';
import { ActivityLevel, Goal } from '@/types/health';
import { DailyProgress, SleepLog, SleepQuality } from '@/types/progress';
import { localStore } from '@/lib/storage/localStore';

interface SleepScheduleProps {
  age: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  progress?: DailyProgress;
}

const SLEEP_QUALITIES: { id: SleepQuality; label: string; emoji: string; rating: number }[] = [
  { id: 'poor', label: 'Poor', emoji: '😫', rating: 1 },
  { id: 'below_average', label: 'Below Avg', emoji: '😕', rating: 2 },
  { id: 'average', label: 'Average', emoji: '😐', rating: 3 },
  { id: 'good', label: 'Good', emoji: '🙂', rating: 4 },
  { id: 'excellent', label: 'Great', emoji: '😴', rating: 5 },
];

export function SleepScheduleView({ age, activityLevel, goal }: SleepScheduleProps) {
  const sleepRec = generateSleepRecommendation(age, activityLevel, goal, '06:00');

  // Sleep logger state
  const [bedtime, setBedtime] = useState<string>('22:30');
  const [wakeTime, setWakeTime] = useState<string>('06:00');
  const [quality, setQuality] = useState<SleepQuality>('good');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Compute duration in hours and minutes
  const calculateDuration = () => {
    const [bH, bM] = bedtime.split(':').map(Number);
    const [wH, wM] = wakeTime.split(':').map(Number);

    const startMins = bH * 60 + bM;
    let endMins = wH * 60 + wM;
    if (endMins <= startMins) {
      endMins += 24 * 60; // next day
    }

    const diffMins = endMins - startMins;
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return { hours, minutes, totalMins: diffMins };
  };

  const { hours, minutes, totalMins } = calculateDuration();

  const handleSaveSleep = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedQ = SLEEP_QUALITIES.find((q) => q.id === quality);
    const newLog: SleepLog = {
      sleep_start: bedtime,
      sleep_end: wakeTime,
      duration_minutes: totalMins,
      quality: quality,
      quality_rating: selectedQ?.rating as 1 | 2 | 3 | 4 | 5,
      logged_at: new Date().toISOString(),
    };
    localStore.addSleepLog(newLog);

    const profile = localStore.getProfile();
    const uId = profile?.user_id || profile?.anonymous_user_id || 'user';
    const progress = localStore.getTodayProgress(uId);
    progress.sleep_completed_minutes = totalMins;
    localStore.saveTodayProgress(progress);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Banner with Sleep Goal */}
      <div className="p-5 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-center">
          <div className="space-y-3 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 inline-flex items-center gap-1.5">
              <Moon className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              Circadian Sleep System
            </span>
            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {sleepRec.targetHours}h 00m <span className="text-slate-400 font-normal text-base sm:text-xl">Sleep Goal</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Calculated using 90-minute NREM/REM cycles ({sleepRec.sleepCycles} cycles) for optimal hormonal regulation and cellular recovery.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                <Moon className="h-4 w-4 text-indigo-600 shrink-0" />
                Target Bedtime
              </span>
              <span className="text-sm font-black text-indigo-900">{sleepRec.recommendedBedtime}</span>
            </div>
            <div className="flex items-center justify-between border-t border-indigo-200/60 pt-2.5">
              <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                <Sun className="h-4 w-4 text-amber-500 shrink-0" />
                Target Wake-up
              </span>
              <span className="text-sm font-black text-amber-900">{sleepRec.recommendedWakeTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Stage Wind-Down Routine */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600 shrink-0" />
            <span>4-Stage Nighttime Wind-Down Routine</span>
          </h3>
          <p className="text-xs text-slate-500">
            Gradual parasympathetic relaxation triggers natural melatonin production and improves sleep quality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {[
            { time: '9:30 PM', title: 'Start winding down', desc: 'Dim bright overhead lights & transition to soft ambient lighting.' },
            { time: '9:45 PM', title: 'Avoid heavy meals', desc: 'Allow stomach digestion to conclude; sip warm herbal tea if needed.' },
            { time: '10:00 PM', title: 'Reduce screen time', desc: 'Put devices aside or enable blue-light filters to protect melatonin.' },
            { time: '10:30 PM', title: 'Sleep', desc: 'Quiet, cool bedroom (18-20°C) for deep restorative rest.' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1.5 hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">{item.time}</span>
                <span className="text-[10px] font-semibold text-slate-500 px-2 py-0.5 rounded-full bg-white border border-slate-200">
                  Stage {idx + 1}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Record Last Night's Sleep Form */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bed className="h-5 w-5 text-indigo-600 shrink-0" />
              <span>Record Sleep &amp; Quality</span>
            </h3>
            <p className="text-xs text-slate-500">
              Log your actual sleep time and quality to calculate daily recovery adherence.
            </p>
          </div>
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full animate-in fade-in self-start sm:self-auto">
              ✓ Sleep Logged!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSleep} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Bedtime
              </label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Wake-up Time
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Total Duration
              </label>
              <div className="w-full px-4 py-2.5 sm:py-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 font-extrabold text-sm flex items-center justify-between min-h-[44px]">
                <span>{hours}h {minutes}m</span>
                <span className="text-xs font-normal text-indigo-600">
                  ({(totalMins / 90).toFixed(1)} cycles)
                </span>
              </div>
            </div>
          </div>

          {/* Sleep Quality Rating */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              How did you feel upon waking?
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-2.5">
              {SLEEP_QUALITIES.map((q) => {
                const isSelected = quality === q.id;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setQuality(q.id)}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer touch-manipulation min-h-[48px] ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl mb-0.5">{q.emoji}</div>
                    <div className="text-[11px] sm:text-xs font-bold truncate">{q.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>Save Sleep Log</span>
          </button>
        </form>
      </div>
    </div>
  );
}
