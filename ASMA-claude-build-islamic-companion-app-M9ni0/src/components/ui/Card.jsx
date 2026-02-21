import React from 'react';

export function Card({ children, className = '', onClick, variant }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-slate-800 rounded-2xl
        shadow-sm shadow-slate-900/5 dark:shadow-none
        border border-slate-100 dark:border-slate-700/50
        transition-all duration-150
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
