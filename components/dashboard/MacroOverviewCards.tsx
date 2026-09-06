'use client';

import React from 'react';
import { Flame, Beef, Wheat, Droplet, Sparkles, Sprout } from 'lucide-react';
import { HealthCalculations } from '@/types/health';
import { DayDietPlan } from '@/types/nutrition';

interface MacroOverviewProps {
  metrics: HealthCalculations;
  todayPlan?: DayDietPlan;
}

export function MacroOverviewCards({ metrics, todayPlan }: MacroOverviewProps) {
  const plannedCalories = todayPlan?.totalCalories || metrics.targetCalories;
  const plannedProtein = todayPlan?.protein || metrics.proteinTarget;
  const plannedCarbs = todayPlan?.carbs || metrics.carbohydrateTarget;
  const plannedFat = todayPlan?.fat || metrics.fatTarget;
  const plannedFiber = todayPlan?.fiber || metrics.fiberTarget;

  const macroCards = [
    {
      title: 'Target Calories',
      value: `${plannedCalories}`,
      unit: 'kcal / day',
      icon: Flame,
      color: 'text-amber-400',
      bgGradient: 'from-amber-500/15 to-orange-500/5',
      borderColor: 'border-amber-500/30',
      barColor: 'bg-amber-400',
      percent: Math.min(100, Math.round((plannedCalories / metrics.targetCalories) * 100)),
      subtext: `TDEE: ${metrics.tdee} kcal`,
    },
    {
      title: 'Protein Target',
      value: `${plannedProtein}`,
      unit: 'g / day',
      icon: Beef,
      color: 'text-rose-400',
      bgGradient: 'from-rose-500/15 to-pink-500/5',
      borderColor: 'border-rose-500/30',
      barColor: 'bg-rose-400',
      percent: Math.min(100, Math.round((plannedProtein / metrics.proteinTarget) * 100)),
      subtext: `${Math.round(plannedProtein * 4)} kcal from protein`,
    },
    {
      title: 'Carbohydrates',
      value: `${plannedCarbs}`,
      unit: 'g / day',
      icon: Wheat,
      color: 'text-cyan-400',
      bgGradient: 'from-cyan-500/15 to-blue-500/5',
      borderColor: 'border-cyan-500/30',
      barColor: 'bg-cyan-400',
      percent: Math.min(100, Math.round((plannedCarbs / metrics.carbohydrateTarget) * 100)),
      subtext: `${Math.round(plannedCarbs * 4)} kcal from carbs`,
    },
    {
      title: 'Healthy Fats',
      value: `${plannedFat}`,
      unit: 'g / day',
      icon: Droplet,
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-500/15 to-teal-500/5',
      borderColor: 'border-emerald-500/30',
      barColor: 'bg-emerald-400',
      percent: Math.min(100, Math.round((plannedFat / metrics.fatTarget) * 100)),
      subtext: `${Math.round(plannedFat * 9)} kcal from fats`,
    },
    {
      title: 'Dietary Fiber',
      value: `${plannedFiber}`,
      unit: 'g / day',
      icon: Sprout,
      color: 'text-emerald-300',
      bgGradient: 'from-emerald-500/10 to-teal-500/5',
      borderColor: 'border-emerald-500/25',
      barColor: 'bg-emerald-300',
      percent: Math.min(100, Math.round((plannedFiber / metrics.fiberTarget) * 100)),
      subtext: `Target: ${metrics.fiberTarget}g`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {macroCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`p-4 rounded-2xl bg-gradient-to-br ${card.bgGradient} border ${card.borderColor} backdrop-blur-md relative overflow-hidden transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">{card.title}</span>
              <div className={`p-2 rounded-xl bg-slate-900/80 ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-1 my-1">
              <span className="text-2xl font-black text-white">{card.value}</span>
              <span className="text-xs text-slate-400 font-medium">{card.unit}</span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-900/80 my-2 overflow-hidden">
              <div className={`h-full ${card.barColor} rounded-full`} style={{ width: `${card.percent}%` }} />
            </div>

            <div className="text-[11px] text-slate-400 truncate">{card.subtext}</div>
          </div>
        );
      })}
    </div>
  );
}
