import React from 'react';

export function Badge({ children, variant = 'default', icon: Icon }) {
  const variants = {
    default: 'bg-cream-200 dark:bg-night-50 text-text-secondary dark:text-cream-300',
    emerald: 'bg-sanctuary-50 dark:bg-sanctuary-900/30 text-sanctuary-600 dark:text-sanctuary-400',
    sanctuary: 'bg-sanctuary-50 dark:bg-sanctuary-900/30 text-sanctuary-600 dark:text-sanctuary-400',
    gold: 'bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-300',
    amber: 'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
    rose: 'bg-rose-100 dark:bg-rose-600/20 text-rose-600 dark:text-rose-300',
    violet: 'bg-lavender-100 dark:bg-lavender-400/20 text-lavender-400 dark:text-lavender-300',
    lavender: 'bg-lavender-100 dark:bg-lavender-400/20 text-lavender-400 dark:text-lavender-300',
    blue: 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1
        rounded-full text-xs font-medium
        ${variants[variant] || variants.default}
      `}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}
