'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Activity,
  Salad,
  Bell,
  Download,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Shield,
  Clock,
  Droplets,
  Moon,
  Image as ImageIcon,
} from 'lucide-react';
import { BACKGROUND_PRESETS } from '@/components/layout/SiteBackground';
import {
  fetchUserProfile,
  updateUserProfile,
  createAndSave7DayPlan,
  resetUserData,
  exportAllUserData,
} from '@/lib/supabase/database';
import { calculateAllMetrics } from '@/lib/nutrition/calculations';
import { getClientUserId } from '@/lib/storage/anonymousUser';
import { ActivityLevel, FitnessGoal, DietType } from '@/types/user';

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals
  const [showResetModal, setShowResetModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Profile Form State
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(70);
  const [targetWeight, setTargetWeight] = useState<number>(65);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active');
  const [goal, setGoal] = useState<FitnessGoal>('lose_weight');
  const [dietType, setDietType] = useState<DietType>('vegetarian');
  const [cuisine, setCuisine] = useState<string>('Mixed Indian');
  const [allergies, setAllergies] = useState<string[]>([]);

  // Notification Preferences (local state)
  const [reminders, setReminders] = useState({
    water: true,
    meals: true,
    sleep: true,
    dailySummary: true,
  });

  // Background Theme State
  const [currentBg, setCurrentBg] = useState<string>('/images/site-bg.jpg');

  const availableAllergies = ['Dairy', 'Eggs', 'Nuts', 'Gluten', 'Seafood', 'Soy'];
  const cuisines = ['South Indian', 'North Indian', 'Regional Indian', 'Continental', 'Mixed Indian'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBg = localStorage.getItem('healthfit_background_image');
      if (savedBg) setCurrentBg(savedBg);
    }
  }, []);

  const handleSelectBackground = (url: string) => {
    setCurrentBg(url);
    if (typeof window !== 'undefined') {
      localStorage.setItem('healthfit_background_image', url);
      window.dispatchEvent(new CustomEvent('healthfit:change-bg', { detail: { url } }));
    }
    setStatusMessage({
      type: 'success',
      text: 'Website background wallpaper updated successfully!',
    });
  };

  useEffect(() => {
    async function loadData() {
      const uid = getClientUserId();
      if (!uid) {
        setLoading(false);
        return;
      }
      try {
        const { profile } = await fetchUserProfile(uid);
        if (profile) {
          setAge(profile.age || 25);
          setGender((profile.gender as 'male' | 'female') || 'male');
          setHeight(profile.height || 175);
          setWeight(profile.weight || 70);
          setTargetWeight((profile as any).target_weight || (profile.weight ? profile.weight - 5 : 65));
          setActivityLevel((profile.activity_level as ActivityLevel) || 'moderately_active');
          setGoal((profile.goal as FitnessGoal) || 'lose_weight');
          setDietType((profile.diet_type as DietType) || 'vegetarian');
          setCuisine((profile as any).cuisine || 'Mixed Indian');
          setAllergies(Array.isArray(profile.allergies) ? (profile.allergies as string[]) : []);
        }
      } catch (err) {
        console.error('Error loading settings profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleAllergy = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = getClientUserId();
    if (!uid) return;
    setSaving(true);
    setStatusMessage(null);

    try {
      // 1. Recalculate metrics
      const calculated = calculateAllMetrics({
        age,
        gender: gender as any,
        height,
        weight,
        activityLevel,
        goal: goal as any,
      });

      // 2. Save profile updates
      await updateUserProfile(uid, {
        age,
        gender,
        height,
        weight,
        target_weight: targetWeight,
        activity_level: activityLevel,
        goal,
        diet_type: dietType,
        cuisine,
        allergies: allergies as any,
      });

      setStatusMessage({
        type: 'success',
        text: `Profile updated! Recalculated daily calorie target: ${calculated.calorieTarget} kcal.`,
      });
    } catch (err) {
      console.error('Error saving profile:', err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRegeneratePlan = async () => {
    const uid = getClientUserId();
    if (!uid) return;
    setRegenerating(true);
    setStatusMessage(null);

    try {
      const { profile, targets } = await fetchUserProfile(uid);
      if (!profile || !targets) {
        throw new Error('Profile missing');
      }

      await createAndSave7DayPlan(uid, targets, profile);
      setStatusMessage({
        type: 'success',
        text: '🎉 Fresh 7-Day personalized plan generated! Check your Weekly Plan or Dashboard.',
      });
    } catch (err) {
      console.error('Error regenerating plan:', err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to generate new plan.',
      });
    } finally {
      setRegenerating(false);
    }
  };

  const handleExportData = async () => {
    const uid = getClientUserId();
    if (!uid) return;
    setExporting(true);
    try {
      const data = await exportAllUserData(uid);
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `healthfit-data-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setStatusMessage({
        type: 'success',
        text: 'HealthFit personal data exported as JSON.',
      });
    } catch (err) {
      console.error('Export error:', err);
      setStatusMessage({ type: 'error', text: 'Failed to export data.' });
    } finally {
      setExporting(false);
    }
  };

  const handleResetData = async () => {
    const uid = getClientUserId();
    if (!uid) return;
    setActionLoading(true);
    try {
      await resetUserData(uid);
      setShowResetModal(false);
      router.push('/onboarding');
    } catch (err) {
      console.error('Reset error:', err);
      setStatusMessage({ type: 'error', text: 'Failed to reset data.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Settings className="h-7 w-7 text-emerald-600" />
            <span>Settings & Preferences</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Manage your biometrics, diet preferences, notifications, and stored data.
          </p>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 1. Biometrics & Lifestyle Profile Form */}
      <form onSubmit={handleSaveProfile} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-100 text-cyan-700">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Personal Biometrics & Goals</h2>
              <p className="text-xs text-slate-500 font-medium">Adjusting these recalculates your BMR, TDEE, and macros</p>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Age (years)</label>
            <input
              type="number"
              min={13}
              max={120}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Height (cm)</label>
            <input
              type="number"
              min={100}
              max={250}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Weight (kg)</label>
            <input
              type="number"
              min={30}
              max={300}
              step={0.1}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Weight (kg)</label>
            <input
              type="number"
              min={30}
              max={300}
              step={0.1}
              value={targetWeight}
              onChange={(e) => setTargetWeight(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Fitness Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as FitnessGoal)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="fat_loss">🔥 Lose Fat</option>
              <option value="muscle_gain">💪 Build Muscle</option>
              <option value="maintenance">⚖️ Maintain Weight</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="sedentary">Sedentary (Little or no exercise)</option>
              <option value="light">Lightly Active (1-3 days/week)</option>
              <option value="moderate">Moderately Active (3-5 days/week)</option>
              <option value="very_active">Very Active (6-7 days/week)</option>
              <option value="extra_active">Extremely Active (Hard exercise/job)</option>
            </select>
          </div>
        </div>

        {/* Diet & Allergies */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Salad className="h-4 w-4 text-emerald-600" />
            <span>Nutrition & Allergen Settings</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Diet Type</label>
              <select
                value={dietType}
                onChange={(e) => setDietType(e.target.value as DietType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="vegetarian">🥬 Vegetarian</option>
                <option value="vegan">🌱 Vegan</option>
                <option value="eggetarian">🍳 Eggetarian</option>
                <option value="non_vegetarian">🍗 Non-Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Cuisine Preference</label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              >
                {cuisines.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Strict Allergies / Exclusions (Never recommended in diet generator)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableAllergies.map((allergy) => {
                const isSelected = allergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => toggleAllergy(allergy)}
                    className={`px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-rose-100 text-rose-800 border-2 border-rose-300 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? `✕ ${allergy}` : `+ ${allergy}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* 2. Plan Regeneration */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Regenerate 7-Day Plan</h2>
            <p className="text-xs text-slate-500 font-medium">Rebuild a fresh diet rotation aligned with current targets</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          Want a new weekly recipe variety or recently changed your fitness goals? Click below to regenerate all 7 days of meals scaled accurately to your current macro goals.
        </p>

        <button
          type="button"
          disabled={regenerating}
          onClick={handleRegeneratePlan}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
        >
          <RotateCcw className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`} />
          <span>{regenerating ? 'Generating New 7-Day Plan...' : 'Regenerate Weekly Plan'}</span>
        </button>
      </div>

      {/* 3. Website Background & Theme */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Website Background Wallpaper</h2>
            <p className="text-xs text-slate-500 font-medium">Choose an ambient background image for the entire application</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {BACKGROUND_PRESETS.map((preset) => {
            const isSelected = currentBg === preset.url;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectBackground(preset.url)}
                className={`group text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col gap-2.5 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100/90 hover:border-slate-300'
                }`}
              >
                {/* Thumbnail Preview */}
                <div
                  className="w-full h-28 rounded-xl bg-cover bg-center border border-slate-200/80 shadow-2xs relative overflow-hidden group-hover:scale-[1.01] transition-transform duration-300"
                  style={{ backgroundImage: `url('${preset.url}')` }}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  {isSelected && (
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-black flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </div>
                  )}
                </div>

                <div>
                  <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                    <span>{preset.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-2">
                    {preset.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Notification Preferences */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Notifications & Daily Reminders</h2>
            <p className="text-xs text-slate-500 font-medium">Configure timing alerts and habit reminders</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-all">
            <div className="flex items-center gap-3">
              <Droplets className="h-4 w-4 text-cyan-600" />
              <div>
                <span className="font-bold text-slate-900 block">Hydration Reminders</span>
                <span className="text-xs text-slate-500 font-medium">Hourly water check-ins</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={reminders.water}
              onChange={(e) => setReminders({ ...reminders, water: e.target.checked })}
              className="h-4 w-4 rounded accent-emerald-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-all">
            <div className="flex items-center gap-3">
              <Salad className="h-4 w-4 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-900 block">Meal Timing Alerts</span>
                <span className="text-xs text-slate-500 font-medium">Breakfast, lunch, dinner alerts</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={reminders.meals}
              onChange={(e) => setReminders({ ...reminders, meals: e.target.checked })}
              className="h-4 w-4 rounded accent-emerald-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-all">
            <div className="flex items-center gap-3">
              <Moon className="h-4 w-4 text-indigo-600" />
              <div>
                <span className="font-bold text-slate-900 block">Sleep Wind-down</span>
                <span className="text-xs text-slate-500 font-medium">60 mins before target bedtime</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={reminders.sleep}
              onChange={(e) => setReminders({ ...reminders, sleep: e.target.checked })}
              className="h-4 w-4 rounded accent-emerald-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-all">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-amber-600" />
              <div>
                <span className="font-bold text-slate-900 block">Daily Adherence Score</span>
                <span className="text-xs text-slate-500 font-medium">Evening completion summary</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={reminders.dailySummary}
              onChange={(e) => setReminders({ ...reminders, dailySummary: e.target.checked })}
              className="h-4 w-4 rounded accent-emerald-600 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 4. Data Privacy & Storage Management */}
      <div className="rounded-3xl border border-rose-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-rose-100">
          <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-700">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Data Management & Privacy</h2>
            <p className="text-xs text-slate-500 font-medium">Export or reset your locally stored health records</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            disabled={exporting}
            onClick={handleExportData}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-slate-600" />
            <span>{exporting ? 'Exporting...' : 'Export Health Data (JSON)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-all cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset All Progress & Plans</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-md max-h-[90vh] flex flex-col rounded-3xl border border-rose-200 bg-white p-6 sm:p-8 text-center shadow-2xl animate-in zoom-in-95 overflow-y-auto">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4 shrink-0">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Reset All Data?</h3>
            <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">
              This will erase all daily progress logs, streak records, and meal plans. You will restart onboarding.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="w-full py-3.5 px-4 min-h-[44px] rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleResetData}
                className="w-full py-3.5 px-4 min-h-[44px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? 'Resetting...' : 'Yes, Reset Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

