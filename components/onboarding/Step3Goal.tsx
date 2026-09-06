'use client';

import React from 'react';
import { Target, TrendingDown, Scale, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import { Goal, GoalPace } from '@/types/health';

interface Step3Props {
  formData: {
    goal: Goal;
    goal_pace: GoalPace;
  };
  updateField: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function Step3Goal({ formData, updateField, errors }: Step3Props) {
  const goals: {
    id: Goal;
    title: string;
    description: string;
    icon: any;
    color: string;
    borderColor: string;
    badge: string;
  }[] = [
    {
      id: 'lose_weight',
      title: 'Lose Weight & Fat',
      description: 'Burn fat progressively while protecting muscle with a safe, calculated caloric deficit.',
      icon: TrendingDown,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/50',
      badge: 'Safe Deficit (~15-20%)',
    },
    {
      id: 'maintain_weight',
      title: 'Maintain Weight & Vitality',
      description: 'Optimize energy levels, stabilize body composition, and sustain peak metabolic health.',
      icon: Scale,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/50',
      badge: 'TDEE Maintenance',
    },
    {
      id: 'gain_weight',
      title: 'Gain Lean Muscle Mass',
      description: 'Support muscular hypertrophy and strength gains with a conservative, controlled surplus.',
      icon: TrendingUp,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/50',
      badge: 'Safe Surplus (~10-15%)',
    },
    {
      id: 'improve_fitness',
      title: 'Improve Overall Fitness & Recomp',
      description: 'Boost endurance, strength, flexibility, and lean body recomposition without extreme weight shifts.',
      icon: Sparkles,
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/50',
      badge: 'High Protein Recomp',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Target className="h-6 w-6 text-emerald-400" />
          Step 3: Primary Health Goal
        </h2>
        <p className="text-sm text-slate-400">
          We ensure caloric targets adhere to safe clinical guidelines—preventing extreme or unsafe restrictions.
        </p>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {goals.map((g) => {
          const Icon = g.icon;
          const isSelected = formData.goal === g.id;
          return (
            <button
              type="button"
              key={g.id}
              onClick={() => updateField('goal', g.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? `bg-emerald-500/15 ${g.borderColor} text-white shadow-lg shadow-emerald-500/10`
                  : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/25 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className={`p-2.5 rounded-xl bg-slate-800/90 ${g.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                  {g.badge}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{g.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{g.description}</p>
              </div>
            </button>
          );
        })}
      </div>
      {errors.goal && <p className="text-xs text-rose-400">{errors.goal}</p>}

      {/* Goal Pace Selector (when weight loss or gain is chosen) */}
      {(formData.goal === 'lose_weight' || formData.goal === 'gain_weight') && (
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Pace Preference
            </label>
            <span className="text-xs text-slate-400">Conservative targets protect metabolic health</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'conservative', label: 'Conservative', desc: 'Gentle & Sustainable' },
              { id: 'moderate', label: 'Moderate', desc: 'Standard Balanced Pace' },
              { id: 'aggressive', label: 'Accelerated', desc: 'Higher Deficit/Surplus' },
            ].map((pace) => (
              <button
                type="button"
                key={pace.id}
                onClick={() => updateField('goal_pace', pace.id)}
                className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                  formData.goal_pace === pace.id
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                    : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-semibold">{pace.label}</div>
                <div className="text-[10px] text-slate-500">{pace.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
