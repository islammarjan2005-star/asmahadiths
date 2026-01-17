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
      'bg-neutral-800 dark:bg-emerald-600 text-white active:bg-neutral-700 dark:active:bg-emerald-700',
    secondary:
      'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 active:bg-neutral-200 dark:active:bg-neutral-600',
    ghost:
      'bg-transparent text-neutral-600 dark:text-neutral-300 active:bg-neutral-100 dark:active:bg-neutral-700',
    emerald:
      'bg-emerald-600 text-white active:bg-emerald-700',
    danger:
      'bg-rose-600 text-white active:bg-rose-700',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-medium transition-colors
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
