import React from 'react';

export function Card({ children, className = '', onClick, variant }) {
  const variantClasses = {
    default: '',
    gold: 'gold-border-left',
    elevated: 'shadow-sanctuary-hover',
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-cream-50 dark:bg-night-100 rounded-2xl
        shadow-sanctuary dark:shadow-none
        border border-gold-200/40 dark:border-sanctuary-800/30
        transition-all duration-200
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        ${variantClasses[variant] || ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
