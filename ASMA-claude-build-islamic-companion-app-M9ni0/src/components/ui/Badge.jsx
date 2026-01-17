import React from 'react';

export function Badge({ children, variant = 'default', icon: Icon }) {
  const variants = {
    default: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
    amber: 'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
    rose: 'bg-rose-50 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300',
    violet: 'bg-violet-50 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300',
    blue: 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1
        rounded-full text-xs font-medium
        ${variants[variant]}
      `}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}
