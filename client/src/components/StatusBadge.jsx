import React from 'react';
import { CheckCircle2, Clock, HelpCircle, Compass } from 'lucide-react';

export const TypeBadge = ({ type, size = 'sm' }) => {
  const isLost = type?.toUpperCase() === 'LOST';

  const sizeClasses =
    size === 'lg'
      ? 'px-3 py-1 text-sm font-semibold'
      : 'px-2.5 py-0.5 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses} ${
        isLost
          ? 'bg-rose-50 text-rose-700 border border-rose-200'
          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      }`}
    >
      {isLost ? (
        <HelpCircle className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      ) : (
        <Compass className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      )}
      {isLost ? 'LOST' : 'FOUND'}
    </span>
  );
};

export const StatusBadge = ({ status, size = 'sm' }) => {
  const isResolved = status?.toUpperCase() === 'RESOLVED';

  const sizeClasses =
    size === 'lg'
      ? 'px-3 py-1 text-sm font-semibold'
      : 'px-2.5 py-0.5 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses} ${
        isResolved
          ? 'bg-slate-100 text-slate-700 border border-slate-300'
          : 'bg-teal-50 text-teal-800 border border-teal-200'
      }`}
    >
      {isResolved ? (
        <CheckCircle2 className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      ) : (
        <Clock className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      )}
      {isResolved ? 'Resolved' : 'Active'}
    </span>
  );
};
