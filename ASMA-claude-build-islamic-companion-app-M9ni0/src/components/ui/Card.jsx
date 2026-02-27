import React from 'react';

export function Card({ children, className = '', onClick, variant = 'default', padding = true }) {
  const base = `rounded-2xl transition-all duration-150 ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`;

  const variants = {
    default: 'bg-white dark:bg-night-100 shadow-soft dark:shadow-none',
    featured: 'bg-sanctuary-600 dark:bg-sanctuary-800 text-white shadow-soft',
    subtle: 'bg-cream-100 dark:bg-night-100',
    ghost: 'bg-transparent',
  };

  return (
    <div
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.default} ${padding ? 'p-4' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
