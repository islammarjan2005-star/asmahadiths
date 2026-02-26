import React from 'react';

/**
 * Beautiful Islamic geometric pattern overlay using SVG.
 * Renders as an absolute-positioned overlay — use inside a relative parent.
 */
export function IslamicPattern({ opacity = 0.08, className = '', color }) {
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
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-star-pattern)" className={color || 'text-cream-200'} />
      </svg>
    </div>
  );
}

/**
 * Horizontal Islamic geometric lattice strip — use as section divider
 */
export function LatticeBorder({ className = '' }) {
  return (
    <div className={`w-full overflow-hidden ${className}`} style={{ height: '20px' }}>
      <svg width="100%" height="20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="lattice-strip" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 L10 0 L20 10 L10 20 Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
            <path d="M20 10 L30 0 L40 10 L30 20 Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
            <circle cx="20" cy="10" r="2" fill="none" stroke="currentColor" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="20" fill="url(#lattice-strip)" className="text-gold-300/50 dark:text-gold-600/30" />
      </svg>
    </div>
  );
}

/**
 * Rectangular Islamic geometric frame — for onboarding name input
 */
export function LatticeFrame({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {/* Corner ornaments */}
      <svg className="absolute top-0 left-0 w-8 h-8 text-gold-300 dark:text-gold-600" viewBox="0 0 32 32">
        <path d="M0 0 L16 0 L16 4 L4 4 L4 16 L0 16 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M8 0 L8 8 L0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      <svg className="absolute top-0 right-0 w-8 h-8 text-gold-300 dark:text-gold-600" viewBox="0 0 32 32" style={{ transform: 'scaleX(-1)' }}>
        <path d="M0 0 L16 0 L16 4 L4 4 L4 16 L0 16 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M8 0 L8 8 L0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      <svg className="absolute bottom-0 left-0 w-8 h-8 text-gold-300 dark:text-gold-600" viewBox="0 0 32 32" style={{ transform: 'scaleY(-1)' }}>
        <path d="M0 0 L16 0 L16 4 L4 4 L4 16 L0 16 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M8 0 L8 8 L0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-8 h-8 text-gold-300 dark:text-gold-600" viewBox="0 0 32 32" style={{ transform: 'scale(-1)' }}>
        <path d="M0 0 L16 0 L16 4 L4 4 L4 16 L0 16 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M8 0 L8 8 L0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      {/* Content */}
      <div className="px-6 py-8">
        {children}
      </div>
    </div>
  );
}

/**
 * Decorative divider with Islamic geometric motif
 */
export function IslamicDivider({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 py-4 ${className}`}>
      <div className="flex-1 h-px bg-gold-200/50 dark:bg-gold-800/30" />
      <svg width="24" height="24" viewBox="0 0 24 24" className="text-gold-300 dark:text-gold-600">
        <path
          d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
      <div className="flex-1 h-px bg-gold-200/50 dark:bg-gold-800/30" />
    </div>
  );
}
