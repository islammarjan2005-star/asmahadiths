import React from 'react';
import { ChevronLeft } from 'lucide-react';

export function ScreenHeader({ title, subtitle, onBack }) {
  return (
    <div className="pt-14 pb-4 px-5 max-w-lg mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-text-tertiary mb-4 active:text-text-secondary transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-body">Back</span>
      </button>
      <h1 className="text-display text-text-primary dark:text-cream-200">{title}</h1>
      {subtitle && (
        <p className="text-body text-text-tertiary mt-1">{subtitle}</p>
      )}
    </div>
  );
}
