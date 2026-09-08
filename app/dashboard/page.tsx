'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dumbbell,
  Droplets,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { localStore } from '@/lib/storage/localStore';
import { useProfile, useMetrics, useWeeklyPlan } from '@/lib/hooks';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MacroOverviewCards } from '@/components/dashboard/MacroOverviewCards';
import { TodayMealList } from '@/components/dashboard/TodayMealList';
import { DailyChecklist } from '@/components/dashboard/DailyChecklist';
import { CompleteDayModal } from '@/components/dashboard/CompleteDayModal';
import { MealAlternative } from '@/lib/nutrition/dietGenerator';
import { MealType } from '@/types/nutrition';
import { DailyProgress } from '@/types/progress';
import { getTodayDateString } from '@/lib/utils/dates';
import Link from 'next/link';

import { syncDailyProgressToSupabase } from '@/lib/supabase/database';

export default function DashboardPage() {
  const router = useRouter();
  const profile = useProfile();
  const metrics = useMetrics();
  const weeklyPlan = useWeeklyPlan();

  const [loading, setLoading] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local state for today's progress & points
  const [progressState, setProgressState] = useState<DailyProgress | null>(null);
  const [userPoints, setUserPoints] = useState<number>(profile?.points || 120);
  const [userStreak, setUserStreak] = useState<number>(profile?.streak || 3);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronize on mount and storage events
  useEffect(() => {
    const currentProfile = localStore.getProfile();
    if (!currentProfile) {
      router.push('/onboarding');
      return;
    }

    const uId = currentProfile.user_id || currentProfile.anonymous_user_id || 'user';
    const prog = localStore.getTodayProgress(uId);
    setProgressState(prog);

    if (currentProfile.points) setUserPoints(currentProfile.points);
    if (currentProfile.streak) setUserStreak(currentProfile.streak);

    setLoading(false);
  }, [router]);

  // Today's day plan
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];
  const currentDayPlan =
    weeklyPlan?.days.find((d) => d.dayName === todayName) || weeklyPlan?.days[0];

  // Toggle meal completion
  const handleToggleMeal = (mealType: MealType) => {
    if (!progressState || !profile) return;
    const uId = profile.user_id || profile.anonymous_user_id || 'user';
    const updated = { ...progressState };

    let addedPoints = 0;
    if (mealType === 'breakfast') {
      updated.breakfast_completed = !updated.breakfast_completed;
      addedPoints = updated.breakfast_completed ? 10 : -10;
    } else if (mealType === 'morning_snack') {
      updated.morning_snack_completed = !updated.morning_snack_completed;
      addedPoints = updated.morning_snack_completed ? 5 : -5;
    } else if (mealType === 'lunch') {
      updated.lunch_completed = !updated.lunch_completed;
      addedPoints = updated.lunch_completed ? 10 : -10;
    } else if (mealType === 'evening_snack') {
      updated.evening_snack_completed = !updated.evening_snack_completed;
      addedPoints = updated.evening_snack_completed ? 5 : -5;
    } else if (mealType === 'dinner') {
      updated.dinner_completed = !updated.dinner_completed;
      addedPoints = updated.dinner_completed ? 10 : -10;
    }

    localStore.saveTodayProgress(updated);
    setProgressState(updated);

    const newPoints = Math.max(0, userPoints + addedPoints);
    setUserPoints(newPoints);
    const updatedProfile = { ...profile, points: newPoints };
    localStore.setProfile(updatedProfile);

    // Asynchronously sync to Supabase database
    syncDailyProgressToSupabase(uId, {
      ...updated,
      points_earned: newPoints,
    });

    if (addedPoints > 0) {
      showToast(`+${addedPoints} Health Points for completing ${mealType.replace('_', ' ')}!`);
    } else {
      showToast(`Unchecked ${mealType.replace('_', ' ')}`);
    }
  };

  // Replace meal in weekly plan
  const handleReplaceMeal = (mealType: MealType, alt: MealAlternative) => {
    if (!weeklyPlan) return;
    const updatedPlan = { ...weeklyPlan };
    const day = updatedPlan.days.find((d) => d.dayName === todayName) || updatedPlan.days[0];
    if (day) {
      const mealIndex = day.meals.findIndex((m) => m.mealType === mealType);
      if (mealIndex >= 0) {
        day.meals[mealIndex] = {
          ...day.meals[mealIndex],
          mealName: alt.title,
          totalCalories: alt.calories,
          protein: alt.protein,
          carbs: alt.carbs,
          fat: alt.fat,
          foodItems: alt.items.map((it) => ({
            foodId: it.name.toLowerCase().replace(/\s+/g, '_'),
            name: it.name,
            quantity: it.qty,
            unit: it.unit,
            calories: Math.round(alt.calories / alt.items.length),
            protein: Math.round((alt.protein / alt.items.length) * 10) / 10,
            carbs: Math.round((alt.carbs / alt.items.length) * 10) / 10,
            fat: Math.round((alt.fat / alt.items.length) * 10) / 10,
            fiber: 2,
          })),
        };
        localStore.setWeeklyPlan(updatedPlan);
        showToast(`✓ Replaced ${mealType.replace('_', ' ')} with ${alt.title}!`);
      }
    }
  };

  // Add water
  const handleAddWater = (amountMl: number) => {
    if (!progressState || !profile) return;
    const uId = profile.user_id || profile.anonymous_user_id || 'user';
    const updated = { ...progressState };
    updated.water_completed_ml = (updated.water_completed_ml || 0) + amountMl;
    localStore.saveTodayProgress(updated);
    setProgressState(updated);

    localStore.addWaterLog({
      amount_ml: amountMl,
      logged_at: new Date().toISOString(),
      user_id: uId,
    });

    const target = metrics?.waterTarget || 2500;
    let earnedPts = 0;
    if (updated.water_completed_ml >= target && (progressState.water_completed_ml || 0) < target) {
      earnedPts = 20;
      const newPts = userPoints + earnedPts;
      setUserPoints(newPts);
      const updatedProfile = { ...profile, points: newPts };
      localStore.setProfile(updatedProfile);
      showToast('🎉 Hydration Target Met! +20 Health Points earned.');
    } else {
      showToast(`+${amountMl} ml logged (${updated.water_completed_ml} / ${target} ml)`);
    }

    // Asynchronously sync to Supabase database
    syncDailyProgressToSupabase(uId, {
      ...updated,
      points_earned: userPoints + earnedPts,
    });
  };

  // Toggle workout
  const handleToggleWorkout = () => {
    if (!progressState || !profile) return;
    const uId = profile.user_id || profile.anonymous_user_id || 'user';
    const updated = { ...progressState };
    updated.workout_completed = !updated.workout_completed;
    localStore.saveTodayProgress(updated);
    setProgressState(updated);

    const ptsDelta = updated.workout_completed ? 20 : -20;
    const newPts = Math.max(0, userPoints + ptsDelta);
    setUserPoints(newPts);
    const updatedProfile = { ...profile, points: newPts };
    localStore.setProfile(updatedProfile);

    // Asynchronously sync to Supabase database
    syncDailyProgressToSupabase(uId, {
      ...updated,
      points_earned: newPts,
    });

    if (updated.workout_completed) {
      showToast('🔥 Workout Completed! +20 Health Points earned.');
    } else {
      showToast('Workout unmarked');
    }
  };

  // Toggle sleep
  const handleToggleSleep = () => {
    router.push('/sleep');
  };

  // Calculate completion breakdown for Complete Day modal
  const calculateBreakdown = () => {
    if (!progressState) return { score: 0, meals: 0, workout: 0, hydration: 0, sleep: 0 };

    let mealCount = 0;
    if (progressState.breakfast_completed) mealCount++;
    if (progressState.morning_snack_completed) mealCount++;
    if (progressState.lunch_completed) mealCount++;
    if (progressState.evening_snack_completed) mealCount++;
    if (progressState.dinner_completed) mealCount++;

    const mealPercent = Math.round((mealCount / 5) * 100);
    const workoutPercent = progressState.workout_completed ? 100 : 0;
    const waterTarget = metrics?.waterTarget || 2500;
    const hydrationPercent = Math.min(100, Math.round(((progressState.water_completed_ml || 0) / waterTarget) * 100));
    const sleepPercent = progressState.sleep_completed_minutes >= 360 ? 100 : Math.round(((progressState.sleep_completed_minutes || 0) / 480) * 100);

    const overallScore = Math.round(
      mealPercent * 0.4 + workoutPercent * 0.25 + hydrationPercent * 0.2 + sleepPercent * 0.15
    );

    return {
      score: overallScore,
      meals: mealPercent,
      workout: workoutPercent,
      hydration: hydrationPercent,
      sleep: sleepPercent,
    };
  };

  // Complete Day Action
  const handleCompleteDay = () => {
    if (!progressState || !profile) return;
    const uId = profile.user_id || profile.anonymous_user_id || 'user';
    const breakdown = calculateBreakdown();
    const isAlready = Boolean(progressState.day_completed);

    if (!isAlready) {
      const pointsToAdd = Math.max(10, Math.round(breakdown.score * 0.8));
      const newPoints = userPoints + pointsToAdd;
      const newStreak = userStreak + 1;

      setUserPoints(newPoints);
      setUserStreak(newStreak);

      const updatedProfile = { ...profile, points: newPoints, streak: newStreak };
      localStore.setProfile(updatedProfile);

      const updated = {
        ...progressState,
        day_completed: true,
        points_awarded: pointsToAdd,
      };
      localStore.saveTodayProgress(updated);
      setProgressState(updated);

      // Sync completed day to Supabase
      syncDailyProgressToSupabase(uId, {
        ...updated,
        day_completed: true,
        points_earned: newPoints,
      });
    }

    setShowCompletionModal(true);
  };

  if (loading || !profile || !metrics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        <p className="text-sm font-semibold text-slate-600">Loading your HealthFit plan...</p>
      </div>
    );
  }

  const breakdown = calculateBreakdown();

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-4 z-50 rounded-2xl bg-white border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 shadow-xl flex items-center gap-2 animate-in slide-in-from-top-4">
            <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Header (Greeting, Points & Streak) */}
        <DashboardHeader
          streakCount={userStreak}
          points={userPoints}
          userName={profile.full_name}
        />

        {/* 2. Calorie Progress & Macro Cards */}
        <MacroOverviewCards
          metrics={metrics}
          todayPlan={currentDayPlan}
          progress={progressState || undefined}
        />

        {/* 3. Today's Meals List with checkoff + Meal Replacement */}
        {currentDayPlan?.meals && (
          <TodayMealList
            meals={currentDayPlan.meals}
            progress={
              progressState || {
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
            dietType={(profile.diet_type || profile.diet_preference) as any}
            allergies={profile.allergies || profile.dietary_restrictions}
            onToggleMeal={handleToggleMeal}
            onReplaceMeal={handleReplaceMeal}
          />
        )}

        {/* 4. Workout & Hydration Quick Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Today's Workout Quick Widget */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200 flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5" />
                  Today&apos;s Workout
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {progressState?.workout_completed ? '✓ Completed' : '35 mins'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {profile.activity_level === 'sedentary'
                  ? 'Foundational Mobility & Core'
                  : 'Strength & Conditioning'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Warm-up, targeted compound exercises, and cool-down routine designed for your fitness goal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleToggleWorkout}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation min-h-[44px] ${
                  progressState?.workout_completed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{progressState?.workout_completed ? 'Workout Done ✓' : 'Mark Done'}</span>
              </button>
              <Link
                href="/fitness"
                className="py-2.5 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs border border-teal-200 transition-colors text-center touch-manipulation min-h-[44px] flex items-center justify-center"
              >
                View Routine
              </Link>
            </div>
          </div>

          {/* Quick Water Tracker Widget */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" />
                  Hydration Tracker
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {progressState?.water_completed_ml || 0} / {metrics.waterTarget} ml
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Cellular Hydration Gauge
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Drink water steadily across your 7 daily checkpoints to keep metabolic rate elevated.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleAddWater(250)}
                className="flex-1 py-2.5 px-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-xs rounded-xl border border-cyan-200 transition-colors cursor-pointer touch-manipulation min-h-[44px]"
              >
                +250 ml
              </button>
              <button
                type="button"
                onClick={() => handleAddWater(500)}
                className="flex-1 py-2.5 px-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer touch-manipulation min-h-[44px]"
              >
                +500 ml
              </button>
              <Link
                href="/water"
                className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors text-center touch-manipulation min-h-[44px] flex items-center justify-center"
              >
                Log
              </Link>
            </div>
          </div>
        </div>

        {/* 5. Unified Daily Checklist */}
        <DailyChecklist
          progress={
            progressState || {
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
          waterTargetMl={metrics.waterTarget}
          onToggleMeal={handleToggleMeal}
          onToggleWorkout={handleToggleWorkout}
          onAddWater={handleAddWater}
          onToggleSleep={handleToggleSleep}
        />

        {/* 6. Complete Day Banner */}
        <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              End of Day Evaluation
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight mt-0.5">
              Ready to wrap up today?
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              Calculate your overall health score, update your consistency streak, and bank Health Points.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCompleteDay}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] cursor-pointer shrink-0 touch-manipulation text-center"
          >
            {progressState?.day_completed ? 'View Today’s Summary' : 'Complete Day 🚀'}
          </button>
        </div>

        {/* 7. Complete Day Celebration Modal */}
        <CompleteDayModal
          isOpen={showCompletionModal}
          score={breakdown.score}
          breakdown={breakdown}
          streakCount={userStreak}
          pointsAwarded={progressState?.points_awarded || Math.max(10, Math.round(breakdown.score * 0.8))}
          isAlreadyCompleted={Boolean(progressState?.day_completed)}
          onClose={() => setShowCompletionModal(false)}
          onContinue={() => setShowCompletionModal(false)}
        />
      </div>
    </div>
  );
}
