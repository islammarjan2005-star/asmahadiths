import React from 'react';

/**
 * Beautiful Islamic geometric pattern overlay using SVG.
 * Renders as an absolute-positioned overlay — use inside a relative parent.
 */
export function IslamicPattern({ opacity = 0.08, className = '' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ opacity }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* 8-pointed star pattern */}
          <pattern
            id="islamic-star-pattern"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            {/* Central 8-pointed star */}
            <path
              d="M30 6 L34 22 L46 14 L38 26 L54 30 L38 34 L46 46 L34 38 L30 54 L26 38 L14 46 L22 34 L6 30 L22 26 L14 14 L26 22 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
            />
            {/* Inner octagon */}
            <path
              d="M30 18 L38 22 L42 30 L38 38 L30 42 L22 38 L18 30 L22 22 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
            />
            {/* Corner connectors */}
            <circle cx="0" cy="0" r="3" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <circle cx="60" cy="0" r="3" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <circle cx="0" cy="60" r="3" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <circle cx="60" cy="60" r="3" fill="none" stroke="currentColor" strokeWidth="0.3" />
          </pattern>

          {/* Simpler tessellation for smaller use */}
          <pattern
            id="islamic-tessellation"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 0 L40 20 L20 40 L0 20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <circle cx="20" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-star-pattern)" className="text-white" />
      </svg>
    </div>
  );
}

/**
 * Decorative divider with Islamic geometric motif
 */
export function IslamicDivider({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 py-4 ${className}`}>
      <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
      <svg width="24" height="24" viewBox="0 0 24 24" className="text-neutral-300 dark:text-neutral-600">
        <path
          d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
      <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
    </div>
  );
}
