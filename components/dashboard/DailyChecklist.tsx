'use client';

import React from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Circle,
  Dumbbell,
  Droplets,
  Utensils,
  Moon,
  Trophy,
} from 'lucide-react';
import { DailyProgress } from '@/types/progress';
import { MealType } from '@/types/nutrition';

interface DailyChecklistProps {
  progress: DailyProgress;
  waterTargetMl: number;
  sleepTargetMinutes?: number;
  onToggleMeal: (mealType: MealType) => void;
  onToggleWorkout: () => void;
  onAddWater: (amountMl: number) => void;
  onToggleSleep?: () => void;
}

export function DailyChecklist({
  progress,
  waterTargetMl,
  onToggleMeal,
  onToggleWorkout,
  onAddWater,
  onToggleSleep,
}: DailyChecklistProps) {
  const isMorningWaterMet = progress.water_completed_ml >= 1000;
  const isEveningWaterMet = progress.water_completed_ml >= (waterTargetMl || 2500);
  const isSleepDone = progress.sleep_completed_minutes >= 360;

  const checklistItems = [
    {
      id: 'breakfast',
      label: 'Breakfast',
      icon: Utensils,
      completed: progress.breakfast_completed,
      action: () => onToggleMeal('breakfast'),
    },
    {
      id: 'morning_water',
      label: 'Morning water',
      icon: Droplets,
      completed: isMorningWaterMet,
      action: () => onAddWater(500),
      hint: `${Math.min(1000, progress.water_completed_ml)} / 1,000 ml`,
    },
    {
      id: 'lunch',
      label: 'Lunch',
      icon: Utensils,
      completed: progress.lunch_completed,
      action: () => onToggleMeal('lunch'),
    },
    {
      id: 'workout',
      label: 'Workout',
      icon: Dumbbell,
      completed: progress.workout_completed,
      action: onToggleWorkout,
    },
    {
      id: 'evening_water',
      label: 'Evening water',
      icon: Droplets,
      completed: isEveningWaterMet,
      action: () => onAddWater(500),
      hint: `${progress.water_completed_ml} / ${waterTargetMl} ml`,
    },
    {
      id: 'dinner',
      label: 'Dinner',
      icon: Utensils,
      completed: progress.dinner_completed,
      action: () => onToggleMeal('dinner'),
    },
    {
      id: 'sleep_routine',
      label: 'Sleep routine',
      icon: Moon,
      completed: isSleepDone,
      action: onToggleSleep || (() => {}),
      hint: isSleepDone ? `${Math.round(progress.sleep_completed_minutes / 60)}h logged` : 'Wind-down',
    },
  ];

  const completedCount = checklistItems.filter((i) => i.completed).length;
  const scorePercent = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 sm:space-y-5">
      {/* Header & Score */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight uppercase">
              TODAY&apos;S TASKS
            </h3>
            <p className="text-xs text-slate-500">
              {completedCount} of {checklistItems.length} completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-[10px] sm:text-xs text-slate-400 font-semibold">Today&apos;s Score</div>
            <div className="text-lg sm:text-xl font-black text-emerald-600">
              {scorePercent}%
            </div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2.5 sm:h-3 rounded-full bg-slate-100 border border-slate-200 overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
            style={{ width: `${Math.max(4, scorePercent)}%` }}
          />
        </div>
      </div>

      {/* Checklist Items list */}
      <div className="grid grid-cols-1 gap-2">
        {checklistItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.action}
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none touch-manipulation min-h-[48px] active:scale-[0.99] ${
                item.completed
                  ? 'bg-emerald-50/80 border-emerald-300 text-slate-900 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-1 rounded-full shrink-0 ${item.completed ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className={`h-4 w-4 shrink-0 ${item.completed ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className={`text-xs sm:text-sm font-bold truncate ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {item.label}
                  </span>
                </div>
              </div>

              {item.hint && (
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 shrink-0 ml-2">
                  {item.hint}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
