'use client';

import React from 'react';
import { WorkoutView } from '@/components/fitness/WorkoutView';
import { useProfile } from '@/lib/hooks';
import Link from 'next/link';
import { Dumbbell, ArrowRight } from 'lucide-react';

export default function FitnessPage() {
  const profile = useProfile();

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6">
      {!profile ? (
        <div className="max-w-md mx-auto my-20 p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Dumbbell className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Set Up Your Profile</h2>
          <p className="text-sm text-slate-500">
            Please complete your onboarding profile to get a personalized workout routine.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all"
          >
            <span>Start Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <WorkoutView profile={profile} />
      )}
    </div>
  );
}
