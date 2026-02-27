import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, subtitle, icon: Icon, children }) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-sanctuary-950/25 dark:bg-black/50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-cream-50 dark:bg-night-200 rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden animate-scale-in shadow-elevated">
        {/* Header */}
        <div className="sticky top-0 z-10 p-5 border-b border-cream-300 dark:border-night-50 flex items-center justify-between bg-cream-50 dark:bg-night-200">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 bg-sanctuary-50 dark:bg-sanctuary-900/30 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-sanctuary-600 dark:text-sanctuary-400" />
              </div>
            )}
            <div>
              <h3 className="font-medium text-text-primary dark:text-cream-200">{title}</h3>
              {subtitle && (
                <p className="text-xs text-text-tertiary dark:text-cream-400">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 active:bg-cream-200 dark:active:bg-night-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-tertiary" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">{children}</div>
      </div>
    </div>
  );
}
