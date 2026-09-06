import { ActivityLevel } from '@/types/health';
import { calculateWaterTarget } from './calculations';

export interface HydrationScheduleSlot {
  timeLabel: string;
  recommendedTime: string;
  amountMl: number;
  reason: string;
}

export interface HydrationPlan {
  dailyTargetMl: number;
  dailyTargetLitres: number;
  glassCount: number; // 250ml glasses
  schedule: HydrationScheduleSlot[];
  tips: string[];
}

export function generateHydrationPlan(weightKg: number, activityLevel: ActivityLevel): HydrationPlan {
  const dailyTargetMl = calculateWaterTarget(weightKg, activityLevel);
  const dailyTargetLitres = Math.round((dailyTargetMl / 1000) * 10) / 10;
  const glassCount = Math.round(dailyTargetMl / 250);

  // Distribute water throughout the day
  // Schedule: 7 slots
  const morningPortion = Math.round((dailyTargetMl * 0.12) / 50) * 50; // ~300ml
  const midMorningPortion = Math.round((dailyTargetMl * 0.12) / 50) * 50; // ~300ml
  const preLunchPortion = Math.round((dailyTargetMl * 0.15) / 50) * 50; // ~400ml
  const afternoonPortion = Math.round((dailyTargetMl * 0.18) / 50) * 50; // ~500ml
  const eveningPortion = Math.round((dailyTargetMl * 0.15) / 50) * 50; // ~400ml
  const dinnerPeriodPortion = Math.round((dailyTargetMl * 0.15) / 50) * 50; // ~400ml
  const nightPortion = Math.max(
    200,
    dailyTargetMl -
      (morningPortion +
        midMorningPortion +
        preLunchPortion +
        afternoonPortion +
        eveningPortion +
        dinnerPeriodPortion)
  );

  const schedule: HydrationScheduleSlot[] = [
    {
      timeLabel: 'Morning (Wake up)',
      recommendedTime: '7:00 AM',
      amountMl: morningPortion,
      reason: 'Rehydrate after fasting, kickstart metabolism & digestion',
    },
    {
      timeLabel: 'Mid-Morning',
      recommendedTime: '10:00 AM',
      amountMl: midMorningPortion,
      reason: 'Maintain mental focus and curb premature hunger',
    },
    {
      timeLabel: 'Before Lunch',
      recommendedTime: '12:30 PM',
      amountMl: preLunchPortion,
      reason: '30 mins before food helps digestion and prevents overeating',
    },
    {
      timeLabel: 'Afternoon Workout / Recharge',
      recommendedTime: '3:30 PM',
      amountMl: afternoonPortion,
      reason: 'Optimal cellular hydration during peak energy hours',
    },
    {
      timeLabel: 'Evening Wind-down',
      recommendedTime: '6:00 PM',
      amountMl: eveningPortion,
      reason: 'Support recovery and toxin clearance',
    },
    {
      timeLabel: 'Dinner Period',
      recommendedTime: '8:00 PM',
      amountMl: dinnerPeriodPortion,
      reason: 'Gentle hydration with or after dinner',
    },
    {
      timeLabel: 'Night (Pre-bed)',
      recommendedTime: '9:45 PM',
      amountMl: nightPortion,
      reason: 'Light sip to prevent nocturnal dehydration without disrupting sleep',
    },
  ];

  const tips = [
    'Drink a glass of warm water with lemon upon waking.',
    'Keep a reusable 1L water bottle by your desk to track pacing.',
    'Increase water intake by 300–500 ml on hot or intense training days.',
    'Notice urine color: pale straw indicates optimal hydration.',
  ];

  return {
    dailyTargetMl,
    dailyTargetLitres,
    glassCount,
    schedule,
    tips,
  };
}
