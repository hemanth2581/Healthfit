'use client';

import { useState, useEffect, useCallback } from 'react';
import { DailyProgress, WeightLog } from '@/types/progress';
import { localStore } from '../storage/localStore';
import { getDailyProgress, saveDailyProgress as dbSaveDailyProgress } from '../supabase/database';
import { getClientUserId } from '../storage/anonymousUser';
import { getTodayDateString } from '../utils/dates';

const defaultInitialProgress = (): DailyProgress => ({
  anonymous_user_id: '',
  progress_date: getTodayDateString(),
  breakfast_completed: false,
  morning_snack_completed: false,
  lunch_completed: false,
  evening_snack_completed: false,
  dinner_completed: false,
  workout_completed: false,
  water_completed_ml: 0,
  sleep_completed_minutes: 0,
  completion_percentage: 0,
});

export function useProgress() {
  const [progress, setProgress] = useState<DailyProgress>(defaultInitialProgress);

  const refreshProgress = useCallback(() => {
    const userId = getClientUserId();
    const current = localStore.getTodayProgress(userId);
    setProgress(current);
  }, []);

  useEffect(() => {
    refreshProgress();
    const userId = getClientUserId();
    getDailyProgress(userId, getTodayDateString()).then((res) => {
      if (res) setProgress(res);
    });

    const handleStorage = () => refreshProgress();
    window.addEventListener('healthfit_storage', handleStorage);
    return () => window.removeEventListener('healthfit_storage', handleStorage);
  }, [refreshProgress]);

  const updateProgress = async (updated: DailyProgress) => {
    const userId = getClientUserId();
    localStore.saveTodayProgress(updated);
    setProgress(updated);
    await dbSaveDailyProgress(userId, updated);
  };

  return { progress, updateProgress, refreshProgress };
}

export const useTodayProgress = () => {
  const { progress } = useProgress();
  return progress;
};

export const useAllProgress = () => {
  const [history, setHistory] = useState<DailyProgress[]>([]);

  useEffect(() => {
    setHistory(localStore.getProgressHistory());
    const handleStorage = () => setHistory(localStore.getProgressHistory());
    window.addEventListener('healthfit_storage', handleStorage);
    return () => window.removeEventListener('healthfit_storage', handleStorage);
  }, []);

  return history;
};

export function useWeightLogs(): WeightLog[] {
  const [logs, setLogs] = useState<WeightLog[]>([]);

  useEffect(() => {
    setLogs(localStore.getWeightLogs());
    const handleStorage = () => setLogs(localStore.getWeightLogs());
    window.addEventListener('healthfit_storage', handleStorage);
    return () => window.removeEventListener('healthfit_storage', handleStorage);
  }, []);

  return logs;
}
