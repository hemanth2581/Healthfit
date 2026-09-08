'use client';

import React, { useState } from 'react';
import { Utensils, CheckCircle2, Circle, Clock, Flame, Beef, Wheat, Droplet, RefreshCw } from 'lucide-react';
import { Meal, MealType } from '@/types/nutrition';
import { DailyProgress } from '@/types/progress';
import { MealReplacementModal } from '@/components/diet/MealReplacementModal';
import { DietType } from '@/types/user';
import { MealAlternative } from '@/lib/nutrition/dietGenerator';

interface TodayMealListProps {
  meals: Meal[];
  progress: DailyProgress;
  dietType?: DietType;
  allergies?: string[];
  onToggleMeal: (mealType: MealType) => void;
  onReplaceMeal?: (mealType: MealType, alternative: MealAlternative) => void;
}

export function TodayMealList({
  meals,
  progress,
  dietType = 'vegetarian',
  allergies = [],
  onToggleMeal,
  onReplaceMeal,
}: TodayMealListProps) {
  const [replacingMeal, setReplacingMeal] = useState<{
    type: MealType;
    title: string;
  } | null>(null);

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

  const handleSelectAlternative = (alt: MealAlternative) => {
    if (replacingMeal && onReplaceMeal) {
      onReplaceMeal(replacingMeal.type, alt);
    }
    setReplacingMeal(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Utensils className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>Today&apos;s Nutrition Plan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tap the checkmark after each meal or swap alternatives anytime.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {meals.map((meal) => {
          const isCompleted = getMealCompleted(meal.mealType);
          return (
            <div
              key={meal.mealName + meal.mealType}
              className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                isCompleted
                  ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-start sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleMeal(meal.mealType)}
                    className={`p-1 rounded-full transition-all cursor-pointer shrink-0 mt-0.5 sm:mt-0 touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center ${
                      isCompleted
                        ? 'text-emerald-600 bg-emerald-100'
                        : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100'
                    }`}
                    aria-label={`Mark ${meal.mealName} as ${isCompleted ? 'incomplete' : 'completed'}`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.5]" />
                    ) : (
                      <Circle className="h-6 w-6 sm:h-7 sm:w-7" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200">
                        {meal.mealType.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {mealTimingHints[meal.mealType] || 'Flexible'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <h3
                        className={`text-sm sm:text-base font-bold truncate max-w-full ${
                          isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {meal.mealName}
                      </h3>
                      {!isCompleted && onReplaceMeal && (
                        <button
                          type="button"
                          onClick={() =>
                            setReplacingMeal({
                              type: meal.mealType,
                              title: meal.mealName,
                            })
                          }
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer touch-manipulation"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Swap</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Macro Pills */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold self-start sm:self-auto pl-10 sm:pl-0">
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                    <Flame className="h-3.5 w-3.5 shrink-0" />
                    {meal.totalCalories} kcal
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Beef className="h-3.5 w-3.5 shrink-0" />
                    {meal.protein}g P
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
                    <Wheat className="h-3.5 w-3.5 shrink-0" />
                    {meal.carbs}g C
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                    <Droplet className="h-3.5 w-3.5 shrink-0" />
                    {meal.fat}g F
                  </span>
                </div>
              </div>

              {/* Food Items with exact Gram/ML quantities */}
              <div className="pt-3">
                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 mb-1.5">
                  Ingredients &amp; Exact Portions:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2">
                  {meal.foodItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="text-slate-800 font-medium truncate pr-2">{item.name}</div>
                      <div className="font-bold text-emerald-700 shrink-0 text-[11px] sm:text-xs">
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

      {/* Replacement Modal */}
      {replacingMeal && (
        <MealReplacementModal
          isOpen={Boolean(replacingMeal)}
          onClose={() => setReplacingMeal(null)}
          mealType={
            replacingMeal.type === 'bedtime_snack' ? 'evening_snack' : replacingMeal.type
          }
          currentMealTitle={replacingMeal.title}
          dietType={dietType}
          allergies={allergies}
          onSelectAlternative={handleSelectAlternative}
        />
      )}
    </div>
  );
}
