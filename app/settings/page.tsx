'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Settings,
  User,
  Shield,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HeartPulse,
} from 'lucide-react';
import { UserProfile, HealthCalculations } from '@/types/health';
import { localStore } from '@/lib/localStore';
import { getClientUserId, resetClientUserId } from '@/lib/anonymousUser';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<HealthCalculations | null>(null);
  const [userId, setUserId] = useState('');
  const [copied, setCopied] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const id = getClientUserId();
    setUserId(id);
    const storedProfile = localStore.getProfile();
    const storedMetrics = localStore.getMetrics();
    setProfile(storedProfile);
    setMetrics(storedMetrics);
  }, []);

  const copyUserId = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      // 1. Call server reset
      await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonymous_user_id: userId }),
      }).catch((e) => console.warn('Server reset note:', e));

      // 2. Clear client storage
      localStore.clearAll();

      // 3. Generate fresh anonymous UUID
      resetClientUserId();

      // 4. Redirect to onboarding
      router.push('/onboarding');
    } catch (err) {
      console.error('Reset error:', err);
      localStore.clearAll();
      resetClientUserId();
      router.push('/onboarding');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Settings className="h-7 w-7 text-emerald-400" />
          Settings & Account Management
        </h1>
        <p className="text-sm text-slate-400">
          Manage your anonymous profile, review health baselines, and control your data.
        </p>
      </div>

      {/* 1. Anonymous Identity Card */}
      <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Anonymous Client Session</h3>
            <p className="text-xs text-slate-400">
              Your data is bound exclusively to this browser-generated cryptographic UUID.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950/70 border border-white/10">
          <div className="text-xs font-mono text-emerald-300 truncate pr-2">
            {userId || 'Loading UUID...'}
          </div>
          <button
            type="button"
            onClick={copyUserId}
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors shrink-0"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy Identifier'}
          </button>
        </div>
      </div>

      {/* 2. Active Profile Summary */}
      {profile && metrics && (
        <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Active Physical Parameters</h3>
                <p className="text-xs text-slate-400">Current biometric and dietary configuration</p>
              </div>
            </div>

            <Link
              href="/onboarding"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-500/40 text-xs font-semibold text-slate-300 hover:text-emerald-300 transition-colors"
            >
              Update Preferences
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-0.5">
              <div className="text-slate-400">Weight & Height</div>
              <div className="text-sm font-bold text-white">{profile.weight_kg} kg • {profile.height_cm} cm</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-0.5">
              <div className="text-slate-400">Age & Sex</div>
              <div className="text-sm font-bold text-white">{profile.age} yrs • {profile.sex}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-0.5">
              <div className="text-slate-400">Activity Level</div>
              <div className="text-sm font-bold text-white capitalize">{profile.activity_level.replace('_', ' ')}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-0.5">
              <div className="text-slate-400">Goal & Diet</div>
              <div className="text-sm font-bold text-emerald-300 capitalize">{profile.goal.replace('_', ' ')}</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Danger Zone: Reset My Data */}
      <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Reset All My Data</h3>
            <p className="text-xs text-slate-400">
              Permanently erase your nutrition plans, weight history, progress checks, and anonymous identifier.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-all hover:scale-105"
        >
          <Trash2 className="h-4 w-4" />
          Reset My Data & Start Fresh
        </button>
      </div>

      {/* 4. Full Medical Disclaimer */}
      <DisclaimerBanner />

      {/* Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirm Complete Data Reset</h3>
                <p className="text-xs text-slate-400">This action is irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to reset all your HealthFit data? This will purge your profile, 7-day meal plans, daily progress checkmarks, and weight history from this device and the server database, then return you to onboarding.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetData}
                disabled={isResetting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-md transition-all"
              >
                {isResetting ? <RotateCcw className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                {isResetting ? 'Erasing...' : 'Yes, Erase Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
