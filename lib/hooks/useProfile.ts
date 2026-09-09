'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/types/user';
import { localStore } from '../storage/localStore';
import { getProfile, saveProfile as dbSaveProfile } from '../supabase/database';
import { getClientUserId } from '../storage/anonymousUser';

export function useProfile(): UserProfile | null {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const refreshProfile = useCallback(() => {
    const current = localStore.getProfile();
    setProfile(current);
  }, []);

  useEffect(() => {
    refreshProfile();
    const userId = getClientUserId();
    getProfile(userId).then((res) => {
      if (res) setProfile(res);
    });

    const handleStorage = () => refreshProfile();
    window.addEventListener('healthfit_storage', handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('healthfit_storage', handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshProfile]);

  return profile;
}

export function useProfileManager() {
  const profile = useProfile();

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const userId = getClientUserId();
    const updated = await dbSaveProfile(userId, updates);
    return updated;
  };

  const refreshProfile = () => {
    localStore.getProfile();
  };

  return {
    profile,
    hasProfile: Boolean(profile),
    updateProfile,
    refreshProfile,
  };
}
