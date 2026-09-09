'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeeklyPlan } from '@/types/nutrition';
import { localStore } from '../storage/localStore';
import { getWeeklyPlan, saveWeeklyPlan as dbSaveWeeklyPlan } from '../supabase/database';
import { getClientUserId } from '../storage/anonymousUser';

export function usePlan() {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);

  const refreshPlan = useCallback(() => {
    setWeeklyPlan(localStore.getWeeklyPlan());
  }, []);

  useEffect(() => {
    refreshPlan();
    const userId = getClientUserId();
    getWeeklyPlan(userId).then((res) => {
      if (res) setWeeklyPlan(res);
    });

    const handleStorage = () => refreshPlan();
    window.addEventListener('healthfit_storage', handleStorage);
    return () => window.removeEventListener('healthfit_storage', handleStorage);
  }, [refreshPlan]);

  const updatePlan = async (plan: WeeklyPlan) => {
    const userId = getClientUserId();
    localStore.setWeeklyPlan(plan);
    setWeeklyPlan(plan);
    await dbSaveWeeklyPlan(userId, plan);
  };

  return { weeklyPlan, updatePlan, refreshPlan };
}

export const useWeeklyPlan = () => {
  const { weeklyPlan } = usePlan();
  return weeklyPlan;
};
