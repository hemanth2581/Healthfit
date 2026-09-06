'use client';

import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Dumbbell,
  Moon,
  Clock,
  Utensils,
  Sparkles,
} from 'lucide-react';
import { WeeklyPlan, DayDietPlan } from '@/types/nutrition';

interface WeeklyPlanViewProps {
  plan: WeeklyPlan;
}

export function WeeklyPlanView({ plan }: WeeklyPlanViewProps) {
  // Default Monday (or today's day) expanded
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({
    [today]: true,
    Monday: true,
  });

  const toggleDay = (dayName: string) => {
    setExpandedDays((prev) => ({ ...prev, [dayName]: !prev[dayName] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    plan.days.forEach((d) => (all[d.dayName] = true));
    setExpandedDays(all);
  };

  const collapseAll = () => {
    setExpandedDays({});
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Summary Banner */}
      <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-400" />
            7-Day Complete Health & Nutrition Rotation
          </h2>
          <p className="text-xs text-slate-400">
            Daily meal variety designed to hit balanced macro distribution across the entire week.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* 7 Day Cards */}
      <div className="space-y-4">
        {plan.days.map((day) => {
          const isExpanded = Boolean(expandedDays[day.dayName]);
          const isToday = day.dayName === today;

          return (
            <div
              key={day.dayName}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isToday
                  ? 'bg-[#111928]/95 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : 'bg-[#111928]/80 border-white/10'
              }`}
            >
              {/* Day Card Header */}
              <button
                type="button"
                onClick={() => toggleDay(day.dayName)}
                className="w-full p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left hover:bg-white/5 transition-colors select-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                      isToday
                        ? 'bg-emerald-400 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-200 border border-white/5'
                    }`}
                  >
                    {day.dayName.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{day.dayName}</span>
                      {isToday && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                          Today
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {day.meals.length} Balanced Meals • {day.workoutPlan?.title || 'Active Movement'}
                    </div>
                  </div>
                </div>

                {/* Day Macro Pill summary */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      <Flame className="h-3.5 w-3.5" />
                      {day.totalCalories} kcal
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      <Beef className="h-3.5 w-3.5" />
                      {day.protein}g P
                    </span>
                    <span className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      <Wheat className="h-3.5 w-3.5" />
                      {day.carbs}g C
                    </span>
                    <span className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      <Droplet className="h-3.5 w-3.5" />
                      {day.fat}g F
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-800/80 text-slate-400">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </button>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="p-5 sm:p-6 pt-0 border-t border-white/5 space-y-6 animate-in fade-in duration-200">
                  {/* Meals Section */}
                  <div className="space-y-3 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Utensils className="h-3.5 w-3.5 text-emerald-400" />
                      Daily Meals & Ingredients
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {day.meals.map((meal) => (
                        <div
                          key={meal.mealName + meal.mealType}
                          className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                {meal.mealType.replace('_', ' ')}
                              </span>
                              <div className="text-sm font-bold text-white mt-1">{meal.mealName}</div>
                            </div>
                            <span className="text-xs font-bold text-amber-300 shrink-0">
                              {meal.totalCalories} kcal
                            </span>
                          </div>

                          {/* Food items */}
                          <div className="space-y-1.5 pt-1">
                            {meal.foodItems.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs text-slate-300 py-0.5 border-b border-white/5 last:border-0"
                              >
                                <span className="truncate pr-2">{item.name}</span>
                                <span className="font-semibold text-emerald-400 shrink-0">
                                  {item.quantity} {item.unit}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Micro Macros */}
                          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 pt-1">
                            <span>Protein: <strong className="text-rose-300">{meal.protein}g</strong></span>
                            <span>Carbs: <strong className="text-cyan-300">{meal.carbs}g</strong></span>
                            <span>Fat: <strong className="text-emerald-300">{meal.fat}g</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Workout & Lifestyle Section */}
                  {day.workoutPlan && (
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                            <Dumbbell className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{day.workoutPlan.title}</div>
                            <div className="text-xs text-slate-400">
                              {day.workoutPlan.focus} • {day.workoutPlan.durationMinutes} mins • ~{day.workoutPlan.estimatedBurnCalories} kcal burn
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Moon className="h-3.5 w-3.5 text-indigo-400" />
                            {Math.round(day.sleepTargetMinutes / 60)}h Sleep
                          </span>
                          <span className="flex items-center gap-1">
                            <Droplet className="h-3.5 w-3.5 text-sky-400" />
                            {(day.waterTargetMl / 1000).toFixed(1)}L Water
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                        {day.workoutPlan.exercises.map((ex, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-xs space-y-0.5"
                          >
                            <div className="font-semibold text-slate-200 truncate">{ex.name}</div>
                            <div className="text-emerald-400 text-[11px]">
                              {ex.sets ? `${ex.sets} sets × ${ex.reps}` : ex.duration || 'Steady'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
