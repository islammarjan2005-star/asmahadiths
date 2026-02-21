import React from 'react';

export function Card({ children, className = '', onClick, variant }) {
  return (
    <div
      onClick={onClick}
      className={`
        warm-card transition-all duration-200
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
