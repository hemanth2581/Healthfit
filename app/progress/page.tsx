'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { UserProfile, HealthCalculations } from '@/types/health';
import { WeightLog, WaterLog, SleepLog, DailyProgress } from '@/types/progress';
import { localStore } from '@/lib/localStore';
import { getClientUserId } from '@/lib/anonymousUser';
import { ProgressAnalyticsView } from '@/components/progress/ProgressAnalyticsView';

export default function ProgressPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<HealthCalculations | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [allProgress, setAllProgress] = useState<Record<string, DailyProgress>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    const storedProfile = localStore.getProfile();
    const storedMetrics = localStore.getMetrics();
    const wLogs = localStore.getWeightLogs();
    const wtLogs = localStore.getWaterLogs();
    const sLogs = localStore.getSleepLogs();
    const prog = localStore.getAllProgress();

    setProfile(storedProfile);
    setMetrics(storedMetrics);
    setWeightLogs(wLogs);
    setWaterLogs(wtLogs);
    setSleepLogs(sLogs);
    setAllProgress(prog);
    setIsLoading(false);
  };

  const handleAddWeight = (weight: number, notes?: string) => {
    const userId = getClientUserId();
    const log: WeightLog = {
      anonymous_user_id: userId,
      weight_kg: weight,
      notes,
      logged_at: new Date().toISOString(),
    };
    localStore.addWeightLog(log);
    setWeightLogs((prev) => [log, ...prev]);

    // Background API
    fetch('/api/weight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    }).catch((e) => console.warn('Weight sync note:', e));
  };

  const handleAddWater = (amountMl: number) => {
    const userId = getClientUserId();
    const log: WaterLog = {
      anonymous_user_id: userId,
      amount_ml: amountMl,
      logged_at: new Date().toISOString(),
    };
    localStore.addWaterLog(log);
    setWaterLogs((prev) => [log, ...prev]);

    // Update today's progress
    const today = localStore.getTodayProgress(userId, metrics?.waterTarget || 2800);
    const updated = {
      ...today,
      water_completed_ml: (today.water_completed_ml || 0) + amountMl,
    };
    localStore.saveTodayProgress(updated);
    setAllProgress(localStore.getAllProgress());

    fetch('/api/water', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    }).catch((e) => console.warn('Water sync note:', e));
  };

  const handleAddSleep = (start: string, end: string, durationMinutes: number, quality?: number) => {
    const userId = getClientUserId();
    const log: SleepLog = {
      anonymous_user_id: userId,
      sleep_start: start,
      sleep_end: end,
      duration_minutes: durationMinutes,
      quality_rating: quality as any,
      logged_at: new Date().toISOString(),
    };
    localStore.addSleepLog(log);
    setSleepLogs((prev) => [log, ...prev]);

    // Update today's progress
    const today = localStore.getTodayProgress(userId, metrics?.waterTarget || 2800);
    const updated = {
      ...today,
      sleep_completed_minutes: durationMinutes,
    };
    localStore.saveTodayProgress(updated);
    setAllProgress(localStore.getAllProgress());

    fetch('/api/sleep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    }).catch((e) => console.warn('Sleep sync note:', e));
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading progress analytics...</p>
      </div>
    );
  }

  if (!profile || !metrics) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="p-4 rounded-3xl bg-cyan-500/10 text-cyan-400 w-fit mx-auto border border-cyan-500/20">
          <TrendingUp className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">No Health Plan Found</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Create your health baseline to unlock weight trends, fluid balance, and habit analytics.
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
