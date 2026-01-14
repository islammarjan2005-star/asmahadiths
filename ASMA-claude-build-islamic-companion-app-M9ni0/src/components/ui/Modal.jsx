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
        className="absolute inset-0 bg-black/30 dark:bg-black/50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white dark:bg-neutral-800 rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden animate-slide-up shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 p-5 border-b border-neutral-100 dark:border-neutral-700 flex items-center justify-between bg-white dark:bg-neutral-800">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            )}
            <div>
              <h3 className="font-medium text-neutral-800 dark:text-neutral-100">{title}</h3>
              {subtitle && (
                <p className="text-xs text-neutral-400 dark:text-neutral-500">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 active:bg-neutral-100 dark:active:bg-neutral-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">{children}</div>
      </div>
    </div>
  );
}
