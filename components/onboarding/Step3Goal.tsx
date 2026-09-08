'use client';

import React from 'react';
import { Target, Flame, Dumbbell, Scale, ShieldCheck } from 'lucide-react';
import { Goal, GoalPace } from '@/types/health';
import { FullOnboardingInput } from '@/lib/validation/schemas';

interface Step3Props {
  formData: {
    goal: Goal;
    goal_pace: GoalPace;
    target_weight_kg?: number;
    weight_kg: number;
  };
  updateField: <K extends keyof FullOnboardingInput>(field: K, value: FullOnboardingInput[K]) => void;
  errors: Record<string, string>;
}

export function Step3Goal({ formData, updateField, errors }: Step3Props) {
  const goals: {
    id: Goal;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
    badge: string;
  }[] = [
    {
      id: 'lose_weight',
      title: 'Lose Fat',
      description: 'Burn body fat progressively with a safe, calculated caloric deficit while protecting lean muscle.',
      icon: <Flame className="h-6 w-6 text-amber-500" />,
      color: 'text-amber-500',
      borderColor: 'border-amber-500/60 ring-2 ring-amber-500/20',
      badge: 'Safe Deficit (~15-20%)',
    },
    {
      id: 'gain_weight',
      title: 'Build Muscle',
      description: 'Support muscular hypertrophy and strength with a conservative, high-protein caloric surplus.',
      icon: <Dumbbell className="h-6 w-6 text-emerald-600" />,
      color: 'text-emerald-600',
      borderColor: 'border-emerald-500/60 ring-2 ring-emerald-500/20',
      badge: 'Safe Surplus (~10-15%)',
    },
    {
      id: 'maintain_weight',
      title: 'Maintain Weight',
      description: 'Optimize energy levels, stabilize body composition, and sustain peak metabolic performance.',
      icon: <Scale className="h-6 w-6 text-teal-600" />,
      color: 'text-teal-600',
      borderColor: 'border-teal-500/60 ring-2 ring-teal-500/20',
      badge: 'TDEE Maintenance',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Target className="h-6 w-6 text-emerald-600" />
          Step 3: What&apos;s your main goal?
        </h2>
        <p className="text-sm text-slate-500">
          We ensure caloric targets adhere to safe clinical guidelines—preventing extreme or unsafe restrictions.
        </p>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {goals.map((g) => {
          const isSelected = formData.goal === g.id;
          return (
            <button
              type="button"
              key={g.id}
              onClick={() => updateField('goal', g.id)}
              className={`p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? `bg-white ${g.borderColor} text-slate-900 shadow-md`
                  : 'bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 flex items-center justify-center">
                    {g.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                    {g.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{g.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{g.description}</p>
              </div>
            </button>
          );
        })}
      </div>
      {errors.goal && <p className="text-xs text-rose-500">{errors.goal}</p>}

      {/* Optional Target Weight Input */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-sm font-semibold text-slate-800">
            Target Weight <span className="text-xs font-normal text-slate-500">(Optional)</span>
          </label>
          <span className="text-xs text-slate-500">Current weight: {formData.weight_kg || '--'} kg</span>
        </div>
        <div className="relative">
          <input
            type="number"
            min={20}
            max={300}
            step={0.5}
            value={formData.target_weight_kg || ''}
            onChange={(e) => {
              const val = e.target.value ? parseFloat(e.target.value) : undefined;
              updateField('target_weight_kg', val);
            }}
            placeholder={`e.g. ${formData.goal === 'lose_weight' ? (formData.weight_kg ? formData.weight_kg - 5 : 68) : (formData.weight_kg ? formData.weight_kg + 3 : 75)}`}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">kg</span>
        </div>
      </div>

      {/* Goal Pace Selector (when weight loss or gain is chosen) */}
      {(formData.goal === 'lose_weight' || formData.goal === 'gain_weight') && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Pace Preference
            </label>
            <span className="text-xs text-slate-500">Conservative targets protect metabolic health</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {([
              { id: 'conservative', label: 'Conservative', desc: 'Gentle & Sustainable' },
              { id: 'moderate', label: 'Moderate', desc: 'Balanced Standard' },
              { id: 'aggressive', label: 'Accelerated', desc: 'Higher Deficit/Surplus' },
            ] as const).map((pace) => (
              <button
                type="button"
                key={pace.id}
                onClick={() => updateField('goal_pace', pace.id)}
                className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                  formData.goal_pace === pace.id
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-semibold">{pace.label}</div>
                <div className={`text-[10px] ${formData.goal_pace === pace.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {pace.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
