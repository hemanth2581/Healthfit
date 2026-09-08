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
} from 'lucide-react';
import { useProfile } from '@/lib/hooks/useProfile';

export default function LandingPage() {
  const profile = useProfile();
  const hasProfile = Boolean(profile);
  const ctaLink = hasProfile ? '/dashboard' : '/onboarding';

  return (
    <div className="w-full text-slate-900 space-y-12 sm:space-y-20 pb-8">
      {/* Hero Section */}
      <section className="relative pt-6 pb-8 sm:pt-12 sm:pb-16 text-center overflow-hidden">
        {/* Ambient Glow */}
        <div 
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[320px] sm:h-[450px] bg-gradient-to-b from-emerald-200/50 via-teal-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" 
        />

        <div className="max-w-4xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold mb-5 sm:mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
            <span>AI-Powered Comprehensive Wellness Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] sm:leading-[1.12]">
            Your health plan. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Built around you.
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
            Personalized nutrition, fitness, hydration, sleep cycles, and daily progress tracking — generated instantly with clinical formulas.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <Link
              href={ctaLink}
              className="w-full sm:w-auto px-7 py-3.5 sm:py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm sm:text-base font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 touch-manipulation"
            >
              <span>{hasProfile ? 'Open Your Dashboard' : 'Create Your Free Plan'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {hasProfile && (
              <Link
                href="/onboarding"
                className="w-full sm:w-auto px-5 py-3.5 sm:py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm sm:text-base font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <span>Recalculate Targets</span>
              </Link>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 100% Free &amp; Anonymous
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Mifflin-St Jeor Precision
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Groq AI Coach Included
            </span>
          </div>
        </div>

        {/* Responsive Interactive Preview Card */}
        <div className="max-w-5xl mx-auto mt-8 sm:mt-12 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/50 p-4 sm:p-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-emerald-50/70 border border-emerald-100/90 rounded-2xl text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-emerald-600" /> Nutrition
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">Target</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                2,150 <span className="text-xs font-normal text-slate-500">kcal/day</span>
              </p>
              <p className="text-xs text-slate-500">140g P • 220g C • 55g F</p>
            </div>

            <div className="p-4 bg-teal-50/70 border border-teal-100/90 rounded-2xl text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-teal-600" /> Fitness
                </span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-full">Routine</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                35 min <span className="text-xs font-normal text-slate-500">Routine</span>
              </p>
              <p className="text-xs text-slate-500">Warm-up + Compound + Cooldown</p>
            </div>

            <div className="p-4 bg-cyan-50/70 border border-cyan-100/90 rounded-2xl text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-600" /> Hydration
                </span>
                <span className="text-[10px] font-bold text-cyan-700 bg-cyan-100/80 px-2 py-0.5 rounded-full">Optimal</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                2,750 <span className="text-xs font-normal text-slate-500">ml/day</span>
              </p>
              <p className="text-xs text-slate-500">7 Scheduled Checkpoints</p>
            </div>

            <div className="p-4 bg-indigo-50/70 border border-indigo-100/90 rounded-2xl text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-600" /> Sleep
                </span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full">5 Cycles</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                7h 30m <span className="text-xs font-normal text-slate-500">Circadian</span>
              </p>
              <p className="text-xs text-slate-500">10:30 PM → 6:00 AM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            One Unified Personal Health Assistant
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Everything you need for sustainable health, strength, and energy in one connected system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">7-Day Macro Diet Rotation</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Personalized meals with exact gram portions for your chosen cuisine (South Indian, North Indian, Continental &amp; balanced diets).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Adaptive Workout Generator</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Targeted routines matching your fitness level and available equipment, with guided sets, reps, and dynamic warm-ups.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Cellular Hydration Rhythm</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Intelligent fluid schedules calibrated to your body weight and daily physical output with quick single-tap logging.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Moon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Circadian Sleep Optimizer</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Calculates optimal bedtimes and wake times aligned with natural 90-minute REM cycles for refreshed morning energy.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Consistency &amp; Streak Engine</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Bank daily Health Points, protect your streak, and view long-term trends across weight, macros, and sleep adherence.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Groq AI Health Coach</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Instant meal substitutions, recipe breakdowns, and fitness questions answered in real-time by ultra-fast AI.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-tr from-slate-900 via-emerald-950 to-slate-900 text-white shadow-2xl text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Ready to Start?
        </span>
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
          Transform your daily habits starting today.
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Get your customized 7-day meal plan and workout schedule in under 60 seconds.
        </p>
        <div className="pt-2">
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] touch-manipulation"
          >
            <span>{hasProfile ? 'Go to Dashboard 🚀' : 'Start Your Free Onboarding 🚀'}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
