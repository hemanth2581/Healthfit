import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
  variant?: 'warning' | 'danger';
}

export function ErrorMessage({
  title = 'An error occurred',
  message,
  className,
  variant = 'danger',
}: ErrorMessageProps) {
  const isDanger = variant === 'danger';

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-2xl text-xs font-medium border',
        isDanger
          ? 'bg-rose-50 border-rose-200 text-rose-800'
          : 'bg-amber-50 border-amber-200 text-amber-800',
        className
      )}
    >
      {isDanger ? (
        <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
      )}
      <div>
        {title && <span className="font-bold block mb-0.5">{title}</span>}
        <span>{message}</span>
      </div>
    </div>
  );
}
