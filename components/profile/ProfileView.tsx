'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Scale,
  Flame,
  Droplets,
  Salad,
  RotateCcw,
  Trash2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { resetUserData, createAndSave7DayPlan } from '@/lib/supabase/database';
import { UserProfile } from '@/types/user';
import { HealthCalculations } from '@/types/health';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

export interface ProfileViewProps {
  userId: string;
  profile: UserProfile;
  targets: HealthCalculations | any;
}

export function ProfileView({ userId, profile, targets }: ProfileViewProps) {
  const router = useRouter();
  const [regenerating, setRegenerating] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRegeneratePlan = async () => {
    if (!userId || !profile || !targets) return;
    setRegenerating(true);
    setMessage(null);

    try {
      await createAndSave7DayPlan(userId, targets, profile);
      setMessage('✅ Fresh 7-day meal plan generated!');
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err) {
      console.error('Regenerate plan error:', err);
      setMessage('Failed to regenerate plan. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  const handleResetData = async () => {
    if (!userId) return;
    setResetting(true);

    try {
      await resetUserData(userId);
      setShowResetConfirm(false);
      router.push('/onboarding');
    } catch (err) {
      console.error('Reset error:', err);
      setMessage('Failed to reset data.');
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <User className="h-7 w-7 text-emerald-600" />
            <span>Your Health Profile</span>
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 font-medium">
            Your personal parameters and daily calculated targets.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Target Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Flame className="h-4 w-4 text-amber-500" />
            <span>Calories</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{targets.daily_calories || targets.targetCalories || 2000}</p>
          <span className="text-[11px] text-slate-500 font-medium">kcal / day</span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Salad className="h-4 w-4 text-emerald-600" />
            <span>Protein</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{targets.protein_target || targets.proteinTarget || 120}g</p>
          <span className="text-[11px] text-slate-500 font-medium">daily target</span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-700 uppercase tracking-wider mb-1">
            <Droplets className="h-4 w-4 text-cyan-600" />
            <span>Water</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{targets.water_target || targets.waterTarget || 2500}</p>
          <span className="text-[11px] text-slate-500 font-medium">ml / day</span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
            <Scale className="h-4 w-4 text-purple-600" />
            <span>BMI</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{targets.bmi || 22}</p>
          <span className="text-[11px] text-slate-500 font-medium">BMR: {targets.bmr || 1600} kcal</span>
        </Card>
      </div>

      {/* Profile Details List */}
      <Card className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
          Biometric & Lifestyle Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium">Age</span>
            <span className="text-slate-900 font-bold">{profile.age} years</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium">Gender</span>
            <span className="text-slate-900 font-bold capitalize">{profile.gender || profile.sex}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium">Height</span>
            <span className="text-slate-900 font-bold">
              {profile.height || profile.height_cm} {profile.height_unit || 'cm'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium">Weight</span>
            <span className="text-slate-900 font-bold">
              {profile.weight || profile.weight_kg} {profile.weight_unit || 'kg'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium">Primary Goal</span>
            <span className="text-emerald-700 font-bold capitalize">
              {profile.goal?.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium">Activity Level</span>
            <span className="text-slate-900 font-bold capitalize">
              {profile.activity_level?.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium">Diet Type</span>
            <span className="text-slate-900 font-bold capitalize">
              {(profile.diet_type || profile.diet_preference)?.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium">Allergies / Exclusions</span>
            <span className="text-slate-900 font-bold">
              {Array.isArray(profile.allergies || profile.dietary_restrictions) && (profile.allergies || profile.dietary_restrictions)!.length > 0
                ? (profile.allergies || profile.dietary_restrictions)!.join(', ')
                : 'None'}
            </span>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <Card className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 mb-2">Manage Your Plan</h3>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/onboarding')}
            className="w-full sm:w-auto flex-1"
          >
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>Edit Profile & Targets</span>
          </Button>

          <Button
            variant="primary"
            isLoading={regenerating}
            onClick={handleRegeneratePlan}
            className="w-full sm:w-auto flex-1"
          >
            <RotateCcw className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`} />
            <span>{regenerating ? 'Regenerating...' : 'Regenerate Plan'}</span>
          </Button>

          <Button
            variant="danger"
            onClick={() => setShowResetConfirm(true)}
            className="w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4" />
            <span>Reset My Data</span>
          </Button>
        </div>
      </Card>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title={
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Reset All HealthFit Data?</span>
          </div>
        }
        description="This will permanently delete your profile, generated 7-day diet plan, task history, and streaks."
      >
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowResetConfirm(false)}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            isLoading={resetting}
            onClick={handleResetData}
            className="w-full"
          >
            {resetting ? 'Resetting...' : 'Yes, Delete Everything'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
