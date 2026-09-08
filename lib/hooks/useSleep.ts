'use client';

import { useState, useEffect, useCallback } from 'react';
import { SleepLog } from '@/types/progress';
import { localStore } from '../storage/localStore';
import { saveSleepLog as dbSaveSleepLog } from '../supabase/database';
import { getClientUserId } from '../storage/anonymousUser';

export function useSleep() {
  const [logs, setLogs] = useState<SleepLog[]>(() => localStore.getSleepLogs());

  const refreshSleepLogs = useCallback(() => {
    setLogs(localStore.getSleepLogs());
  }, []);

  useEffect(() => {
    refreshSleepLogs();
    const handleStorage = () => refreshSleepLogs();
    window.addEventListener('healthfit_storage', handleStorage);
    return () => window.removeEventListener('healthfit_storage', handleStorage);
  }, [refreshSleepLogs]);

  const addSleepLog = async (log: Omit<SleepLog, 'id' | 'user_id' | 'anonymous_user_id' | 'logged_at'>) => {
    const userId = getClientUserId();
    const newLog: SleepLog = {
      ...log,
      id: crypto.randomUUID(),
      user_id: userId,
      anonymous_user_id: userId,
      logged_at: new Date().toISOString(),
    };
    localStore.addSleepLog(newLog);
    setLogs((prev) => [newLog, ...prev]);
    await dbSaveSleepLog(userId, newLog);
  };

  return { logs, addSleepLog, refreshSleepLogs };
}

export const useSleepLogs = () => {
  const { logs } = useSleep();
  return logs;
};
