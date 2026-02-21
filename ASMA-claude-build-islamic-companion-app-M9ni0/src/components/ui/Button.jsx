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
      'bg-emerald-700 text-white active:bg-emerald-800',
    secondary:
      'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 active:bg-slate-200',
    ghost:
      'bg-transparent text-slate-600 dark:text-slate-300 active:bg-slate-100 dark:active:bg-slate-700',
    warm:
      'bg-emerald-700 text-white active:bg-emerald-800',
    rose:
      'bg-emerald-700 text-white active:bg-emerald-800',
    emerald:
      'bg-emerald-700 text-white active:bg-emerald-800',
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
