import React from 'react';
import Link from 'next/link';
import { HeartPulse, Shield, Sparkles, Droplets, Moon, Dumbbell } from 'lucide-react';
import { DisclaimerBanner } from './DisclaimerBanner';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#090e17] text-slate-400 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <DisclaimerBanner compact />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 my-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600">
                <HeartPulse className="h-5 w-5 text-slate-950 font-bold" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                HEALTH<span className="text-emerald-400">FIT</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scientific, personalized health and nutrition planning without accounts, passwords, or tracking cookies. Your wellness journey, purely in your hands.
            </p>
          </div>

          {/* Core Engines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Calculation Engines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                Mifflin-St Jeor BMR Engine
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Dumbbell className="h-3.5 w-3.5 text-cyan-400" />
                Dynamic TDEE & Activity Modeler
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Droplets className="h-3.5 w-3.5 text-sky-400" />
                Precision Hydration Schedule
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Moon className="h-3.5 w-3.5 text-indigo-400" />
                Circadian Sleep Calculator
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Daily Dashboard
                </Link>
              </li>
              <li>
                <Link href="/weekly" className="hover:text-emerald-400 transition-colors">
                  7-Day Meal & Workout Plan
                </Link>
              </li>
              <li>
                <Link href="/progress" className="hover:text-emerald-400 transition-colors">
                  Progress Analytics & Charts
                </Link>
              </li>
              <li>
                <Link href="/water" className="hover:text-emerald-400 transition-colors">
                  Hydration Tracker
                </Link>
              </li>
              <li>
                <Link href="/sleep" className="hover:text-emerald-400 transition-colors">
                  Sleep & Recovery
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Anonymous Flow */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              Anonymous-First
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No email, no password, no invasive tracking. Data is tied to a secure client-generated UUID stored in your browser session and encrypted database store.
            </p>
            <div className="pt-1">
              <Link
                href="/settings"
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
              >
                Manage Profile & Reset Data →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} HealthFit Platform. Designed for holistic wellness and healthy living.</p>
          <div className="flex items-center gap-6">
            <Link href="/settings" className="hover:text-slate-300 transition-colors">
              Settings & Reset
            </Link>
            <Link href="/onboarding" className="hover:text-slate-300 transition-colors">
              New Plan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
