'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Salad,
  Dumbbell,
  Droplets,
  Moon,
  LineChart,
  Sparkles,
  Settings,
  PlusCircle,
} from 'lucide-react';
import { useProfile } from '@/lib/hooks/useProfile';

export function Sidebar() {
  const pathname = usePathname();
  const profile = useProfile();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/diet', label: 'Diet & Meals', icon: Salad },
    { href: '/fitness', label: 'Fitness', icon: Dumbbell },
    { href: '/water', label: 'Hydration', icon: Droplets },
    { href: '/sleep', label: 'Sleep & Circadian', icon: Moon },
    { href: '/progress', label: 'Progress Analytics', icon: LineChart },
    { href: '/ai', label: 'AI Health Coach', icon: Sparkles, highlight: true },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  // Do not show sidebar on landing page or onboarding
  const isLandingOrOnboarding = pathname === '/' || pathname === '/onboarding';
  if (isLandingOrOnboarding) return null;

  return (
    <aside className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 border-r border-slate-200/80 bg-white/95 backdrop-blur-md p-4 sticky top-0 h-screen z-30 justify-between overflow-y-auto">
      {/* Brand & Logo */}
      <div className="space-y-6">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xl shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            🥗
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 flex items-center">
              Health<span className="text-emerald-600">Fit</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase">
              Personal Health AI
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/diet' && pathname === '/weekly');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-black'
                    : item.highlight
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-emerald-600'
                        : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-200/60 text-emerald-900 text-[9px] font-black uppercase shrink-0">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Profile / Quick Actions */}
      <div className="space-y-3 pt-4 border-t border-slate-100 mt-4">
        <Link
          href="/onboarding"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all active:scale-95"
        >
          <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
          <span>New Health Plan</span>
        </Link>

        {profile && (
          <Link
            href="/settings"
            className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
              {(profile as any)?.gender === 'female' || profile?.sex === 'female' ? '👩' : '🧑'}
            </div>
            <div className="overflow-hidden text-left flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate block capitalize">
                {profile?.goal ? String(profile.goal).replace(/_/g, ' ') : 'My Profile'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate block capitalize">
                {profile.diet_preference || (profile as any).diet_type || 'Healthy Plan'}
              </span>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}
