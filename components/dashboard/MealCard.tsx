'use client';

import React from 'react';
import { Check, Clock, Flame, RefreshCw } from 'lucide-react';
export interface MealCardItem {
  id?: string;
  food_name: string;
  quantity: number;
  unit: string;
}

export interface MealWithItems {
  id?: string;
  meal_type: string;
  meal_time?: string;
  title: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: MealCardItem[];
}

export interface DailyTaskRow {
  id?: string;
  task_type?: string;
  title?: string;
  completed?: boolean;
  points?: number;
}

interface Props {
  meal: MealWithItems;
  task?: DailyTaskRow | null;
  onToggle: (completed: boolean) => void;
  onOpenReplace?: () => void;
  disabled?: boolean;
}

const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Breakfast',
  morning_snack: 'Morning Snack',
  lunch: 'Lunch',
  evening_snack: 'Evening Snack',
  dinner: 'Dinner',
};

export function MealCard({ meal, task, onToggle, onOpenReplace, disabled }: Props) {
  const isCompleted = Boolean(task?.completed);
  const points = task?.points || 15;
  const label = MEAL_LABELS[meal.meal_type] || meal.meal_type;

  const formatMealTime = (timeStr?: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedH = h % 12 || 12;
    return `${formattedH}:${minutes || '00'} ${ampm}`;
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 p-4 sm:p-5 ${
        isCompleted
          ? 'border-emerald-300 bg-emerald-50/80 shadow-xs'
          : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left Side: Meal Type, Time & Macros */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                isCompleted
                  ? 'bg-emerald-200/80 text-emerald-900'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {label}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
              <Clock className="h-3 w-3" />
              {formatMealTime(meal.meal_time)}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
              <Flame className="h-3 w-3 text-amber-600" />
              {meal.calories} kcal
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <h3
              className={`text-base font-bold transition-colors ${
                isCompleted ? 'text-emerald-800 line-through' : 'text-slate-900'
              }`}
            >
              {meal.title}
            </h3>

            {/* Replace Meal Trigger */}
            {onOpenReplace && !isCompleted && (
              <button
                type="button"
                onClick={onOpenReplace}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200/80 transition-colors cursor-pointer shrink-0"
                title="Find compatible alternatives"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace</span>
              </button>
            )}
          </div>

          {/* Macro breakdown tags if available */}
          {(meal.protein || meal.carbs || meal.fat) && (
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
              <span>P: <strong className="text-slate-700">{meal.protein}g</strong></span>
              <span>•</span>
              <span>C: <strong className="text-slate-700">{meal.carbs}g</strong></span>
              <span>•</span>
              <span>F: <strong className="text-slate-700">{meal.fat}g</strong></span>
            </div>
          )}

          {/* Food Items with exact quantities */}
          {meal.items && meal.items.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {meal.items.map((item, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center text-xs px-2.5 py-1 rounded-lg font-medium ${
                    isCompleted
                      ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {item.food_name} — {item.quantity} {item.unit}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Checkbox & Points */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onToggle(!isCompleted)}
            className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border-2 transition-all active:scale-90 cursor-pointer ${
              isCompleted
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'border-slate-300 bg-slate-50 text-transparent hover:border-emerald-500 hover:bg-emerald-50/50'
            }`}
            aria-label={`Mark ${label} as ${isCompleted ? 'incomplete' : 'complete'}`}
          >
            <Check className={`h-6 w-6 stroke-[3] ${isCompleted ? 'text-white' : 'opacity-0'}`} />
          </button>

          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              isCompleted
                ? 'bg-emerald-200/80 text-emerald-900 font-extrabold'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            +{points} pts
          </span>
        </div>
      </div>
    </div>
  );
}
