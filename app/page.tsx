'use client';

import React from 'react';
import Link from 'next/link';
import {
  Utensils,
  Dumbbell,
  Droplets,
  Moon,
  TrendingUp,
  Bot,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Activity,
  HeartHandshake,
} from 'lucide-react';
import { useProfile } from '@/lib/hooks/useProfile';

export default function LandingPage() {
  const profile = useProfile();
  const hasProfile = Boolean(profile);
  const ctaLink = hasProfile ? '/dashboard' : '/onboarding';

  return (
    <div className="w-full text-slate-900 space-y-12 sm:space-y-20 pb-12">
      {/* =======================================================
          1. HERO SECTION WITH LAYERED BACKGROUND & VISUAL DEPTH
          ======================================================= */}
      <section className="relative rounded-3xl sm:rounded-4xl overflow-hidden p-6 sm:p-12 lg:p-16 border border-slate-200/90 shadow-xl bg-white/90 backdrop-blur-md text-center">
        {/* Layer 1: Background Image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center pointer-events-none -z-20 opacity-[0.18] transition-opacity duration-700"
          style={{ backgroundImage: "url('/images/health-bg.jpg')" }}
        />
        {/* Layer 2: Gradient Overlay for 100% Text Readability */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-white/70 via-emerald-50/40 to-white/95 pointer-events-none -z-10"
        />
        {/* Layer 3: Soft Atmospheric Glow */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[320px] sm:h-[420px] bg-emerald-300/20 rounded-full blur-3xl pointer-events-none -z-10"
        />

        <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Unified Health, Fitness &amp; Groq AI Platform</span>
          </div>

          {/* Hero Heading with Responsive Clamp Scale */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
            Your complete health plan. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Clinically calculated.
            </span>
          </h1>

          {/* Supporting Description with Prose Width Limit */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Personalized macro nutrition, adaptive fitness routines, cellular hydration schedules, and circadian sleep optimization — powered by clinical formulas and real-time AI.
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <Link
              href={ctaLink}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm sm:text-base font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 touch-manipulation cursor-pointer"
            >
              <span>{hasProfile ? 'Open Your Dashboard' : 'Create Your Free Plan'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {hasProfile && (
              <Link
                href="/onboarding"
                className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 text-slate-700 text-sm sm:text-base font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Recalculate Targets</span>
              </Link>
            )}
          </div>

          {/* Trust Marks */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> 100% Free &amp; Private
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-600 shrink-0" /> Mifflin-St Jeor Clinical BMR
            </span>
            <span className="flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-emerald-600 shrink-0" /> Groq AI Health Assistant
            </span>
          </div>
        </div>

        {/* =======================================================
            PRODUCT PREVIEW CARDS (LAYERED COMPONENT ANATOMY)
            ======================================================= */}
        <div className="max-w-5xl mx-auto mt-10 sm:mt-14 bg-white/95 border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/40 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Nutrition */}
            <div className="p-4 bg-emerald-50/80 border border-emerald-100 rounded-2xl text-left space-y-1.5 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-emerald-600" /> Nutrition
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">Calculated</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">
                2,150 <span className="text-xs font-normal text-slate-500">kcal/day</span>
              </p>
              <p className="text-xs text-slate-600 font-medium">140g P • 220g C • 55g F</p>
            </div>

            {/* Card 2: Fitness */}
            <div className="p-4 bg-teal-50/80 border border-teal-100 rounded-2xl text-left space-y-1.5 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-teal-600" /> Fitness
                </span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-100/90 px-2 py-0.5 rounded-full">Adaptive</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                35 min <span className="text-xs font-normal text-slate-500">Routine</span>
              </p>
              <p className="text-xs text-slate-600 font-medium">Mobility + Core + Strength</p>
            </div>

            {/* Card 3: Hydration */}
            <div className="p-4 bg-cyan-50/80 border border-cyan-100 rounded-2xl text-left space-y-1.5 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-600" /> Hydration
                </span>
                <span className="text-[10px] font-bold text-cyan-700 bg-cyan-100/90 px-2 py-0.5 rounded-full">Optimal</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">
                2,750 <span className="text-xs font-normal text-slate-500">ml/day</span>
              </p>
              <p className="text-xs text-slate-600 font-medium">7 Scheduled Checkpoints</p>
            </div>

            {/* Card 4: Sleep */}
            <div className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-2xl text-left space-y-1.5 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-600" /> Circadian
                </span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/90 px-2 py-0.5 rounded-full">5 Cycles</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                7h 30m <span className="text-xs font-normal text-slate-500">Sleep</span>
              </p>
              <p className="text-xs text-slate-600 font-medium">10:30 PM → 6:00 AM</p>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          2. THE 6 PILLARS OF COMPREHENSIVE WELLNESS
          ======================================================= */}
      <section className="space-y-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Complete Design System</div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            One Unified Personal Health Assistant
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Everything you need for sustainable physical energy, fat loss, muscle building, and restful recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">7-Day Macro Diet Rotation</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Personalized meals with exact gram portions for your chosen cuisine (South Indian, North Indian, Continental &amp; balanced diets).
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-xs">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Adaptive Workout Generator</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Targeted routines matching your fitness level and available equipment, with guided sets, reps, and dynamic warm-ups.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center shadow-xs">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Cellular Hydration Rhythm</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Intelligent fluid schedules calibrated to your body weight and daily physical output with quick single-tap logging.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
              <Moon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Circadian Sleep Optimizer</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Calculates optimal bedtimes and wake times aligned with natural 90-minute REM cycles for refreshed morning energy.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Consistency &amp; Streak Engine</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Bank daily Health Points, protect your streak, and view long-term trends across weight, macros, and sleep adherence.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Groq AI Health Coach</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Instant meal substitutions, recipe breakdowns, and fitness questions answered in real-time by ultra-fast AI.
            </p>
          </div>
        </div>
      </section>

      {/* =======================================================
          3. HOW IT WORKS (3-STEP PROGRESSION)
          ======================================================= */}
      <section className="bg-slate-100/70 border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">How HealthFit Works</h2>
          <p className="text-xs sm:text-sm text-slate-500">Get your personalized wellness roadmap in 3 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center">1</div>
            <h4 className="font-bold text-slate-900">Input Biometrics</h4>
            <p className="text-xs text-slate-500">Enter your age, height, current weight, activity level, and cuisine preference.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center">2</div>
            <h4 className="font-bold text-slate-900">Clinical Calculation</h4>
            <p className="text-xs text-slate-500">Formulas compute your exact BMR, TDEE, macro ratios, hydration checkpoints, and sleep cycles.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center">3</div>
            <h4 className="font-bold text-slate-900">Track &amp; Level Up</h4>
            <p className="text-xs text-slate-500">Log meals with one tap, perform workouts, track streaks, and consult your Groq AI coach.</p>
          </div>
        </div>
      </section>

      {/* =======================================================
          4. FINAL CTA BANNER
          ======================================================= */}
      <section className="relative overflow-hidden p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white shadow-2xl shadow-emerald-900/20 text-center space-y-5 border border-emerald-400/30">
        {/* Ambient Decorative Lighting Accents */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-emerald-100 text-xs font-bold uppercase tracking-wider shadow-xs">
            <span>✨</span>
            <span>Ready to Start?</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight !text-white drop-shadow-xs max-w-2xl mx-auto leading-tight">
            Transform your daily habits starting today.
          </h2>

          <p className="text-sm sm:text-base text-emerald-50/90 font-medium max-w-lg mx-auto">
            Get your customized 7-day meal plan and workout schedule in under 60 seconds.
          </p>

          <div className="pt-3">
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-black text-sm sm:text-base shadow-xl shadow-emerald-950/20 hover:scale-[1.03] active:scale-[0.98] transition-all touch-manipulation cursor-pointer"
            >
              <span>{hasProfile ? 'Go to Dashboard 🚀' : 'Start Your Free Onboarding 🚀'}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
