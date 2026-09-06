'use client';

import React from 'react';
import { Utensils, CheckCircle2, Circle, Clock, Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { Meal, MealType } from '@/types/nutrition';
import { DailyProgress } from '@/types/progress';

interface TodayMealListProps {
  meals: Meal[];
  progress: DailyProgress;
  onToggleMeal: (mealType: MealType) => void;
}

export function TodayMealList({ meals, progress, onToggleMeal }: TodayMealListProps) {
  const getMealCompleted = (type: MealType): boolean => {
    switch (type) {
      case 'breakfast':
        return progress.breakfast_completed;
      case 'morning_snack':
        return progress.morning_snack_completed;
      case 'lunch':
        return progress.lunch_completed;
      case 'evening_snack':
        return progress.evening_snack_completed;
      case 'dinner':
        return progress.dinner_completed;
      default:
        return false;
    }
  };

  const mealTimingHints: Record<MealType, string> = {
    breakfast: '7:30 AM – 8:30 AM',
    morning_snack: '10:30 AM – 11:00 AM',
    lunch: '1:00 PM – 2:00 PM',
    evening_snack: '5:00 PM – 5:30 PM',
    dinner: '7:30 PM – 8:30 PM',
    bedtime_snack: '9:30 PM – 10:00 PM',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Utensils className="h-5 w-5 text-emerald-400" />
            Today&apos;s Personalized Nutrition Plan
          </h2>
          <p className="text-xs text-slate-400">
            Click checkbox when you consume a meal to update your adherence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {meals.map((meal) => {
          const isCompleted = getMealCompleted(meal.mealType);
          return (
            <div
              key={meal.mealName + meal.mealType}
              className={`p-5 rounded-3xl border transition-all ${
                isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                  : 'bg-[#111928]/80 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleMeal(meal.mealType)}
                    className={`p-1.5 rounded-full transition-all ${
                      isCompleted
                        ? 'text-emerald-400 bg-emerald-500/20'
                        : 'text-slate-500 hover:text-emerald-400 hover:bg-white/5'
                    }`}
                    aria-label={`Mark ${meal.mealName} as completed`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        {meal.mealType.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {mealTimingHints[meal.mealType] || 'Flexible'}
                      </span>
                    </div>
                    <h3
                      className={`text-base font-bold mt-0.5 ${
                        isCompleted ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {meal.mealName}
                    </h3>
                  </div>
                </div>

                {/* Macro Pills */}
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    <Flame className="h-3.5 w-3.5" />
                    {meal.totalCalories} kcal
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    <Beef className="h-3.5 w-3.5" />
                    {meal.protein}g P
                  </span>
                  <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    <Wheat className="h-3.5 w-3.5" />
                    {meal.carbs}g C
                  </span>
                  <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    <Droplet className="h-3.5 w-3.5" />
                    {meal.fat}g F
                  </span>
                </div>
              </div>

              {/* Food Items with exact Gram/ML quantities */}
              <div className="pt-3.5">
                <div className="text-xs font-semibold text-slate-400 mb-2">Ingredients & Portions:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {meal.foodItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="text-slate-200 font-medium truncate pr-2">{item.name}</div>
                      <div className="font-bold text-emerald-400 shrink-0">
                        {item.quantity} {item.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
