'use client';

import { useState, useEffect, useCallback } from 'react';
import { DailyProgress, WeightLog } from '@/types/progress';
import { localStore } from '../storage/localStore';
import { getDailyProgress, saveDailyProgress as dbSaveDailyProgress } from '../supabase/database';
import { getClientUserId } from '../storage/anonymousUser';
import { getTodayDateString } from '../utils/dates';

export function useProgress() {
  const [progress, setProgress] = useState<DailyProgress>(() => {
    const userId = getClientUserId();
    return localStore.getTodayProgress(userId);
  });

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
  const [history, setHistory] = useState<DailyProgress[]>(() => {
    return localStore.getProgressHistory();
  });

  useEffect(() => {
    const handleStorage = () => setHistory(localStore.getProgressHistory());
    window.addEventListener('healthfit_storage', handleStorage);
    return () => window.removeEventListener('healthfit_storage', handleStorage);
  }, []);

  return history;
};

export function useWeightLogs(): WeightLog[] {
  const [logs, setLogs] = useState<WeightLog[]>(() => localStore.getWeightLogs());

  useEffect(() => {
    const handleStorage = () => setLogs(localStore.getWeightLogs());
    window.addEventListener('healthfit_storage', handleStorage);
    return () => window.removeEventListener('healthfit_storage', handleStorage);
  }, []);

  return logs;
}
