'use client';

import React from 'react';
import { WeeklyPlanView } from '@/components/weekly/WeeklyPlanView';
import { UserProfile } from '@/types/user';
import { HealthCalculations } from '@/types/health';
import { WeeklyPlan } from '@/types/nutrition';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { Utensils, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export interface DietOverviewProps {
  profile: UserProfile | null;
  metrics: HealthCalculations | null;
  weeklyPlan: WeeklyPlan | null;
}

export function DietOverview({ profile, metrics, weeklyPlan }: DietOverviewProps) {
  if (!profile) {
    return (
      <div className="py-16 flex items-center justify-center">
        <EmptyState
          icon={Utensils}
          title="Set Up Your Diet Plan"
          description="Please complete your onboarding profile to calculate calorie targets and view your personalized 7-day meal plan."
          action={
            <Link href="/onboarding">
              <Button>
                <span>Start Onboarding</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <WeeklyPlanView profile={profile} metrics={metrics} weeklyPlan={weeklyPlan} />
    </div>
  );
}
