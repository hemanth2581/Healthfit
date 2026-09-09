'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, User } from 'lucide-react';
import { useProfile } from '@/lib/hooks/useProfile';

export function Navbar() {
  const profile = useProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasProfile = mounted && Boolean(profile);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-2xs">
      <div className="flex h-16 items-center justify-between px-3.5 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <Link 
          href={hasProfile ? '/dashboard' : '/'} 
          className="flex items-center gap-2.5 group touch-manipulation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-lg sm:text-xl shadow-sm shadow-emerald-600/20 group-hover:scale-105 transition-transform shrink-0">
            🥗
          </div>
          <div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 flex items-center">
              Health<span className="text-emerald-600">Fit</span>
            </span>
            <span className="hidden sm:block text-[9px] font-bold text-slate-400 tracking-wider uppercase -mt-0.5">
              Personal Health AI
            </span>
          </div>
        </Link>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Create / Regenerate Plan CTA */}
          <Link
            href={hasProfile ? '/onboarding' : '/onboarding'}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm shadow-emerald-600/20 transition-all active:scale-95 touch-manipulation"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{hasProfile ? 'New Plan' : 'Get Started'}</span>
          </Link>

          {/* Settings / Profile Icon */}
          <Link
            href={hasProfile ? '/settings' : '/onboarding'}
            title="Settings & Profile"
            className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:py-2 sm:px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-bold text-xs transition-colors touch-manipulation"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0">
              {hasProfile ? (
                profile?.sex === 'female' || (profile as any)?.gender === 'female' ? '👩' : '🧑'
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
            </div>
            <span className="hidden md:inline font-semibold text-slate-800 max-w-[110px] truncate capitalize">
              {profile?.goal ? String(profile.goal).replace(/_/g, ' ') : 'Settings'}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
