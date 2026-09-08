'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Flame,
  Utensils,
  Dumbbell,
  Droplets,
  Moon,
  Printer,
  Download,
  Beef,
  Wheat,
  Droplet,
} from 'lucide-react';
import { UserProfile, HealthCalculations } from '@/types/health';
import { WeeklyPlan } from '@/types/nutrition';
import { generateWeeklyWorkouts } from '@/lib/nutrition/fitnessGenerator';

interface Props {
  profile: UserProfile | null;
  metrics: HealthCalculations | null;
  weeklyPlan: WeeklyPlan | null;
}

const DAY_SHORTS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const DAY_FULLS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function WeeklyPlanView({ profile, metrics, weeklyPlan }: Props) {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const workouts = generateWeeklyWorkouts((profile?.activity_level as any) || 'moderately_active');
  const days = weeklyPlan?.days || [];
  const currentDayPlan = days.find((d) => d.dayName === selectedDay) || days[0];
  const currentWorkout = workouts[selectedDay] || workouts['Monday'];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleExportJSON = () => {
    if (!weeklyPlan) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(weeklyPlan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `HealthFit_7Day_Plan_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-5xl mx-auto pb-12 print:p-0">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600 shrink-0" />
            <span>7-Day Personalized Meal &amp; Workout Plan</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete rotation from Monday through Sunday with exact portion measurements and daily targets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer touch-manipulation min-h-[44px]"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer touch-manipulation min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Day Selector Strip: MON | TUE | WED | THU | FRI | SAT | SUN */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-x-auto no-scrollbar print:hidden">
        {DAY_FULLS.map((dayName, idx) => {
          const isSelected = selectedDay === dayName;
          return (
            <button
              key={dayName}
              type="button"
              onClick={() => setSelectedDay(dayName)}
              className={`flex-1 min-w-[55px] sm:min-w-[65px] py-2.5 sm:py-3 px-1.5 sm:px-2 rounded-xl text-center transition-all font-extrabold text-xs cursor-pointer touch-manipulation min-h-[48px] ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div>{DAY_SHORTS[idx]}</div>
              <div className={`text-[9px] sm:text-[10px] font-normal mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                {dayName.slice(0, 3)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Content */}
      <div className="space-y-5 sm:space-y-6">
        {/* Day Summary Cards: 2-col on mobile/tablet, 4-col on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 print:grid-cols-4">
          <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase truncate block">Calories</span>
              <p className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                {currentDayPlan?.totalCalories || metrics?.targetCalories || 2000} kcal
              </p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-teal-50 text-teal-700 shrink-0">
              <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase truncate block">Workout</span>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                {currentWorkout?.durationMinutes || 35} mins ({currentWorkout?.level || 'Active'})
              </p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-50 text-cyan-700 shrink-0">
              <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase truncate block">Hydration</span>
              <p className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                {(currentDayPlan?.waterTargetMl || metrics?.waterTarget || 2500).toLocaleString()} ml
              </p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-indigo-50 text-indigo-700 shrink-0">
              <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase truncate block">Sleep</span>
              <p className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                7h 30m Circadian
              </p>
            </div>
          </div>
        </div>

        {/* 5 Daily Meals */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Utensils className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>Meals for {selectedDay}</span>
          </h2>

          <div className="space-y-3">
            {currentDayPlan?.meals?.map((meal, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {meal.mealType.replace('_', ' ')}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">{meal.mealName}</h3>
                  </div>

                  {/* Macros */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                      <Flame className="w-3 h-3 text-amber-500" />
                      {meal.totalCalories} kcal
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Beef className="w-3 h-3 text-emerald-600" />
                      {meal.protein}g P
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
                      <Wheat className="w-3 h-3 text-cyan-600" />
                      {meal.carbs}g C
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                      <Droplet className="w-3 h-3 text-slate-500" />
                      {meal.fat}g F
                    </span>
                  </div>
                </div>

                {/* Food items & exact portions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2">
                  {meal.foodItems.map((item, i) => (
                    <div
                      key={i}
                      className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-700 font-medium truncate pr-2">{item.name}</span>
                      <span className="font-bold text-emerald-700 shrink-0 text-[11px] sm:text-xs">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workout section for this day */}
        {currentWorkout && (
          <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700 shrink-0">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {selectedDay} Workout: {currentWorkout.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentWorkout.focus} • {currentWorkout.durationMinutes} mins • ~{currentWorkout.estimatedBurnCalories} kcal
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {currentWorkout.exercises.map((ex, i) => (
                <div key={i} className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex justify-between items-center gap-2">
                  <span className="font-bold text-slate-800 truncate">{ex.name}</span>
                  <span className="text-slate-500 font-medium shrink-0">
                    {ex.sets ? `${ex.sets} sets × ` : ''}{ex.reps || ex.duration || ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
