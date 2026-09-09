'use client';

import { useState, useEffect, useCallback } from 'react';
import { HealthCalculations } from '@/types/health';
import { localStore } from '../storage/localStore';
import { getHealthMetrics, saveHealthMetrics as dbSaveHealthMetrics } from '../supabase/database';
import { getClientUserId } from '../storage/anonymousUser';

export function useHealthMetrics() {
  const [metrics, setMetrics] = useState<HealthCalculations | null>(null);

  const refreshMetrics = useCallback(() => {
    setMetrics(localStore.getMetrics());
  }, []);

  useEffect(() => {
    refreshMetrics();
    const userId = getClientUserId();
    getHealthMetrics(userId).then((res) => {
      if (res) setMetrics(res);
    });

    const handleStorage = () => refreshMetrics();
    window.addEventListener('healthfit_storage', handleStorage);
    return () => window.removeEventListener('healthfit_storage', handleStorage);
  }, [refreshMetrics]);

  const updateMetrics = async (newMetrics: HealthCalculations) => {
    const userId = getClientUserId();
    localStore.setMetrics(newMetrics);
    setMetrics(newMetrics);
    await dbSaveHealthMetrics(userId, newMetrics);
  };

  return { metrics, updateMetrics, refreshMetrics };
}

export const useMetrics = () => {
  const { metrics } = useHealthMetrics();
  return metrics;
};
