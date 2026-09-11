'use client';

import React from 'react';
import { SleepScheduleView } from '@/components/sleep/SleepScheduleView';
import { useProfile, useTodayProgress } from '@/lib/hooks';
import Link from 'next/link';
import { Moon, ArrowRight } from 'lucide-react';

export default function SleepPage() {
  const profile = useProfile();
  const todayProgress = useTodayProgress();

  if (!profile) {
    return (
      <div className="w-full max-w-md mx-auto my-16 p-8 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto shadow-xs">
          <Moon className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Set Up Your Profile</h2>
        <p className="text-sm text-slate-500">
          Please complete your onboarding profile to calculate your 90-minute circadian sleep cycles and wind-down protocol.
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
      <SleepScheduleView
        age={profile.age || 25}
        activityLevel={(profile.activity_level as any) || 'moderately_active'}
        goal={(profile.goal as any) || 'lose_weight'}
        progress={todayProgress || undefined}
      />
    </div>
  );
}
