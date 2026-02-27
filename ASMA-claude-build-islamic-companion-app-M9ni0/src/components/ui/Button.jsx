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
      'bg-cream-200 dark:bg-night-100 text-text-primary dark:text-cream-200 active:bg-cream-300 dark:active:bg-night-50',
    ghost:
      'bg-transparent text-text-secondary dark:text-cream-300 active:bg-cream-100 dark:active:bg-night-100',
    danger:
      'bg-red-500/10 text-red-600 dark:text-red-400 active:bg-red-500/20',
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
