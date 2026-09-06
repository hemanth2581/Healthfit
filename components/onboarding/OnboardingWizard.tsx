'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Loader2, Shield } from 'lucide-react';
import {
  bodyInfoSchema,
  lifestyleSchema,
  goalSchema,
  nutritionPreferencesSchema,
  FullOnboardingInput,
} from '@/lib/validation';
import { Step1Body } from './Step1Body';
import { Step2Lifestyle } from './Step2Lifestyle';
import { Step3Goal } from './Step3Goal';
import { Step4Diet } from './Step4Diet';
import { getClientUserId } from '@/lib/anonymousUser';
import { localStore } from '@/lib/localStore';
import { calculateAllHealthMetrics } from '@/lib/nutrition/calculations';
import { generateWeeklyPlan } from '@/lib/nutrition/dietGenerator';

const INITIAL_FORM: FullOnboardingInput = {
  weight_kg: 70,
  height_cm: 175,
  age: 24,
  sex: 'male',
  activity_level: 'moderately_active',
  average_steps: 8000,
  workout_frequency: 3,
  workout_preference: 'mixed',
  goal: 'maintain_weight',
  goal_pace: 'moderate',
  diet_preference: 'vegetarian',
  cuisine_preference: 'indian',
  dietary_restrictions: [],
};

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FullOnboardingInput>(() => {
    const existing = localStore.getProfile();
    return existing
      ? {
          weight_kg: existing.weight_kg,
          height_cm: existing.height_cm,
          age: existing.age,
          sex: existing.sex,
          activity_level: existing.activity_level,
          average_steps: existing.average_steps || 8000,
          workout_frequency: existing.workout_frequency || 3,
          workout_preference: existing.workout_preference || 'mixed',
          goal: existing.goal,
          goal_pace: existing.goal_pace || 'moderate',
          diet_preference: existing.diet_preference,
          cuisine_preference: existing.cuisine_preference,
          dietary_restrictions: existing.dietary_restrictions || [],
        }
      : INITIAL_FORM;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    let result;
    if (currentStep === 1) {
      result = bodyInfoSchema.safeParse({
        weight_kg: formData.weight_kg,
        height_cm: formData.height_cm,
        age: formData.age,
        sex: formData.sex,
      });
    } else if (currentStep === 2) {
      result = lifestyleSchema.safeParse({
        activity_level: formData.activity_level,
        average_steps: formData.average_steps,
        workout_frequency: formData.workout_frequency,
        workout_preference: formData.workout_preference,
      });
    } else if (currentStep === 3) {
      result = goalSchema.safeParse({
        goal: formData.goal,
        goal_pace: formData.goal_pace,
      });
    } else {
      result = nutritionPreferencesSchema.safeParse({
        diet_preference: formData.diet_preference,
        cuisine_preference: formData.cuisine_preference,
        dietary_restrictions: formData.dietary_restrictions,
      });
    }

    if (!result.success) {
      const errMap: Record<string, string> = {};
      const issues = (result as any).error?.issues || (result as any).error?.errors || [];
      issues.forEach((e: any) => {
        const field = e.path?.[0] as string;
        if (field) errMap[field] = e.message;
      });
      setErrors(errMap);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handleGeneratePlan();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setStatusMessage('Computing Mifflin-St Jeor metabolic equations...');

    try {
      const userId = getClientUserId();

      // 1. Calculate local metrics and weekly plan instantly for instantaneous feedback
      const metrics = calculateAllHealthMetrics(
        formData.weight_kg,
        formData.height_cm,
        formData.age,
        formData.sex,
        formData.activity_level,
        formData.goal,
        formData.goal_pace
      );

      setStatusMessage('Balancing macronutrients and assembling 7-day meal rotation...');
      const weeklyPlan = generateWeeklyPlan(
        metrics.targetCalories,
        metrics.proteinTarget,
        formData.diet_preference,
        formData.cuisine_preference,
        formData.dietary_restrictions,
        metrics.waterTarget,
        metrics.sleepTargetMinutes,
        formData.activity_level,
        formData.goal
      );

      // Save to local storage for instant access
      const userProfile = {
        anonymous_user_id: userId,
        ...formData,
      };
      localStore.setProfile(userProfile);
      localStore.setMetrics(metrics);
      localStore.setWeeklyPlan(weeklyPlan);

      // 2. Call background API route for server/Supabase synchronization
      setStatusMessage('Finalizing your personalized plan...');
      try {
        await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ anonymous_user_id: userId, ...formData }),
        });

        await fetch('/api/health-metrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            anonymous_user_id: userId,
            metrics,
            profile: formData,
          }),
        });

        await fetch('/api/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            anonymous_user_id: userId,
            profile: userProfile,
          }),
        });
      } catch (apiErr) {
        console.warn('API sync completed locally:', apiErr);
      }

      // Celebrate with confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#34d399', '#38bdf8', '#fbbf24', '#818cf8'],
        });
      } catch {
        // ignore
      }

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      console.error('Plan generation failed', err);
      setIsGenerating(false);
    }
  };

  const stepTitles = ['Body Metrics', 'Lifestyle', 'Primary Goal', 'Nutrition'];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Stepper Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-400">
          <span>
            Step {currentStep} of 4: <strong className="text-emerald-400">{stepTitles[currentStep - 1]}</strong>
          </span>
          <span className="text-emerald-400">{currentStep * 25}% Completed</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500 rounded-full"
            style={{ width: `${currentStep * 25}%` }}
          />
        </div>

        {/* Steps Indicators */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[1, 2, 3, 4].map((step) => {
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;
            return (
              <div
                key={step}
                className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-semibold border transition-all ${
                  isCurrent
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                    : isCompleted
                    ? 'bg-slate-900 border-white/10 text-slate-300'
                    : 'bg-slate-950/40 border-white/5 text-slate-600'
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-emerald-400 text-slate-950'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : step}
                </div>
                <span className="hidden sm:inline truncate">{stepTitles[step - 1]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111928]/80 border border-white/10 backdrop-blur-xl shadow-2xl relative">
        {isGenerating ? (
          <div className="py-16 text-center space-y-5 animate-in fade-in duration-300">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <Sparkles className="h-8 w-8 text-emerald-400 absolute" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Generating Your HealthFit Plan</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">{statusMessage}</p>
            </div>
          </div>
        ) : (
          <div>
            {currentStep === 1 && (
              <Step1Body formData={formData} updateField={updateField} errors={errors} />
            )}
            {currentStep === 2 && (
              <Step2Lifestyle formData={formData} updateField={updateField} errors={errors} />
            )}
            {currentStep === 3 && (
              <Step3Goal formData={formData} updateField={updateField} errors={errors} />
            )}
            {currentStep === 4 && (
              <Step4Diet formData={formData} updateField={updateField} errors={errors} />
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/10">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentStep === 1
                    ? 'opacity-0 pointer-events-none'
                    : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
              >
                {currentStep === 4 ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate My Plan
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Anonymous Privacy Note */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <Shield className="h-3.5 w-3.5 text-emerald-400" />
        <span>No sign-up or credit card required. Instant anonymous access.</span>
      </div>
    </div>
  );
}
