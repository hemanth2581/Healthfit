import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white/80 backdrop-blur-md text-slate-600 mt-12 sm:mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🥗</span>
              <span className="font-bold text-slate-900 text-sm">
                Health<span className="text-emerald-600">Fit</span>
              </span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-slate-500">Personalized Diet Planner, Workouts &amp; Habit Tracker</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-semibold">
            <Link href="/dashboard" className="text-slate-600 hover:text-emerald-600 transition-colors py-1">
              Dashboard
            </Link>
            <Link href="/diet" className="text-slate-600 hover:text-emerald-600 transition-colors py-1">
              Diet Plan
            </Link>
            <Link href="/fitness" className="text-slate-600 hover:text-emerald-600 transition-colors py-1">
              Workouts
            </Link>
            <Link href="/progress" className="text-slate-600 hover:text-emerald-600 transition-colors py-1">
              Progress
            </Link>
            <Link href="/settings" className="text-slate-600 hover:text-emerald-600 transition-colors py-1">
              Settings
            </Link>
            <Link href="/onboarding" className="text-emerald-700 hover:text-emerald-600 transition-colors py-1">
              New Plan
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2 text-center sm:text-left">
          <p suppressHydrationWarning>© {new Date().getFullYear()} HealthFit. Stored securely in your browser &amp; Supabase.</p>
          <p className="flex items-center justify-center gap-1 text-slate-500">
            <Shield className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Anonymous &amp; Privacy-First Architecture</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
