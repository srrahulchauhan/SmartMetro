import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="space-y-4">
        {items.map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 bg-slate-200 dark:bg-slate-850 rounded w-1/3" />
              <div className="h-5 bg-slate-200 dark:bg-slate-850 rounded w-16" />
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-1/2" />
            </div>
            <div className="h-9 bg-slate-200 dark:bg-slate-850 rounded-xl w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'ticket') {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-slate-200 dark:bg-slate-850 rounded w-28" />
          <div className="h-6 bg-slate-200 dark:bg-slate-850 rounded-full w-20" />
        </div>
        <div className="h-24 bg-slate-100 dark:bg-slate-850 rounded-xl mb-4" />
        <div className="h-10 bg-slate-200 dark:bg-slate-850 rounded-xl w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((_, i) => (
        <div key={i} className="h-12 bg-slate-200 dark:bg-slate-850 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}
