'use client';

import React from 'react';
import { WeeklyPlanView } from '@/components/weekly/WeeklyPlanView';
import { useProfile, useMetrics, useWeeklyPlan } from '@/lib/hooks';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

export default function WeeklyPlanPage() {
  const profile = useProfile();
  const metrics = useMetrics();
  const weeklyPlan = useWeeklyPlan();

  if (!profile) {
    return (
      <div className="w-full max-w-md mx-auto my-16 p-8 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
          <Calendar className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Set Up Your Plan</h2>
        <p className="text-sm text-slate-500">
          Please complete your onboarding profile to view your personalized 7-day meal and workout schedule.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
        >
          <span>Start Onboarding</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <WeeklyPlanView profile={profile} metrics={metrics} weeklyPlan={weeklyPlan} />
    </div>
  );
}
