'use client';

import React from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Circle,
  Dumbbell,
  Droplets,
  Moon,
  Utensils,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { DailyProgress } from '@/types/progress';
import { MealType } from '@/types/nutrition';

interface DailyChecklistProps {
  progress: DailyProgress;
  waterTargetMl: number;
  sleepTargetMinutes: number;
  onToggleMeal: (mealType: MealType) => void;
  onToggleWorkout: () => void;
  onAddWater: (amountMl: number) => void;
}

export function DailyChecklist({
  progress,
  waterTargetMl,
  sleepTargetMinutes,
  onToggleMeal,
  onToggleWorkout,
  onAddWater,
}: DailyChecklistProps) {
  const isWaterMet = progress.water_completed_ml >= waterTargetMl;
  const isSleepMet = progress.sleep_completed_minutes >= sleepTargetMinutes;

  const checklistItems = [
    {
      id: 'breakfast',
      label: 'Breakfast Completed',
      icon: Utensils,
      completed: progress.breakfast_completed,
      action: () => onToggleMeal('breakfast'),
    },
    {
      id: 'morning_snack',
      label: 'Morning Snack Completed',
      icon: Utensils,
      completed: progress.morning_snack_completed,
      action: () => onToggleMeal('morning_snack'),
    },
    {
      id: 'lunch',
      label: 'Lunch Completed',
      icon: Utensils,
      completed: progress.lunch_completed,
      action: () => onToggleMeal('lunch'),
    },
    {
      id: 'evening_snack',
      label: 'Evening Snack Completed',
      icon: Utensils,
      completed: progress.evening_snack_completed,
      action: () => onToggleMeal('evening_snack'),
    },
    {
      id: 'dinner',
      label: 'Dinner Completed',
      icon: Utensils,
      completed: progress.dinner_completed,
      action: () => onToggleMeal('dinner'),
    },
    {
      id: 'workout',
      label: 'Daily Workout / Activity',
      icon: Dumbbell,
      completed: progress.workout_completed,
      action: onToggleWorkout,
    },
    {
      id: 'water',
      label: `Hydration Target (${(progress.water_completed_ml / 1000).toFixed(1)} / ${(waterTargetMl / 1000).toFixed(1)} L)`,
      icon: Droplets,
      completed: isWaterMet,
      action: () => onAddWater(250),
      extraText: '+250 ml',
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-5">
      {/* Header & Score */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Daily Progress Checklist</h3>
            <p className="text-xs text-slate-400">Track habits for optimal health consistency</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Daily Score</div>
            <div className="text-lg font-black text-emerald-400">
              {progress.completion_percentage}%
            </div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Trophy className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 rounded-full bg-slate-900 border border-white/5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500 rounded-full"
          style={{ width: `${progress.completion_percentage}%` }}
        />
      </div>

      {/* Items list */}
      <div className="space-y-2">
        {checklistItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.action}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                item.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-white'
                  : 'bg-slate-900/50 border-white/5 text-slate-300 hover:border-white/15 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${item.completed ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <span className={`text-xs font-semibold ${item.completed ? 'line-through text-slate-400' : ''}`}>
                  {item.label}
                </span>
              </div>

              {item.extraText && !item.completed && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    item.action();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-300 hover:bg-cyan-500/20"
                >
                  {item.extraText}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
