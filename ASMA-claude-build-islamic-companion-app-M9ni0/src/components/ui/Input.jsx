import React from 'react';

export function Input({
  value,
  onChange,
  onKeyDown,
  placeholder,
  type = 'text',
  className = '',
  multiline = false,
  rows = 3,
}) {
  const baseClasses = `
    w-full px-4 py-3
    bg-cream-50 dark:bg-night-200
    border border-cream-300 dark:border-night-50
    rounded-xl text-sm
    text-text-primary dark:text-cream-200
    placeholder:text-text-tertiary dark:placeholder:text-cream-400
    focus:outline-none focus:border-sanctuary-400 dark:focus:border-sanctuary-500
    focus:ring-2 focus:ring-sanctuary-400/20
    transition-all duration-200
  `;

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        rows={rows}
        className={`${baseClasses} resize-none ${className}`}
      />
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`${baseClasses} ${className}`}
    />
  );
}
