'use client';

import React from 'react';
import { DietOverview } from '@/components/diet/DietOverview';
import { useProfile, useMetrics, useWeeklyPlan } from '@/lib/hooks';

export default function DietPage() {
  const profile = useProfile();
  const metrics = useMetrics();
  const weeklyPlan = useWeeklyPlan();

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <DietOverview profile={profile} metrics={metrics} weeklyPlan={weeklyPlan} />
      </div>
    </div>
  );
}
