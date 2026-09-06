'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { WeeklyPlan } from '@/types/nutrition';
import { localStore } from '@/lib/localStore';
import { WeeklyPlanView } from '@/components/weekly/WeeklyPlanView';

export default function WeeklyPlanPage() {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const plan = localStore.getWeeklyPlan();
    setWeeklyPlan(plan);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading your weekly plan...</p>
      </div>
    );
  }

  if (!weeklyPlan) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="p-4 rounded-3xl bg-emerald-500/10 text-emerald-400 w-fit mx-auto border border-emerald-500/20">
          <Calendar className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">No Weekly Plan Generated Yet</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Generate your personalized 7-day meal and workout rotation by completing onboarding.
          </p>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          Create Plan Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <WeeklyPlanView plan={weeklyPlan} />
    </div>
  );
}
