'use client';

import { useState, useEffect, useCallback } from 'react';
import { WaterLog } from '@/types/progress';
import { localStore } from '../storage/localStore';
import { saveWaterLog as dbSaveWaterLog } from '../supabase/database';
import { getClientUserId } from '../storage/anonymousUser';

export function useWater() {
  const [logs, setLogs] = useState<WaterLog[]>([]);

  const refreshWaterLogs = useCallback(() => {
    setLogs(localStore.getWaterLogs());
  }, []);

  useEffect(() => {
    refreshWaterLogs();
    const handleStorage = () => refreshWaterLogs();
    window.addEventListener('healthfit_storage', handleStorage);
    return () => window.removeEventListener('healthfit_storage', handleStorage);
  }, [refreshWaterLogs]);

  const addWater = async (amountMl: number) => {
    const userId = getClientUserId();
    const log: WaterLog = {
      id: crypto.randomUUID(),
      user_id: userId,
      anonymous_user_id: userId,
      amount_ml: amountMl,
      logged_at: new Date().toISOString(),
    };
    localStore.addWaterLog(log);
    setLogs((prev) => [log, ...prev]);
    await dbSaveWaterLog(userId, log);
  };

  return { logs, addWater, refreshWaterLogs };
}

export const useWaterLogs = () => {
  const { logs } = useWater();
  return logs;
};
