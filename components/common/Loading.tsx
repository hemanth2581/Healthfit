import React from 'react';
import { cn } from '@/lib/utils/helpers';

export interface LoadingProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({ message = 'Loading...', className, size = 'md' }: LoadingProps) {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-8 gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-emerald-600 border-t-transparent',
          sizes[size]
        )}
      />
      {message && <p className="text-xs font-bold text-slate-500 animate-pulse">{message}</p>}
    </div>
  );
}
