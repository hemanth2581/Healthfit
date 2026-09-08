'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileView } from '@/components/profile/ProfileView';
import { Loading } from '@/components/common/Loading';
import { getProfile, getHealthMetrics } from '@/lib/supabase/database';
import { getClientUserId } from '@/lib/storage/anonymousUser';
import { UserProfile } from '@/types/user';
import { HealthCalculations } from '@/types/health';

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [targets, setTargets] = useState<HealthCalculations | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const uid = getClientUserId();
        setUserId(uid);
        const [p, t] = await Promise.all([getProfile(uid), getHealthMetrics(uid)]);
        if (!p || !t) {
          router.push('/onboarding');
          return;
        }
        setProfile(p);
        setTargets(t);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loading message="Loading profile & health targets..." />
      </div>
    );
  }

  if (!profile || !targets) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <ProfileView userId={userId} profile={profile} targets={targets} />
      </div>
    </div>
  );
}
