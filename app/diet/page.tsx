'use client';

import React from 'react';
import { DietOverview } from '@/components/diet/DietOverview';
import { useProfile, useMetrics, useWeeklyPlan } from '@/lib/hooks';

export default function DietPage() {
  const profile = useProfile();
  const metrics = useMetrics();
  const weeklyPlan = useWeeklyPlan();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <DietOverview profile={profile} metrics={metrics} weeklyPlan={weeklyPlan} />
    </div>
  );
}
