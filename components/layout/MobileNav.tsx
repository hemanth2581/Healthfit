'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Salad,
  Dumbbell,
  LineChart,
  Menu,
  X,
  Droplets,
  Moon,
  Sparkles,
  Settings,
  PlusCircle,
  Shield,
} from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  // Close drawer on navigation or escape key
  useEffect(() => {
    setShowMore(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMore(false);
    };
    if (showMore) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMore]);

  const isLandingOrOnboarding = pathname === '/' || pathname === '/onboarding';
  if (isLandingOrOnboarding) return null;

  const mainTabs = [
    { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: '/diet', label: 'Diet', icon: Salad },
    { href: '/fitness', label: 'Fitness', icon: Dumbbell },
    { href: '/progress', label: 'Progress', icon: LineChart },
  ];

  const moreTabs = [
    { href: '/water', label: 'Hydration Tracker', icon: Droplets, color: 'text-cyan-600 bg-cyan-100', desc: 'Water intake checkpoints' },
    { href: '/sleep', label: 'Sleep & Circadian', icon: Moon, color: 'text-indigo-600 bg-indigo-100', desc: '90-min sleep cycles & wind-down' },
    { href: '/ai', label: 'AI Health Coach', icon: Sparkles, color: 'text-emerald-600 bg-emerald-100', desc: 'Instant meal swaps & advice' },
    { href: '/settings', label: 'Settings & Targets', icon: Settings, color: 'text-slate-600 bg-slate-100', desc: 'Custom macros & data management' },
    { href: '/onboarding', label: 'Create New Plan', icon: PlusCircle, color: 'text-amber-600 bg-amber-100', desc: 'Recalculate entire wellness plan' },
  ];

  return (
    <>
      {/* Bottom Floating Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 backdrop-blur-xl px-2 pt-1.5 pb-2 safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href || (tab.href === '/diet' && pathname === '/weekly');

            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setShowMore(false)}
                className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-2xl text-[11px] font-bold transition-all touch-manipulation select-none active:scale-95 ${
                  isActive ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive ? 'bg-emerald-100 text-emerald-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="mt-0.5 tracking-tight">{tab.label}</span>
              </Link>
            );
          })}

          {/* More Button */}
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            aria-expanded={showMore}
            aria-label="Toggle more navigation options"
            className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-2xl text-[11px] font-bold transition-all touch-manipulation select-none active:scale-95 cursor-pointer ${
              showMore ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                showMore ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'
              }`}
            >
              {showMore ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </div>
            <span className="mt-0.5 tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* More Bottom Sheet Drawer */}
      {showMore && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs animate-in fade-in flex flex-col justify-end"
          onClick={() => setShowMore(false)}
        >
          <div 
            className="bg-white rounded-t-3xl border-t border-slate-200 p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto safe-area-pb animate-in slide-in-from-bottom duration-250 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1 mb-2" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">More Health Modules</h3>
                <p className="text-xs text-slate-500">Quick access to all tracking & tools</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMore(false)}
                aria-label="Close menu"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1">
              {moreTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href;

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setShowMore(false)}
                    className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all touch-manipulation active:scale-[0.99] ${
                      isActive
                        ? 'border-emerald-300 bg-emerald-50/90 text-emerald-900 font-bold shadow-xs'
                        : 'border-slate-100 bg-slate-50/70 hover:bg-slate-100 text-slate-800 font-semibold'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${tab.color} shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{tab.label}</div>
                      <div className="text-[11px] text-slate-500 font-medium truncate">{tab.desc}</div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <Shield className="w-3 h-3 text-emerald-600" />
                Data stored securely & anonymously
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
