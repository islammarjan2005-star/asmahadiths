import React from 'react';

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon: Icon,
}) {
  const variants = {
    primary:
      'bg-sanctuary-600 text-white active:bg-sanctuary-700',
    secondary:
      'bg-cream-200 dark:bg-night-100 text-sanctuary-700 dark:text-cream-200 active:bg-cream-300 dark:active:bg-night-50',
    ghost:
      'bg-transparent text-text-secondary dark:text-cream-300 active:bg-cream-200 dark:active:bg-night-100',
    gold:
      'bg-gold-400 text-sanctuary-900 active:bg-gold-500',
    warm:
      'bg-sanctuary-600 text-white active:bg-sanctuary-700',
    rose:
      'bg-rose-400 text-white active:bg-rose-500',
    outline:
      'border border-sanctuary-300 dark:border-sanctuary-600 text-sanctuary-600 dark:text-sanctuary-400 active:bg-sanctuary-50 dark:active:bg-sanctuary-900/30',
    emerald:
      'bg-sanctuary-600 text-white active:bg-sanctuary-700',
    danger:
      'bg-red-600 text-white active:bg-red-700',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-medium transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
}
