'use client';

import React from 'react';
import { HydrationScheduleView } from '@/components/hydration/HydrationScheduleView';
import { useProfile, useTodayProgress } from '@/lib/hooks';
import { localStore } from '@/lib/storage/localStore';
import Link from 'next/link';
import { Droplets, ArrowRight } from 'lucide-react';
import { getTodayDateString } from '@/lib/utils/dates';

export default function WaterPage() {
  const profile = useProfile();
  const todayProgress = useTodayProgress();

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto">
            <Droplets className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Set Up Your Profile</h2>
          <p className="text-sm text-slate-500">
            Please complete your onboarding profile to calculate your exact daily water requirement and schedule.
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

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6">
      <HydrationScheduleView
        weightKg={profile.weight_kg || profile.weight || 70}
        activityLevel={(profile.activity_level as any) || 'moderately_active'}
        progress={
          todayProgress || {
            progress_date: getTodayDateString(),
            breakfast_completed: false,
            morning_snack_completed: false,
            lunch_completed: false,
            evening_snack_completed: false,
            dinner_completed: false,
            workout_completed: false,
            water_completed_ml: 0,
            sleep_completed_minutes: 0,
            completion_percentage: 0,
          }
        }
        onAddWater={handleAddWater}
      />
    </div>
  );
}
