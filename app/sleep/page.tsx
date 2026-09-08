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
      <div className="min-h-screen bg-slate-50/50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
            <Moon className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Set Up Your Profile</h2>
          <p className="text-sm text-slate-500">
            Please complete your onboarding profile to calculate your 90-minute circadian sleep cycles and wind-down protocol.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all"
          >
            <span>Start Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6">
      <SleepScheduleView
        age={profile.age || 25}
        activityLevel={(profile.activity_level as any) || 'moderately_active'}
        goal={(profile.goal as any) || 'lose_weight'}
        progress={todayProgress || undefined}
      />
    </div>
  );
}
