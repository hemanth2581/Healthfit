'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  Calendar,
  Sparkles,
  TrendingUp,
  Droplets,
  Moon,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { HealthCalculations, UserProfile } from '@/types/health';
import { WeeklyPlan, DayDietPlan, MealType } from '@/types/nutrition';
import { DailyProgress } from '@/types/progress';
import { localStore } from '@/lib/localStore';
import { getClientUserId } from '@/lib/anonymousUser';
import { HealthMetricSummary } from '@/components/dashboard/HealthMetricSummary';
import { MacroOverviewCards } from '@/components/dashboard/MacroOverviewCards';
import { TodayMealList } from '@/components/dashboard/TodayMealList';
import { DailyChecklist } from '@/components/dashboard/DailyChecklist';
import { getDayName } from '@/lib/utils';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<HealthCalculations | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setIsLoading(true);
    const userId = getClientUserId();
    const storedProfile = localStore.getProfile();
    const storedMetrics = localStore.getMetrics();
    const storedWeeklyPlan = localStore.getWeeklyPlan();

    if (storedProfile && storedMetrics && storedWeeklyPlan) {
      setProfile(storedProfile);
      setMetrics(storedMetrics);
      setWeeklyPlan(storedWeeklyPlan);

      const todayProgress = localStore.getTodayProgress(userId, storedMetrics.waterTarget);
      setProgress(todayProgress);
    }
    setIsLoading(false);
  };

  const handleToggleMeal = (mealType: MealType) => {
    if (!progress) return;
    const key = `${mealType}_completed` as keyof DailyProgress;
    const updated = {
      ...progress,
      [key]: !progress[key],
    };
    setProgress(updated);
    localStore.saveTodayProgress(updated);

    // Sync to background API
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((e) => console.warn('Progress sync note:', e));
  };

  const handleToggleWorkout = () => {
    if (!progress) return;
    const updated = {
      ...progress,
      workout_completed: !progress.workout_completed,
    };
    setProgress(updated);
    localStore.saveTodayProgress(updated);

    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((e) => console.warn('Progress sync note:', e));
  };

  const handleAddWater = (amountMl: number) => {
    if (!progress) return;
    const updated = {
      ...progress,
      water_completed_ml: (progress.water_completed_ml || 0) + amountMl,
    };
    setProgress(updated);
    localStore.saveTodayProgress(updated);

    localStore.addWaterLog({
      anonymous_user_id: getClientUserId(),
      amount_ml: amountMl,
      logged_at: new Date().toISOString(),
    });

    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((e) => console.warn('Progress sync note:', e));
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading your personalized dashboard...</p>
      </div>
    );
  }

  // Empty state: User hasn't created a plan yet
  if (!profile || !metrics || !weeklyPlan || !progress) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="p-4 rounded-3xl bg-emerald-500/10 text-emerald-400 w-fit mx-auto border border-emerald-500/20">
          <Sparkles className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">No Active Health Plan Found</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Welcome to HealthFit! Complete our fast 4-step onboarding to generate your personalized nutrition, hydration, sleep, and workout routine.
          </p>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          Create My Personalized Plan Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // Identify today's day plan
  const todayDayName = getDayName();
  const todayPlan: DayDietPlan =
    weeklyPlan.days.find((d) => d.dayName === todayDayName) || weeklyPlan.days[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {todayPlan.dayName} Overview
            </span>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Today&apos;s Health & Wellness Command Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/weekly"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-500/40 text-xs font-bold text-slate-200 hover:text-emerald-300 transition-colors"
          >
            <Calendar className="h-4 w-4 text-emerald-400" />
            7-Day Plan
          </Link>
          <Link
            href="/progress"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-xs font-bold text-slate-200 hover:text-cyan-300 transition-colors"
          >
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            Analytics
          </Link>
        </div>
      </div>

      {/* 1. Health Metrics Baseline */}
      <HealthMetricSummary profile={profile} metrics={metrics} />

      {/* 2. Today's Macro Targets Overview */}
      <MacroOverviewCards metrics={metrics} todayPlan={todayPlan} />

      {/* 3. Main Split: Today's Meals (Left/Main) & Daily Progress Checklist (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: 5 Meals with Gram/ML Quantities */}
        <div className="lg:col-span-2 space-y-6">
          <TodayMealList
            meals={todayPlan.meals}
            progress={progress}
            onToggleMeal={handleToggleMeal}
          />
        </div>

        {/* Right Column: Daily Checklist & Quick Hydration */}
        <div className="space-y-6">
          <DailyChecklist
            progress={progress}
            waterTargetMl={metrics.waterTarget}
            sleepTargetMinutes={metrics.sleepTargetMinutes}
            onToggleMeal={handleToggleMeal}
            onToggleWorkout={handleToggleWorkout}
            onAddWater={handleAddWater}
          />

          {/* Today's Workout Teaser Card */}
          {todayPlan.workoutPlan && (
            <div className="p-5 rounded-3xl bg-[#111928]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Today&apos;s Workout
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {todayPlan.workoutPlan.durationMinutes} mins
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{todayPlan.workoutPlan.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{todayPlan.workoutPlan.focus}</p>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Estimated Burn: <strong className="text-amber-300">{todayPlan.workoutPlan.estimatedBurnCalories} kcal</strong></span>
                <Link
                  href="/weekly"
                  className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  View Exercises →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
