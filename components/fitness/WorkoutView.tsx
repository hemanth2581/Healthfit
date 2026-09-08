'use client';

import React, { useState } from 'react';
import {
  Dumbbell,
  CheckCircle2,
  Circle,
  Flame,
  Clock,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyWorkout } from '@/types/nutrition';
import { UserProfile } from '@/types/health';
import { generateWeeklyWorkouts } from '@/lib/nutrition/fitnessGenerator';
import { localStore } from '@/lib/storage/localStore';

interface WorkoutViewProps {
  profile: UserProfile | null;
}

export function WorkoutView({ profile }: WorkoutViewProps) {
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return typeof window !== 'undefined' ? days[new Date().getDay()] : 'Monday';
  });
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [workoutCompleted, setWorkoutCompleted] = useState<boolean>(false);
  const [warmupDone, setWarmupDone] = useState<boolean>(false);
  const [cooldownDone, setCooldownDone] = useState<boolean>(false);

  const workouts = generateWeeklyWorkouts((profile?.activity_level as any) || 'moderately_active');
  const currentWorkout: DailyWorkout = workouts[selectedDay] || workouts['Monday'];

  // Check if all exercises are done
  const totalExercises = currentWorkout.exercises.length;
  const completedCount = currentWorkout.exercises.filter(
    (ex, idx) => completedExercises[`${selectedDay}-${idx}`]
  ).length;

  const isAllComplete =
    totalExercises > 0 &&
    completedCount === totalExercises &&
    warmupDone &&
    cooldownDone;

  const handleToggleExercise = (idx: number) => {
    const key = `${selectedDay}-${idx}`;
    const nextState = !completedExercises[key];
    const updated = { ...completedExercises, [key]: nextState };
    setCompletedExercises(updated);

    // If this completed the workout
    const allDone =
      currentWorkout.exercises.every((_, i) => updated[`${selectedDay}-${i}`]) &&
      warmupDone &&
      cooldownDone;

    if (allDone && !workoutCompleted) {
      triggerWorkoutCompletion();
    }
  };

  const handleToggleWarmup = () => {
    const next = !warmupDone;
    setWarmupDone(next);
    if (next && cooldownDone && completedCount === totalExercises && !workoutCompleted) {
      triggerWorkoutCompletion();
    }
  };

  const handleToggleCooldown = () => {
    const next = !cooldownDone;
    setCooldownDone(next);
    if (next && warmupDone && completedCount === totalExercises && !workoutCompleted) {
      triggerWorkoutCompletion();
    }
  };

  const triggerWorkoutCompletion = () => {
    setWorkoutCompleted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (profile?.user_id || profile?.anonymous_user_id) {
      const uId = profile.user_id || profile.anonymous_user_id || 'user';
      const progress = localStore.getTodayProgress(uId);
      progress.workout_completed = true;
      localStore.saveTodayProgress(progress);
    }
  };

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-5 sm:space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 text-teal-800 rounded-2xl shrink-0">
            <Dumbbell className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Fitness &amp; Workout Routines
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Personalized for your level: <strong className="text-emerald-700 font-semibold">{currentWorkout.level}</strong>
            </p>
          </div>
        </div>

        {workoutCompleted && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-200 shadow-2xs self-start sm:self-auto">
            <Trophy className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>+50 Health Points Earned</span>
          </div>
        )}
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 no-scrollbar">
        {daysList.map((d) => {
          const isSelected = selectedDay === d;
          return (
            <button
              key={d}
              type="button"
              onClick={() => {
                setSelectedDay(d);
                setWorkoutCompleted(false);
              }}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer touch-manipulation min-h-[44px] ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {d.slice(0, 3).toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Today's Workout Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {selectedDay} Routine
              </span>
              <span className="text-xs text-slate-500">• {currentWorkout.focus}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900">
              {currentWorkout.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{currentWorkout.durationMinutes} mins</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>~{currentWorkout.estimatedBurnCalories} kcal</span>
            </div>
          </div>
        </div>

        {/* 1. Warm-up Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Phase 1: Dynamic Warm-Up (5 Mins)
            </h3>
            <span className="text-[11px] text-slate-400">Prepares joints &amp; heart</span>
          </div>

          <div
            onClick={handleToggleWarmup}
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 touch-manipulation min-h-[52px] ${
              warmupDone
                ? 'bg-emerald-50/80 border-emerald-300 text-slate-900 shadow-2xs'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <button type="button" className="text-emerald-600 shrink-0">
                {warmupDone ? (
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-400" />
                )}
              </button>
              <div>
                <p className={`text-xs sm:text-sm font-bold ${warmupDone ? 'line-through text-slate-400' : ''}`}>
                  Arm Circles, Leg Swings &amp; Cat-Cow Mobility
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">3-5 mins dynamic movement</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md shrink-0">
              Warm-up
            </span>
          </div>
        </div>

        {/* 2. Main Workout Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-emerald-600" />
              Phase 2: Main Workout ({completedCount}/{totalExercises} Done)
            </h3>
            <span className="text-[11px] text-slate-400">Rest 45-75s between sets</span>
          </div>

          <div className="space-y-2">
            {currentWorkout.exercises.map((exercise, idx) => {
              const isDone = Boolean(completedExercises[`${selectedDay}-${idx}`]);
              return (
                <div
                  key={idx}
                  onClick={() => handleToggleExercise(idx)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 touch-manipulation min-h-[56px] ${
                    isDone
                      ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button type="button" className="text-emerald-600 mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                      ) : (
                        <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <h4
                        className={`text-xs sm:text-base font-bold transition-colors truncate ${
                          isDone ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {exercise.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] sm:text-xs text-slate-500">
                        {exercise.sets && (
                          <span className="font-semibold text-slate-700">
                            {exercise.sets} Sets
                          </span>
                        )}
                        {exercise.reps && <span>• {exercise.reps}</span>}
                        {exercise.duration && <span>• {exercise.duration}</span>}
                        {exercise.restSeconds && (
                          <span>• {exercise.restSeconds}s rest</span>
                        )}
                      </div>
                      {exercise.notes && (
                        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">{exercise.notes}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 touch-manipulation ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    {isDone ? 'Done ✓' : 'Mark Done'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Cool-down Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Phase 3: Cool-Down &amp; Recovery (5 Mins)
            </h3>
            <span className="text-[11px] text-slate-400">Lowers heart rate</span>
          </div>

          <div
            onClick={handleToggleCooldown}
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 touch-manipulation min-h-[52px] ${
              cooldownDone
                ? 'bg-emerald-50/80 border-emerald-300 text-slate-900 shadow-2xs'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <button type="button" className="text-emerald-600 shrink-0">
                {cooldownDone ? (
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-400" />
                )}
              </button>
              <div>
                <p className={`text-xs sm:text-sm font-bold ${cooldownDone ? 'line-through text-slate-400' : ''}`}>
                  {currentWorkout.cooldown || 'Deep hamstring, chest stretches & diaphragmatic breathing'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">5 mins static stretching</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md shrink-0">
              Cool-down
            </span>
          </div>
        </div>

        {/* Celebration Banner when completed */}
        {isAllComplete && (
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-600/20 animate-in zoom-in-95 duration-300 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 text-white backdrop-blur-md">
              <Flame className="w-7 h-7 fill-amber-300 text-amber-300" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">🔥 Workout Complete!</h3>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-md mx-auto">
              {currentWorkout.durationMinutes} minutes • All exercises completed with peak effort
            </p>
            <div className="inline-block bg-white text-emerald-800 font-extrabold px-4 py-2 rounded-2xl text-xs sm:text-sm shadow-md">
              +50 Health Points Awarded
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
