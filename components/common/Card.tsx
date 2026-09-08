import React from 'react';
import { cn } from '@/lib/utils/helpers';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ className, hoverEffect = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200',
        hoverEffect && 'hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
