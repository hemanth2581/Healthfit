'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Scale,
  Droplets,
  Moon,
  Plus,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { WeightLog, WaterLog, SleepLog, DailyProgress } from '@/types/progress';
import { HealthCalculations, UserProfile } from '@/types/health';

interface ProgressAnalyticsProps {
  profile: UserProfile;
  metrics: HealthCalculations;
  weightLogs: WeightLog[];
  waterLogs?: WaterLog[];
  sleepLogs?: SleepLog[];
  allProgress: Record<string, DailyProgress> | DailyProgress[];
  onAddWeight: (weight: number, notes?: string) => void;
  onAddWater: (amountMl: number) => void;
  onAddSleep: (start: string, end: string, durationMinutes: number, quality?: number) => void;
}

type TimeFilter = '7d' | '30d' | '90d' | 'all';

export function ProgressAnalyticsView({
  profile,
  metrics,
  weightLogs,
  waterLogs: _waterLogs,
  sleepLogs: _sleepLogs,
  allProgress,
  onAddWeight,
  onAddWater,
  onAddSleep,
}: ProgressAnalyticsProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('7d');

  const initialWeight = profile.weight_kg || profile.weight || 70;

  // Modal states
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);

  // Form states
  const [newWeight, setNewWeight] = useState<number>(initialWeight);
  const [weightNote, setWeightNote] = useState('');
  const [customWaterMl, setCustomWaterMl] = useState(500);
  const [sleepStart, setSleepStart] = useState('22:30');
  const [sleepEnd, setSleepEnd] = useState('06:00');
  const [sleepQuality, setSleepQuality] = useState(4);

  // Normalize allProgress to map
  const progressMap = Array.isArray(allProgress)
    ? allProgress.reduce<Record<string, DailyProgress>>((acc, item) => {
        acc[item.progress_date] = item;
        return acc;
      }, {})
    : allProgress || {};

  // Determine number of days based on filter
  const dayCount = timeFilter === '7d' ? 7 : timeFilter === '30d' ? 30 : timeFilter === '90d' ? 90 : 30;

  // Prepare Timeseries Data
  const timeseriesData = Array.from({ length: dayCount }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (dayCount - 1 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const shortDate = d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });

    const p = progressMap[dateStr];
    const waterL = p ? Math.round((p.water_completed_ml / 1000) * 10) / 10 : 0;
    const targetL = Math.round((metrics.waterTarget / 1000) * 10) / 10;
    const sleepH = p ? Math.round((p.sleep_completed_minutes / 60) * 10) / 10 : 7.5;

    return {
      date: dateStr,
      label: dayCount <= 7 ? dayName : shortDate,
      adherence: p ? p.completion_percentage : 0,
      waterLitres: waterL,
      waterTargetLitres: targetL,
      sleepHours: sleepH,
      workoutDone: p?.workout_completed ? 100 : 0,
    };
  });

  // Calculate weight stats
  const startWeight = initialWeight;
  const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight_kg : initialWeight;
  const goalWeight = (profile as any).target_weight_kg || (profile as any).target_weight || Math.round(startWeight * 0.95);
  const totalChange = Math.round((currentWeight - startWeight) * 10) / 10;
  const weightProgressPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (Math.abs(startWeight - currentWeight) / Math.max(1, Math.abs(startWeight - goalWeight))) * 100
      )
    )
  );

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeight > 0) {
      onAddWeight(newWeight, weightNote);
      setShowWeightModal(false);
      setWeightNote('');
    }
  };

  const handleWaterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customWaterMl > 0) {
      onAddWater(customWaterMl);
      setShowWaterModal(false);
    }
  };

  const handleSleepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [startH, startM] = sleepStart.split(':').map(Number);
    const [endH, endM] = sleepEnd.split(':').map(Number);
    let diffMinutes = endH * 60 + endM - (startH * 60 + startM);
    if (diffMinutes < 0) diffMinutes += 24 * 60;

    onAddSleep(sleepStart, sleepEnd, diffMinutes, sleepQuality);
    setShowSleepModal(false);
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner with Time Filters & Action Buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 sm:p-6 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600 shrink-0" />
            <span>Progress &amp; Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track weight shifts, hydration consistency, sleep hygiene, and habit streaks over time.
          </p>
        </div>

        {/* Time Filters Strip */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold self-start md:self-auto overflow-x-auto no-scrollbar">
          {(['7d', '30d', '90d', 'all'] as TimeFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setTimeFilter(f)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer touch-manipulation min-h-[36px] ${
                timeFilter === f
                  ? 'bg-white text-emerald-800 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f === '7d' ? '7 Days' : f === '30d' ? '30 Days' : f === '90d' ? '90 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Goal & Weight Progress Summary Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Your Goal Progress
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Body Weight Target Tracking
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowWeightModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer touch-manipulation min-h-[44px] self-start sm:self-auto"
          >
            <Scale className="w-4 h-4" />
            <span>Log Weight</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3.5 pt-1">
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] sm:text-xs text-slate-500 font-semibold block truncate">Start</span>
            <p className="text-base sm:text-2xl font-black text-slate-900 mt-0.5">{startWeight} kg</p>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[10px] sm:text-xs text-emerald-800 font-semibold block truncate">Current</span>
            <p className="text-base sm:text-2xl font-black text-emerald-950 mt-0.5">{currentWeight} kg</p>
            {totalChange !== 0 && (
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                {totalChange > 0 ? `+${totalChange}` : totalChange} kg total
              </span>
            )}
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] sm:text-xs text-slate-500 font-semibold block truncate">Goal</span>
            <p className="text-base sm:text-2xl font-black text-slate-900 mt-0.5">{goalWeight} kg</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-600">Goal Progress</span>
            <span className="text-emerald-700">{weightProgressPercent}% on track</span>
          </div>
          <div className="w-full h-2.5 sm:h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(6, weightProgressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid: 1-col on mobile, 2-col on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* 1. Weight Trend */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Weight Timeline (kg)</h3>
                <p className="text-[11px] text-slate-400">Trend across logged check-ins</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowWeightModal(true)}
              aria-label="Add weight log"
              className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 text-xs touch-manipulation"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="h-56 sm:h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightLogs.length > 0 ? weightLogs : [{ logged_at: new Date().toISOString(), weight_kg: startWeight }]} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="logged_at"
                  tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                  stroke="#94a3b8"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', fontSize: '11px' }}
                />
                <Line
                  type="monotone"
                  dataKey="weight_kg"
                  name="Weight (kg)"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#059669' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Hydration Consistency */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-100 text-cyan-800 shrink-0">
                <Droplets className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hydration Consistency</h3>
                <p className="text-[11px] text-slate-400">Target: {(metrics.waterTarget / 1000).toFixed(1)} L/day</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowWaterModal(true)}
              aria-label="Add water log"
              className="p-2 rounded-xl bg-slate-100 hover:bg-cyan-100 text-slate-600 hover:text-cyan-800 text-xs touch-manipulation"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="h-56 sm:h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeseriesData} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="waterLitres" name="Actual (L)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="waterTargetLitres" name="Target (L)" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Sleep Duration */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800 shrink-0">
                <Moon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sleep Duration (Hours)</h3>
                <p className="text-[11px] text-slate-400">Circadian Target: 7.5 - 8.0 hrs</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSleepModal(true)}
              aria-label="Add sleep log"
              className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-800 text-xs touch-manipulation"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="h-56 sm:h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeseriesData} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis domain={[4, 12]} stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', fontSize: '11px' }}
                />
                <Area
                  type="monotone"
                  dataKey="sleepHours"
                  name="Sleep (Hours)"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#sleepGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Daily Habit & Task Adherence */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-100 text-teal-800 shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Habit Adherence (%)</h3>
                <p className="text-[11px] text-slate-400">Consistency score over time</p>
              </div>
            </div>
          </div>

          <div className="h-56 sm:h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeseriesData} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', fontSize: '11px' }}
                />
                <Bar dataKey="adherence" name="Score (%)" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Modals */}
      {/* 1. Weight Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto safe-area-pb">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-5 w-5 text-emerald-600" />
                Record Weight Entry
              </h3>
              <button
                type="button"
                onClick={() => setShowWeightModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleWeightSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="300"
                  value={newWeight}
                  onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold min-h-[44px]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Fasted morning weight"
                  value={weightNote}
                  onChange={(e) => setWeightNote(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm min-h-[44px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWeightModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 min-h-[44px]"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Water Modal */}
      {showWaterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto safe-area-pb">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Droplets className="h-5 w-5 text-cyan-600" />
                Add Water Intake
              </h3>
              <button
                type="button"
                onClick={() => setShowWaterModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleWaterSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Amount (ml)</label>
                <input
                  type="number"
                  step="50"
                  min="50"
                  max="3000"
                  value={customWaterMl}
                  onChange={(e) => setCustomWaterMl(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-bold min-h-[44px]"
                  required
                />
              </div>

              <div className="flex gap-2">
                {[250, 500, 750].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCustomWaterMl(amt)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all min-h-[40px] ${
                      customWaterMl === amt
                        ? 'bg-cyan-100 text-cyan-900 border-cyan-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {amt} ml
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWaterModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md min-h-[44px]"
                >
                  Add Water
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Sleep Modal */}
      {showSleepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto safe-area-pb">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Moon className="h-5 w-5 text-indigo-600" />
                Record Sleep Entry
              </h3>
              <button
                type="button"
                onClick={() => setShowSleepModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSleepSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Bedtime</label>
                  <input
                    type="time"
                    value={sleepStart}
                    onChange={(e) => setSleepStart(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm min-h-[44px]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Wake-up Time</label>
                  <input
                    type="time"
                    value={sleepEnd}
                    onChange={(e) => setSleepEnd(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm min-h-[44px]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Sleep Quality (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSleepQuality(star)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all min-h-[44px] ${
                        sleepQuality === star
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {star}★
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSleepModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md min-h-[44px]"
                >
                  Log Sleep
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
