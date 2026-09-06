'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sparkles, ArrowRight } from 'lucide-react';
import { UserProfile, HealthCalculations } from '@/types/health';
import { DailyProgress } from '@/types/progress';
import { localStore } from '@/lib/localStore';
import { getClientUserId } from '@/lib/anonymousUser';
import { SleepScheduleView } from '@/components/sleep/SleepScheduleView';

export default function SleepPage() {
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

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading sleep & recovery center...</p>
      </div>
    );
  }

  if (!profile || !metrics || !progress) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="p-4 rounded-3xl bg-indigo-500/10 text-indigo-400 w-fit mx-auto border border-indigo-500/20">
          <Moon className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">No Sleep Plan Found</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Calculate your circadian bedtime recommendation and 4-step wind-down protocol by creating your health profile.
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
      <SleepScheduleView
        age={profile.age}
        activityLevel={profile.activity_level}
        goal={profile.goal}
        progress={progress}
      />
    </div>
  );
}
