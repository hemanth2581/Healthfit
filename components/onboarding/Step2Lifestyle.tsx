'use client';

import React from 'react';
import { Activity, Footprints, Dumbbell, Flame, Armchair, Bike, Zap } from 'lucide-react';
import { ActivityLevel, WorkoutPreference } from '@/types/health';

interface Step2Props {
  formData: {
    activity_level: ActivityLevel;
    average_steps?: number;
    workout_frequency?: number;
    workout_preference: WorkoutPreference;
  };
  updateField: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function Step2Lifestyle({ formData, updateField, errors }: Step2Props) {
  const activityLevels: {
    id: ActivityLevel;
    title: string;
    description: string;
    multiplier: string;
    icon: any;
  }[] = [
    {
      id: 'sedentary',
      title: 'Sedentary',
      description: 'Little to no physical activity; mostly sitting or desk job.',
      multiplier: '1.20x',
      icon: Armchair,
    },
    {
      id: 'lightly_active',
      title: 'Lightly Active',
      description: 'Light exercise or active lifestyle 1–3 days/week.',
      multiplier: '1.375x',
      icon: Footprints,
    },
    {
      id: 'moderately_active',
      title: 'Moderately Active',
      description: 'Moderate workouts or continuous movement 3–5 days/week.',
      multiplier: '1.55x',
      icon: Activity,
    },
    {
      id: 'very_active',
      title: 'Very Active',
      description: 'Hard workouts, sport drills or intense training 6–7 days/week.',
      multiplier: '1.725x',
      icon: Bike,
    },
    {
      id: 'extremely_active',
      title: 'Extremely Active',
      description: 'Elite athlete, two-a-day sessions, or heavy labor occupations.',
      multiplier: '1.90x',
      icon: Zap,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="h-6 w-6 text-emerald-400" />
          Step 2: Lifestyle & Movement
        </h2>
        <p className="text-sm text-slate-400">
          Your daily activity multiplier drives your Total Daily Energy Expenditure (TDEE).
        </p>
      </div>

      {/* Activity Level Cards */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-300">
          Daily Activity Level <span className="text-rose-400">*</span>
        </label>
        <div className="grid grid-cols-1 gap-3">
          {activityLevels.map((lvl) => {
            const Icon = lvl.icon;
            const isSelected = formData.activity_level === lvl.id;
            return (
              <button
                type="button"
                key={lvl.id}
                onClick={() => updateField('activity_level', lvl.id)}
                className={`flex items-start justify-between p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/25 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl mt-0.5 ${
                      isSelected ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-slate-800 text-emerald-400'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-base font-bold text-white flex items-center gap-2">
                      {lvl.title}
                      <span className="text-xs font-normal text-slate-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                        {lvl.multiplier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{lvl.description}</p>
                  </div>
                </div>
                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                    isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600'
                  }`}
                >
                  {isSelected && <div className="h-2 w-2 rounded-full bg-slate-950" />}
                </div>
              </button>
            );
          })}
        </div>
        {errors.activity_level && <p className="text-xs text-rose-400">{errors.activity_level}</p>}
      </div>

      {/* Steps & Workout Frequency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Average steps */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
            <Footprints className="h-4 w-4 text-emerald-400" />
            Average Daily Steps <span className="text-xs text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            type="number"
            step="500"
            min="0"
            max="100000"
            value={formData.average_steps || ''}
            onChange={(e) => updateField('average_steps', parseInt(e.target.value, 10) || 0)}
            placeholder="e.g. 8000"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />
        </div>

        {/* Workout frequency */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
            <Dumbbell className="h-4 w-4 text-cyan-400" />
            Planned Workouts / Week
          </label>
          <select
            value={formData.workout_frequency ?? 3}
            onChange={(e) => updateField('workout_frequency', parseInt(e.target.value, 10))}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          >
            <option value={0} className="bg-slate-900 text-white">0 days (Rest & Walks only)</option>
            <option value={2} className="bg-slate-900 text-white">2 days / week</option>
            <option value={3} className="bg-slate-900 text-white">3 days / week (Recommended)</option>
            <option value={4} className="bg-slate-900 text-white">4 days / week</option>
            <option value={5} className="bg-slate-900 text-white">5 days / week</option>
            <option value={6} className="bg-slate-900 text-white">6 days / week</option>
          </select>
        </div>
      </div>
    </div>
  );
}
