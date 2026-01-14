import React from 'react';

export function Card({ children, className = '', onClick, variant = 'default' }) {
  const variants = {
    default: 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700',
    pink: 'bg-pink-50 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800',
    amber: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
    rose: 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800',
  };

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl border
        ${variants[variant]}
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
