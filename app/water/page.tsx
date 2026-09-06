'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Droplets, Sparkles, ArrowRight } from 'lucide-react';
import { UserProfile, HealthCalculations } from '@/types/health';
import { DailyProgress } from '@/types/progress';
import { localStore } from '@/lib/localStore';
import { getClientUserId } from '@/lib/anonymousUser';
import { HydrationScheduleView } from '@/components/hydration/HydrationScheduleView';

export default function WaterPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<HealthCalculations | null>(null);
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    const storedProfile = localStore.getProfile();
    const storedMetrics = localStore.getMetrics();
    const userId = getClientUserId();

    if (storedProfile && storedMetrics) {
      setProfile(storedProfile);
      setMetrics(storedMetrics);
      const todayProgress = localStore.getTodayProgress(userId, storedMetrics.waterTarget);
      setProgress(todayProgress);
    }
    setIsLoading(false);
  };

  const handleAddWater = (amountMl: number) => {
    if (!progress || !metrics) return;
    const userId = getClientUserId();
    const updated = {
      ...progress,
      water_completed_ml: (progress.water_completed_ml || 0) + amountMl,
    };
    setProgress(updated);
    localStore.saveTodayProgress(updated);

    localStore.addWaterLog({
      anonymous_user_id: userId,
      amount_ml: amountMl,
      logged_at: new Date().toISOString(),
    });

    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((e) => console.warn('Water sync note:', e));
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading hydration station...</p>
      </div>
    );
  }

  if (!profile || !metrics || !progress) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="p-4 rounded-3xl bg-sky-500/10 text-sky-400 w-fit mx-auto border border-sky-500/20">
          <Droplets className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">No Hydration Plan Found</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Calculate your personalized water target and 7-stage intake schedule by creating your health profile.
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
      <HydrationScheduleView
        weightKg={profile.weight_kg}
        activityLevel={profile.activity_level}
        progress={progress}
        onAddWater={handleAddWater}
      />
    </div>
  );
}
