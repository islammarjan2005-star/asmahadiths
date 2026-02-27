import React from 'react';

export function Badge({ children, variant = 'default', icon: Icon }) {
  const variants = {
    default: 'bg-cream-200 dark:bg-night-50 text-text-secondary dark:text-cream-300',
    accent: 'bg-sanctuary-50 dark:bg-sanctuary-900/30 text-sanctuary-600 dark:text-sanctuary-400',
    warm: 'bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-300',
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
