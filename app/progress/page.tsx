'use client';

import React from 'react';
import { ProgressAnalyticsView } from '@/components/progress/ProgressAnalyticsView';
import { useProfile, useMetrics, useWeightLogs, useWaterLogs, useSleepLogs, useAllProgress } from '@/lib/hooks';
import { localStore } from '@/lib/storage/localStore';
import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';

export default function ProgressPage() {
  const profile = useProfile();
  const metrics = useMetrics();
  const weightLogs = useWeightLogs();
  const waterLogs = useWaterLogs();
  const sleepLogs = useSleepLogs();
  const allProgress = useAllProgress();

  if (!profile || !metrics) {
    return (
      <div className="w-full max-w-md mx-auto my-16 p-8 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
          <TrendingUp className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Set Up Your Profile</h2>
        <p className="text-sm text-slate-500">
          Please complete your onboarding profile to begin logging weight and viewing health analytics.
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

  const handleAddWeight = (weight: number, notes?: string) => {
    const uId = profile.user_id || profile.anonymous_user_id || 'user';
    localStore.addWeightLog({
      user_id: uId,
      weight_kg: weight,
      notes,
      logged_at: new Date().toISOString(),
    });
  };

  const handleAddWater = (amountMl: number) => {
    const uId = profile.user_id || profile.anonymous_user_id || 'user';
    localStore.addWaterLog({
      user_id: uId,
      amount_ml: amountMl,
      logged_at: new Date().toISOString(),
    });
    const prog = localStore.getTodayProgress(uId);
    prog.water_completed_ml = (prog.water_completed_ml || 0) + amountMl;
    localStore.saveTodayProgress(prog);
  };

  const handleAddSleep = (start: string, end: string, durationMinutes: number, quality?: number) => {
    const uId = profile.user_id || profile.anonymous_user_id || 'user';
    localStore.addSleepLog({
      user_id: uId,
      sleep_start: start,
      sleep_end: end,
      duration_minutes: durationMinutes,
      quality_rating: (quality as 1 | 2 | 3 | 4 | 5) || 4,
      logged_at: new Date().toISOString(),
    });
    const prog = localStore.getTodayProgress(uId);
    prog.sleep_completed_minutes = durationMinutes;
    localStore.saveTodayProgress(prog);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <ProgressAnalyticsView
        profile={profile}
        metrics={metrics}
        weightLogs={weightLogs}
        waterLogs={waterLogs}
        sleepLogs={sleepLogs}
        allProgress={allProgress}
        onAddWeight={handleAddWeight}
        onAddWater={handleAddWater}
        onAddSleep={handleAddSleep}
      />
    </div>
  );
}
