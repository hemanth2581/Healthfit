import React from 'react';
import { cn } from '@/lib/utils/helpers';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'emerald' | 'cyan' | 'amber' | 'purple' | 'rose';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  color = 'emerald',
  className,
  size = 'md',
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorStyles = {
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    cyan: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-500',
    purple: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    rose: 'bg-gradient-to-r from-rose-500 to-pink-500',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {(label || showValue) && (
        <div className="flex justify-between text-xs font-bold text-slate-600">
          {label && <span>{label}</span>}
          {showValue && <span>{percent}%</span>}
        </div>
      )}
      <div className={cn('w-full rounded-full bg-slate-100 overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full transition-all duration-500 rounded-full', colorStyles[color])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
