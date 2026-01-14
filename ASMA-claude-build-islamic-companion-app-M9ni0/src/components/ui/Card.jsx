import React from 'react';

export function Card({ children, className = '', onClick, variant = 'default' }) {
  const variants = {
    default: 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800',
    amber: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
    rose: 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800',
    violet: 'bg-violet-50 dark:bg-violet-900/30 border-violet-200 dark:border-violet-800',
  };

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl border transition-all
        ${variants[variant]}
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
