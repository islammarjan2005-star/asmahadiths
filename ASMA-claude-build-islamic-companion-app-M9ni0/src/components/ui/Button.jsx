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
      'bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 active:bg-stone-700 dark:active:bg-stone-200',
    secondary:
      'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 active:bg-stone-200',
    ghost:
      'bg-transparent text-stone-600 dark:text-stone-300 active:bg-stone-100 dark:active:bg-stone-700',
    warm:
      'bg-gradient-to-r from-orange-400 via-rose-500 to-fuchsia-500 text-white active:opacity-90 shadow-lg shadow-rose-500/20',
    rose:
      'bg-gradient-to-r from-rose-500 to-pink-500 text-white active:opacity-90 shadow-lg shadow-rose-500/20',
    emerald:
      'bg-emerald-600 text-white active:bg-emerald-700',
    danger:
      'bg-rose-600 text-white active:bg-rose-700',
  };

  const sizes = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-5 py-3.5 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-2xl font-semibold transition-all
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
