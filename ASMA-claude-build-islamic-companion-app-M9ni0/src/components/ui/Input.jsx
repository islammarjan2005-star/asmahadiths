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
    bg-neutral-50 dark:bg-neutral-900
    border border-neutral-200 dark:border-neutral-700
    rounded-xl text-sm
    text-neutral-800 dark:text-neutral-100
    placeholder:text-neutral-400 dark:placeholder:text-neutral-500
    focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400
    transition-colors
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
