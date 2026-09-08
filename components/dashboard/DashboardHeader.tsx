'use client';

import React from 'react';
import { Flame, Award } from 'lucide-react';

interface Props {
  streak?: { current_streak?: number } | null;
  streakCount?: number;
  points?: number;
  userName?: string;
}

export function DashboardHeader({ streak, streakCount = 0, points = 0, userName }: Props) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 👋';
    if (hour < 17) return 'Good Afternoon ☀️';
    return 'Good Evening 🌙';
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const currentStreak = streak?.current_streak ?? streakCount;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-1">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
          {getGreeting()} {userName ? <span className="text-emerald-700 font-bold">{userName}</span> : ''}
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
          Here&apos;s your daily targets • {getFormattedDate()}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs shadow-2xs">
          <Award className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>{points} Points</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs shadow-2xs">
          <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse shrink-0" />
          <span>{currentStreak} Day Streak</span>
        </div>
      </div>
    </div>
  );
}
