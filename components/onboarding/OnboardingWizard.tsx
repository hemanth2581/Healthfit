'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Scale,
  Flame,
  Activity,
  Salad,
} from 'lucide-react';
import { OnboardingData, Gender, Goal, ActivityLevel, DietType } from '@/types/user';
import {
  saveProfileAndTargets,
  createAndSave7DayPlan,
} from '@/lib/supabase/database';
import { getClientUserId } from '@/lib/storage/anonymousUser';

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<OnboardingData>({
    age: 25,
    gender: 'male',
    height: 175,
    height_unit: 'cm',
    weight: 70,
    weight_unit: 'kg',
    activity_level: 'moderately_active',
    goal: 'lose_weight',
    diet_type: 'vegetarian',
    allergies: [],
  });

  const updateForm = <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleAllergyToggle = (allergy: string) => {
    setFormData((prev) => {
      const current = prev.allergies || [];
      const updated = current.includes(allergy)
        ? current.filter((a) => a !== allergy)
        : [...current, allergy];
      return { ...prev, allergies: updated };
    });
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.age || formData.age < 12 || formData.age > 100) {
        setError('Please enter a valid age between 12 and 100 years.');
        return false;
      }
      if (!formData.height || formData.height <= 0) {
        setError('Please enter a valid height.');
        return false;
      }
      if (!formData.weight || formData.weight <= 0) {
        setError('Please enter a valid weight.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const userId = getClientUserId();
      const heightInCm =
        formData.height_unit === 'ft'
          ? Math.round(formData.height * 30.48)
          : formData.height;
      const weightInKg =
        formData.weight_unit === 'lbs'
          ? Math.round(formData.weight * 0.453592)
          : formData.weight;

      const profilePayload = {
        age: formData.age,
        gender: formData.gender,
        sex: formData.gender,
        height: heightInCm,
        height_cm: heightInCm,
        weight: weightInKg,
        weight_kg: weightInKg,
        activity_level: formData.activity_level,
        goal: formData.goal,
        diet_type: formData.diet_type,
        diet_preference: formData.diet_type,
        allergies: formData.allergies,
        dietary_restrictions: formData.allergies,
        full_name: 'HealthFit Explorer',
      };

      // 1. Save Profile & Calculate all Health Targets
      const { profile, targets } = await saveProfileAndTargets(userId, profilePayload);

      // 2. Generate and Persist 7-Day Plan
      await createAndSave7DayPlan(userId, targets, profile);

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Onboarding Submission Error:', err);
      setError(err?.message || 'Something went wrong while generating your plan. Please try again.');
      setIsSubmitting(false);
    }
  };

  const ALLERGIES_LIST = [
    { id: 'dairy', label: '🥛 Dairy' },
    { id: 'nuts', label: '🥜 Peanuts & Tree Nuts' },
    { id: 'gluten', label: '🌾 Gluten / Wheat' },
    { id: 'eggs', label: '🥚 Eggs' },
    { id: 'seafood', label: '🐟 Fish & Seafood' },
    { id: 'soy', label: '🌱 Soy' },
  ];

  return (
    <div className="mx-auto max-w-2xl px-2 sm:px-4">
      {/* Step Indicators */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Step {step} of 4
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-600">
            {step === 1 && 'Basic Information'}
            {step === 2 && 'Primary Goal'}
            {step === 3 && 'Activity Level'}
            {step === 4 && 'Food Preferences'}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Card Container */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-4 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Scale className="h-6 w-6 text-emerald-600 shrink-0" />
                <span>Tell us about your body</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                We&apos;ll calculate your exact metabolic rate and daily calorie baseline.
              </p>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Biological Sex
              </label>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {(['male', 'female'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => updateForm('gender', g)}
                    className={`py-3 px-4 rounded-2xl border font-bold text-sm capitalize transition-all touch-manipulation min-h-[48px] flex items-center justify-center gap-1.5 ${
                      formData.gender === g
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                        : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {g === 'male' ? '👨 Male' : '👩 Female'}
                  </button>
                ))}
              </div>
            </div>

            {/* Responsive 2-Col Grid for Measurements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Age */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min="12"
                  max="100"
                  value={formData.age}
                  onChange={(e) => updateForm('age', parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 font-bold text-base focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 min-h-[48px]"
                  placeholder="25"
                />
              </div>

              {/* Height */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Height
                  </label>
                  <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => updateForm('height_unit', 'cm')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        formData.height_unit === 'cm'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      cm
                    </button>
                    <button
                      type="button"
                      onClick={() => updateForm('height_unit', 'ft')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        formData.height_unit === 'ft'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ft
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  step="any"
                  value={formData.height}
                  onChange={(e) => updateForm('height', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 font-bold text-base focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 min-h-[48px]"
                  placeholder={formData.height_unit === 'cm' ? '175' : '5.9'}
                />
              </div>

              {/* Weight */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Weight
                  </label>
                  <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => updateForm('weight_unit', 'kg')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        formData.weight_unit === 'kg'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      kg
                    </button>
                    <button
                      type="button"
                      onClick={() => updateForm('weight_unit', 'lbs')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        formData.weight_unit === 'lbs'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      lbs
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  step="any"
                  value={formData.weight}
                  onChange={(e) => updateForm('weight', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 font-bold text-base focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 min-h-[48px]"
                  placeholder={formData.weight_unit === 'kg' ? '70' : '154'}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Goal */}
        {step === 2 && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Flame className="h-6 w-6 text-emerald-600 shrink-0" />
                <span>What is your primary goal?</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                We&apos;ll customize your daily caloric deficit or surplus accordingly.
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              {[
                {
                  id: 'lose_weight' as Goal,
                  title: 'Lose Weight & Body Fat',
                  desc: 'Safe, sustainable caloric deficit while preserving lean muscle mass',
                  icon: '🔥',
                },
                {
                  id: 'maintain_weight' as Goal,
                  title: 'Maintain Weight & Energy',
                  desc: 'Balanced nutrition at your exact daily energy expenditure',
                  icon: '⚖️',
                },
                {
                  id: 'gain_weight' as Goal,
                  title: 'Gain Weight & Muscle',
                  desc: 'High-protein caloric surplus to support hypertrophy',
                  icon: '💪',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => updateForm('goal', item.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 sm:gap-4 touch-manipulation min-h-[56px] active:scale-[0.99] ${
                    formData.goal === item.id
                      ? 'border-emerald-500 bg-emerald-50/90 shadow-md shadow-emerald-500/10'
                      : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Activity Level */}
        {step === 3 && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Activity className="h-6 w-6 text-emerald-600 shrink-0" />
                <span>How active are you daily?</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                This determines your Total Daily Energy Expenditure (TDEE).
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              {[
                {
                  id: 'sedentary' as ActivityLevel,
                  title: 'Sedentary',
                  desc: 'Desk job, minimal exercise, under 5,000 steps/day (1.2x)',
                  icon: '🛋️',
                },
                {
                  id: 'lightly_active' as ActivityLevel,
                  title: 'Lightly Active',
                  desc: 'Light daily walking, 1-2 workout sessions per week (1.375x)',
                  icon: '🚶',
                },
                {
                  id: 'moderately_active' as ActivityLevel,
                  title: 'Moderately Active',
                  desc: 'Moderate exercise 3-5 times a week, active lifestyle (1.55x)',
                  icon: '🏃',
                },
                {
                  id: 'very_active' as ActivityLevel,
                  title: 'Very Active',
                  desc: 'Hard exercise 6-7 days/week, highly demanding physical routine (1.725x)',
                  icon: '⚡',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => updateForm('activity_level', item.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 sm:gap-4 touch-manipulation min-h-[56px] active:scale-[0.99] ${
                    formData.activity_level === item.id
                      ? 'border-emerald-500 bg-emerald-50/90 shadow-md shadow-emerald-500/10'
                      : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Food Preference & Allergies */}
        {step === 4 && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Salad className="h-6 w-6 text-emerald-600 shrink-0" />
                <span>Diet Preferences &amp; Allergies</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your 7-day meal plan will be tailored strictly to these preferences.
              </p>
            </div>

            {/* Diet Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Diet Type
              </label>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {[
                  { id: 'vegetarian' as DietType, label: '🥗 Vegetarian' },
                  { id: 'non_vegetarian' as DietType, label: '🍗 Non-Veg' },
                  { id: 'eggetarian' as DietType, label: '🍳 Eggetarian' },
                  { id: 'vegan' as DietType, label: '🌱 100% Vegan' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateForm('diet_type', item.id)}
                    className={`py-3 sm:py-3.5 px-3 sm:px-4 rounded-2xl border font-bold text-xs sm:text-sm transition-all touch-manipulation min-h-[48px] flex items-center justify-center ${
                      formData.diet_type === item.id
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                        : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Allergies / Exclusions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Allergies &amp; Exclusions (Optional)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                {ALLERGIES_LIST.map((item) => {
                  const isSelected = (formData.allergies || []).includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAllergyToggle(item.id)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all touch-manipulation min-h-[44px] flex items-center justify-center ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-100 text-emerald-800'
                          : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
          {step > 1 ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleBack}
              className="flex items-center gap-2 py-3 px-4 sm:px-5 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors cursor-pointer touch-manipulation min-h-[48px]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 py-3 px-6 sm:px-7 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer touch-manipulation min-h-[48px]"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex items-center gap-2 py-3 px-5 sm:px-7 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs sm:text-base shadow-lg shadow-emerald-600/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer touch-manipulation min-h-[48px]"
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              <span>{isSubmitting ? 'Generating...' : 'Generate My Plan'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
