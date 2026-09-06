'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Droplets,
  Moon,
  Calendar,
  HeartPulse,
  Scale,
  UtensilsCrossed,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { calculateBMI } from '@/lib/nutrition/calculations';
import { localStore } from '@/lib/localStore';

export default function LandingPage() {
  const [hasPlan, setHasPlan] = useState(false);
  const [demoWeight, setDemoWeight] = useState(70);
  const [demoHeight, setDemoHeight] = useState(175);

  useEffect(() => {
    const profile = localStore.getProfile();
    setHasPlan(Boolean(profile));
  }, []);

  const demoBmi = calculateBMI(demoWeight, demoHeight);

  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 shadow-sm animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Zero Account Required • Instant Anonymous Access</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
          Personalized Health, Nutrition &{' '}
          <span className="gradient-text">Fitness Planner</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Input your metrics, calculate your exact metabolic energy baseline, and generate a tailored 7-day meal, hydration, sleep, and workout blueprint in seconds.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-extrabold text-base shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="h-5 w-5" />
            {hasPlan ? 'Re-calculate My Plan' : 'Generate My Personalized Plan'}
            <ArrowRight className="h-5 w-5" />
          </Link>

          {hasPlan && (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-white font-bold text-base transition-all hover:scale-105"
            >
              <Activity className="h-5 w-5 text-emerald-400" />
              Open My Dashboard
            </Link>
          )}
        </div>

        {/* Core Principles Strip */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle className="h-4 w-4" /> Input
          </span>
          <span>→</span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <CheckCircle className="h-4 w-4" /> Calculate
          </span>
          <span>→</span>
          <span className="flex items-center gap-1.5 text-indigo-400">
            <CheckCircle className="h-4 w-4" /> Personalize
          </span>
          <span>→</span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <CheckCircle className="h-4 w-4" /> Generate Plan
          </span>
          <span>→</span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <CheckCircle className="h-4 w-4" /> Track Progress
          </span>
        </div>
      </section>

      {/* Interactive Quick Calculator Teaser */}
      <section className="p-6 sm:p-10 rounded-3xl bg-[#111928]/80 border border-white/10 backdrop-blur-xl max-w-4xl mx-auto shadow-2xl relative">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 w-full md:w-1/2">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Interactive Preview
              </span>
              <h3 className="text-2xl font-bold text-white">Live Metabolic Screener</h3>
              <p className="text-xs text-slate-400">
                Adjust weight and height to test our calculation engine in real-time.
              </p>
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Weight: <strong className="text-emerald-400">{demoWeight} kg</strong></span>
                  <span className="text-slate-500">20–150 kg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="140"
                  value={demoWeight}
                  onChange={(e) => setDemoWeight(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Height: <strong className="text-cyan-400">{demoHeight} cm</strong></span>
                  <span className="text-slate-500">120–220 cm</span>
                </div>
                <input
                  type="range"
                  min="130"
                  max="210"
                  value={demoHeight}
                  onChange={(e) => setDemoHeight(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="w-full md:w-1/2 p-6 rounded-2xl bg-slate-950/70 border border-white/10 space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-400">Estimated BMI</div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${demoBmi.color} border-current bg-current/10`}>
                {demoBmi.category}
              </span>
            </div>

            <div className="text-4xl font-black text-white">{demoBmi.bmi}</div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Healthy weight window for your height: <strong className="text-emerald-300">{demoBmi.healthyWeightRange.min} – {demoBmi.healthyWeightRange.max} kg</strong>.
            </p>

            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-bold text-emerald-300 transition-colors"
            >
              Unlock Full 7-Day Nutrition & Workout Plan →
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Feature Cards */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Engineered for Complete Body Optimization</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Every macro, fluid ounce, bedtime cycle, and workout set calculated specifically for your biology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 space-y-3 hover:border-emerald-500/30 transition-all">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Dynamic Nutrition & Grams</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Precise gram and ml quantities for Breakfast, Snacks, Lunch, and Dinner with strict vegetarian, vegan, or allergy filters.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 space-y-3 hover:border-cyan-500/30 transition-all">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 w-fit">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">7-Day Meal Rotation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No boring meal repetition. Automated rotating dishes across South Indian, North Indian, and International flavors.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 space-y-3 hover:border-sky-500/30 transition-all">
            <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 w-fit">
              <Droplets className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Precision Hydration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Target fluid intake in Litres and ml with a 7-stage intake schedule to optimize kidney function and cellular recovery.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-[#111928]/80 border border-white/10 space-y-3 hover:border-indigo-500/30 transition-all">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit">
              <Moon className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Circadian Sleep Optimization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bedtime and wake time recommendations built on 90-minute sleep cycle science and 4-step wind-down protocols.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 backdrop-blur-xl text-center space-y-6 max-w-4xl mx-auto shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-black text-white">
          Take Control of Your Health Today
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          No credit card, no sign-up forms, no passwords. Start your personalized journey in under 60 seconds.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
        >
          <Sparkles className="h-5 w-5" />
          Start My Plan Now
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>
    </div>
  );
}
