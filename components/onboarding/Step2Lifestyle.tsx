'use client';

import React from 'react';
import { Activity, Footprints, Dumbbell, Armchair, Bike, Zap, type LucideIcon } from 'lucide-react';
import { ActivityLevel, WorkoutPreference } from '@/types/health';
import { FullOnboardingInput } from '@/lib/validation';

interface Step2Props {
  formData: {
    activity_level: ActivityLevel;
    average_steps?: number;
    workout_frequency?: number;
    workout_preference?: WorkoutPreference;
  };
  updateField: <K extends keyof FullOnboardingInput>(field: K, value: FullOnboardingInput[K]) => void;
  errors?: Record<string, string>;
}

export function Step2Lifestyle({ formData, updateField, errors = {} }: Step2Props) {
  const activityLevels: {
    id: ActivityLevel;
    title: string;
    description: string;
    multiplier: string;
    icon: LucideIcon;
  }[] = [
    {
      id: 'sedentary',
      title: 'Sedentary',
      description: 'Desk job, minimal exercise, under 5,000 steps/day.',
      multiplier: '1.20x',
      icon: Armchair,
    },
    {
      id: 'lightly_active',
      title: 'Lightly Active',
      description: 'Light daily walking or light workouts 1–3 days/week.',
      multiplier: '1.375x',
      icon: Footprints,
    },
    {
      id: 'moderately_active',
      title: 'Moderately Active',
      description: 'Moderate workouts or active routine 3–5 days/week.',
      multiplier: '1.55x',
      icon: Activity,
    },
    {
      id: 'very_active',
      title: 'Very Active',
      description: 'Intense training or demanding physical routine 6–7 days/week.',
      multiplier: '1.725x',
      icon: Bike,
    },
    {
      id: 'extremely_active',
      title: 'Extremely Active',
      description: 'Hard physical labor or intense athletic training twice daily.',
      multiplier: '1.90x',
      icon: Zap,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <Activity className="h-6 w-6 text-emerald-600 shrink-0" />
          <span>Step 2: Lifestyle & Activity</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Your daily activity multiplier determines your Total Daily Energy Expenditure (TDEE).
        </p>
      </div>

      {/* Activity Level Cards */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Daily Activity Level <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
          {activityLevels.map((lvl) => {
            const Icon = lvl.icon;
            const isSelected = formData.activity_level === lvl.id;
            return (
              <button
                type="button"
                key={lvl.id}
                onClick={() => updateField('activity_level', lvl.id as any)}
                className={`flex items-start justify-between p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer touch-manipulation min-h-[56px] active:scale-[0.99] ${
                  isSelected
                    ? 'bg-emerald-50/90 border-emerald-500 text-slate-900 shadow-md shadow-emerald-500/10'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3.5 sm:gap-4">
                  <div
                    className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                      isSelected ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>{lvl.title}</span>
                      <span className="text-[11px] font-semibold text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-100/80 border border-emerald-200">
                        {lvl.multiplier}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{lvl.description}</p>
                  </div>
                </div>
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                    isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
        {errors.activity_level && <p className="text-xs font-bold text-rose-600">{errors.activity_level}</p>}
      </div>

      {/* Steps & Workout Frequency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Average steps */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Footprints className="h-4 w-4 text-emerald-600" />
            <span>Average Daily Steps</span>
            <span className="text-[11px] text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <input
            type="number"
            step="500"
            min="0"
            max="100000"
            value={formData.average_steps || ''}
            onChange={(e) => updateField('average_steps', parseInt(e.target.value, 10) || 0)}
            placeholder="e.g. 8000"
            className="w-full px-4 py-3 min-h-[48px] rounded-2xl bg-white border border-slate-300 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
          />
        </div>

        {/* Workout frequency */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Dumbbell className="h-4 w-4 text-teal-600" />
            <span>Planned Workouts / Week</span>
          </label>
          <select
            value={formData.workout_frequency ?? 3}
            onChange={(e) => updateField('workout_frequency', parseInt(e.target.value, 10))}
            className="w-full px-4 py-3 min-h-[48px] rounded-2xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
          >
            <option value={0}>0 days (Rest & Walks only)</option>
            <option value={2}>2 days / week</option>
            <option value={3}>3 days / week (Recommended)</option>
            <option value={4}>4 days / week</option>
            <option value={5}>5 days / week</option>
            <option value={6}>6 days / week</option>
          </select>
        </div>
      </div>
    </div>
  );
}

