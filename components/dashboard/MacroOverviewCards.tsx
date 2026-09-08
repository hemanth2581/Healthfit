'use client';

import React from 'react';
import { Flame, Beef, Wheat, Droplet, Sprout } from 'lucide-react';
import { HealthCalculations } from '@/types/health';
import { DayDietPlan } from '@/types/nutrition';
import { DailyProgress } from '@/types/progress';

interface MacroOverviewProps {
  metrics: HealthCalculations;
  todayPlan?: DayDietPlan;
  progress?: DailyProgress;
}

export function MacroOverviewCards({ metrics, todayPlan, progress }: MacroOverviewProps) {
  const targetCalories = metrics.targetCalories || 2000;
  const targetProtein = metrics.proteinTarget || 120;
  const targetCarbs = metrics.carbohydrateTarget || 210;
  const targetFat = metrics.fatTarget || 55;
  const targetFiber = metrics.fiberTarget || 30;

  // Compute consumed macros based on completed meals
  let consumedCalories = 0;
  let consumedProtein = 0;
  let consumedCarbs = 0;
  let consumedFat = 0;
  let consumedFiber = 0;

  if (todayPlan?.meals && progress) {
    todayPlan.meals.forEach((m) => {
      let isDone = false;
      if (m.mealType === 'breakfast' && progress.breakfast_completed) isDone = true;
      if (m.mealType === 'morning_snack' && progress.morning_snack_completed) isDone = true;
      if (m.mealType === 'lunch' && progress.lunch_completed) isDone = true;
      if (m.mealType === 'evening_snack' && progress.evening_snack_completed) isDone = true;
      if (m.mealType === 'dinner' && progress.dinner_completed) isDone = true;

      if (isDone) {
        consumedCalories += m.totalCalories;
        consumedProtein += m.protein;
        consumedCarbs += m.carbs;
        consumedFat += m.fat;
        consumedFiber += m.fiber;
      }
    });
  }

  const calPercent = Math.min(100, Math.round((consumedCalories / targetCalories) * 100));

  const macroList = [
    {
      title: 'Protein',
      consumed: Math.round(consumedProtein),
      target: targetProtein,
      unit: 'g',
      icon: Beef,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      barColor: 'bg-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'Carbs',
      consumed: Math.round(consumedCarbs),
      target: targetCarbs,
      unit: 'g',
      icon: Wheat,
      color: 'text-cyan-700',
      bgColor: 'bg-cyan-50',
      barColor: 'bg-cyan-500',
      borderColor: 'border-cyan-200',
    },
    {
      title: 'Fats',
      consumed: Math.round(consumedFat),
      target: targetFat,
      unit: 'g',
      icon: Droplet,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      barColor: 'bg-amber-500',
      borderColor: 'border-amber-200',
    },
    {
      title: 'Fiber',
      consumed: Math.round(consumedFiber),
      target: targetFiber,
      unit: 'g',
      icon: Sprout,
      color: 'text-teal-700',
      bgColor: 'bg-teal-50',
      barColor: 'bg-teal-600',
      borderColor: 'border-teal-200',
    },
  ];

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Daily Calorie Progress Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-amber-50 text-amber-600 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                Daily Calorie Progress
              </span>
              <div className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                {consumedCalories.toLocaleString()}{' '}
                <span className="text-slate-400 font-normal text-xs sm:text-base">
                  / {targetCalories.toLocaleString()} kcal
                </span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right self-start sm:self-auto">
            <span className="text-xs sm:text-sm font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
              {calPercent}% of target
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 sm:h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(4, calPercent)}%` }}
          />
        </div>
      </div>

      {/* 4 Macro Cards: 2-col on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {macroList.map((m) => {
          const Icon = m.icon;
          const percent = Math.min(100, Math.round((m.consumed / m.target) * 100));
          return (
            <div
              key={m.title}
              className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border ${m.borderColor} shadow-xs space-y-2 transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">{m.title}</span>
                <div className={`p-1.5 rounded-lg sm:rounded-xl ${m.bgColor} ${m.color}`}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>

              <div>
                <div className="text-base sm:text-xl font-extrabold text-slate-900 truncate">
                  {m.consumed}{m.unit}{' '}
                  <span className="text-[10px] sm:text-xs font-normal text-slate-400">
                    / {m.target}{m.unit}
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full ${m.barColor} rounded-full transition-all duration-300`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="text-[10px] sm:text-[11px] text-slate-400 flex justify-between font-medium">
                <span>{percent}%</span>
                <span>{Math.max(0, m.target - m.consumed)}{m.unit} left</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
