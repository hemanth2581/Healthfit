'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Heart, Gauge, Flame, Scale, Ruler, Sparkles } from 'lucide-react';
import { HealthCalculations, UserProfile } from '@/types/health';

interface HealthMetricSummaryProps {
  profile: UserProfile;
  metrics: HealthCalculations;
}

export function HealthMetricSummary({ profile, metrics }: HealthMetricSummaryProps) {
  const getBmiBadgeClass = (category: string) => {
    switch (category) {
      case 'Underweight':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Normal weight':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Overweight':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" />
              Your Health Metrics Baseline
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Computed via Mifflin-St Jeor equation and standard activity expenditure coefficients.
          </p>
        </div>

        <Link
          href="/onboarding"
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-500/40 text-xs font-semibold text-slate-300 hover:text-emerald-300 transition-colors"
        >
          Recalculate Metrics
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Weight */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Scale className="h-3.5 w-3.5 text-emerald-400" />
            Weight
          </div>
          <div className="text-lg font-bold text-white">{profile.weight_kg} <span className="text-xs font-normal text-slate-400">kg</span></div>
        </div>

        {/* Height */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Ruler className="h-3.5 w-3.5 text-cyan-400" />
            Height
          </div>
          <div className="text-lg font-bold text-white">{profile.height_cm} <span className="text-xs font-normal text-slate-400">cm</span></div>
        </div>

        {/* BMI */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 text-rose-400" />
            BMI Score
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">{metrics.bmi}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getBmiBadgeClass(metrics.bmiCategory)}`}>
              {metrics.bmiCategory}
            </span>
          </div>
        </div>

        {/* BMR */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5 text-amber-400" />
            BMR (Basal)
          </div>
          <div className="text-lg font-bold text-white">{metrics.bmr} <span className="text-xs font-normal text-slate-400">kcal</span></div>
        </div>

        {/* TDEE */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-orange-400" />
            TDEE Energy
          </div>
          <div className="text-lg font-bold text-white">{metrics.tdee} <span className="text-xs font-normal text-slate-400">kcal</span></div>
        </div>

        {/* Target */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
          <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            Daily Target
          </div>
          <div className="text-lg font-bold text-emerald-300">{metrics.targetCalories} <span className="text-xs font-normal text-emerald-400/80">kcal</span></div>
        </div>
      </div>
    </div>
  );
}
