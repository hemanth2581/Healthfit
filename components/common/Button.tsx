import React from 'react';
import { cn } from '@/lib/utils/helpers';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20',
    secondary: 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300',
    ghost: 'hover:bg-slate-100 text-slate-600',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent shrink-0" />
      )}
      {children}
    </button>
  );
}
