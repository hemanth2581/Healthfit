'use client';

import { useState, useEffect } from 'react';

export { useProfile, useProfileManager } from './useProfile';
export { useProgress, useTodayProgress, useAllProgress, useWeightLogs } from './useProgress';
export { useHealthMetrics, useMetrics } from './useHealthMetrics';
export { useWater, useWaterLogs } from './useWater';
export { useSleep, useSleepLogs } from './useSleep';
export { usePlan, useWeeklyPlan } from './usePlan';

export function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
