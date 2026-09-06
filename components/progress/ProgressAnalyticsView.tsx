'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Scale,
  Droplets,
  Moon,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
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
import { getTodayDateString } from '@/lib/utils';

interface ProgressAnalyticsProps {
  profile: UserProfile;
  metrics: HealthCalculations;
  weightLogs: WeightLog[];
  waterLogs: WaterLog[];
  sleepLogs: SleepLog[];
  allProgress: Record<string, DailyProgress>;
  onAddWeight: (weight: number, notes?: string) => void;
  onAddWater: (amountMl: number) => void;
  onAddSleep: (start: string, end: string, durationMinutes: number, quality?: number) => void;
}

export function ProgressAnalyticsView({
  profile,
  metrics,
  weightLogs,
  waterLogs,
  sleepLogs,
  allProgress,
  onAddWeight,
  onAddWater,
  onAddSleep,
}: ProgressAnalyticsProps) {
  // Modal states
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);

  // Form states
  const [newWeight, setNewWeight] = useState(profile.weight_kg);
  const [weightNote, setWeightNote] = useState('');
  const [customWaterMl, setCustomWaterMl] = useState(500);
  const [sleepStart, setSleepStart] = useState('22:30');
  const [sleepEnd, setSleepEnd] = useState('06:30');
  const [sleepQuality, setSleepQuality] = useState(4);

  // Prepare Last 7 Days Progress Data
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    const p = allProgress[dateStr];
    return {
      date: dateStr,
      day: dayName,
      completion: p ? p.completion_percentage : 0,
      waterLitres: p ? Math.round((p.water_completed_ml / 1000) * 10) / 10 : 0,
      waterTargetLitres: Math.round((metrics.waterTarget / 1000) * 10) / 10,
      sleepHours: p ? Math.round((p.sleep_completed_minutes / 60) * 10) / 10 : 8.0,
      sleepTargetHours: 8.0,
    };
  });

  // Prepare Weight History data (chronological)
  const weightChartData = [...weightLogs]
    .reverse()
    .map((log) => ({
      date: new Date(log.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: log.weight_kg,
    }));

  if (weightChartData.length === 0) {
    weightChartData.push({
      date: 'Current',
      weight: profile.weight_kg,
    });
  }

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeight >= 20 && newWeight <= 300) {
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
    <div className="space-y-8">
      {/* Top Banner with Quick Logging Actions */}
      <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Health Analytics & Progress Tracking
          </h2>
          <p className="text-xs text-slate-400">
            Monitor weight trends, fluid balance, circadian sleep patterns, and weekly adherence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowWeightModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-200 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
          >
            <Scale className="h-3.5 w-3.5 text-emerald-400" />
            Log Weight
          </button>
          <button
            type="button"
            onClick={() => setShowWaterModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-200 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
          >
            <Droplets className="h-3.5 w-3.5 text-cyan-400" />
            Log Water
          </button>
          <button
            type="button"
            onClick={() => setShowSleepModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-200 hover:border-indigo-500/40 hover:text-indigo-300 transition-colors"
          >
            <Moon className="h-3.5 w-3.5 text-indigo-400" />
            Log Sleep
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Weight Trend Chart */}
        <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Body Weight Trend</h3>
                <p className="text-[11px] text-slate-400">Baseline: {profile.weight_kg} kg • Goal: {profile.goal.replace('_', ' ')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowWeightModal(true)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 text-xs"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#34d399' }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Weekly Habits & Task Completion Chart */}
        <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Daily Plan Completion (%)</h3>
                <p className="text-[11px] text-slate-400">7-Day Consistency & Habit Score</p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="completion" name="Adherence (%)" fill="#38bdf8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Hydration Balance Chart */}
        <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                <Droplets className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Hydration Intake (Litres)</h3>
                <p className="text-[11px] text-slate-400">Target: {(metrics.waterTarget / 1000).toFixed(1)} L/day</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowWaterModal(true)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-sky-500/20 text-slate-400 hover:text-sky-400 text-xs"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend />
                <Bar dataKey="waterLitres" name="Actual (L)" fill="#0284c7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="waterTargetLitres" name="Target (L)" fill="#1e293b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Sleep Duration & Recovery Chart */}
        <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Moon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Sleep Duration (Hours)</h3>
                <p className="text-[11px] text-slate-400">Target: 8.0 Hours / night</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSleepModal(true)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 text-xs"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7Days} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[4, 12]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="sleepHours"
                  name="Sleep (Hours)"
                  stroke="#818cf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#sleepGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Modals for Quick Logging */}
      {/* 1. Weight Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-400" />
              Record Weight Entry
            </h3>
            <form onSubmit={handleWeightSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="300"
                  value={newWeight}
                  onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Morning fasted weigh-in"
                  value={weightNote}
                  onChange={(e) => setWeightNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWeightModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-bold text-slate-950 shadow-md hover:scale-105 transition-transform"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Droplets className="h-5 w-5 text-cyan-400" />
              Log Water Intake
            </h3>
            <form onSubmit={handleWaterSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[250, 500, 750].map((amount) => (
                  <button
                    type="button"
                    key={amount}
                    onClick={() => setCustomWaterMl(amount)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                      customWaterMl === amount
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-white/10 text-slate-400'
                    }`}
                  >
                    +{amount} ml
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Custom Amount (ml)</label>
                <input
                  type="number"
                  step="50"
                  min="50"
                  max="3000"
                  value={customWaterMl}
                  onChange={(e) => setCustomWaterMl(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWaterModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-xs font-bold text-slate-950 shadow-md hover:scale-105 transition-transform"
                >
                  Add Intake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Sleep Modal */}
      {showSleepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Moon className="h-5 w-5 text-indigo-400" />
              Log Sleep Duration
            </h3>
            <form onSubmit={handleSleepSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Bedtime</label>
                  <input
                    type="time"
                    value={sleepStart}
                    onChange={(e) => setSleepStart(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Wake Up Time</label>
                  <input
                    type="time"
                    value={sleepEnd}
                    onChange={(e) => setSleepEnd(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Sleep Quality Rating (1–5)</label>
                <div className="flex items-center justify-between gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setSleepQuality(num)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold ${
                        sleepQuality === num
                          ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                          : 'bg-slate-950 border-white/10 text-slate-400'
                      }`}
                    >
                      {num} ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSleepModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-xs font-bold text-slate-950 shadow-md hover:scale-105 transition-transform"
                >
                  Save Sleep
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
