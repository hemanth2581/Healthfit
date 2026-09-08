import React from 'react';
import { cn } from '@/lib/utils/helpers';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 text-center',
        className
      )}
    >
      {Icon && (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-400 shadow-2xs mb-3">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h4 className="text-sm font-black text-slate-800">{title}</h4>
      {description && <p className="text-xs font-medium text-slate-500 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
