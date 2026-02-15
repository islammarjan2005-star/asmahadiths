import React from 'react';

// ===== LEVEL ICONS =====

export function SeedlingIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <path
        d="M16 28V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 18C16 14 12 10 8 10C8 14 12 18 16 18Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M16 18C16 14 12 10 8 10C8 14 12 18 16 18Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 14C16 10 20 6 24 6C24 10 20 14 16 14Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M16 14C16 10 20 6 24 6C24 10 20 14 16 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SproutIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <path
        d="M16 28V14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 16C14 12 10 9 6 9C6 13 10 16 16 16Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M16 16C14 12 10 9 6 9C6 13 10 16 16 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 12C18 8 22 5 26 5C26 9 22 12 16 12Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M16 12C18 8 22 5 26 5C26 9 22 12 16 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 20C18 18 21 16 24 16C24 18 21 20 16 20Z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M16 20C18 18 21 16 24 16C24 18 21 20 16 20Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BlossomIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      {/* Petals */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse
          key={angle}
          cx="16"
          cy="9"
          rx="4"
          ry="7"
          fill="currentColor"
          opacity="0.15"
          transform={`rotate(${angle} 16 16)`}
        />
      ))}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse
          key={`s${angle}`}
          cx="16"
          cy="9"
          rx="4"
          ry="7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.6"
          transform={`rotate(${angle} 16 16)`}
        />
      ))}
      {/* Center */}
      <circle cx="16" cy="16" r="4" fill="currentColor" opacity="0.3" />
      <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function TreeIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      {/* Trunk */}
      <rect x="14" y="20" width="4" height="10" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="14" y="20" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1" />
      {/* Canopy layers */}
      <path
        d="M16 3L24 14H8L16 3Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M16 3L24 14H8L16 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 8L26 21H6L16 8Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M16 8L26 21H6L16 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GardenIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      {/* Ground */}
      <path
        d="M2 28C2 28 8 24 16 24C24 24 30 28 30 28"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* Left flower */}
      <circle cx="9" cy="12" r="4" fill="currentColor" opacity="0.15" />
      <circle cx="9" cy="12" r="4" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="9" cy="12" r="1.5" fill="currentColor" opacity="0.4" />
      <path d="M9 16V24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 19C7 17.5 5.5 18 5 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      {/* Center flower */}
      <circle cx="16" cy="8" r="5" fill="currentColor" opacity="0.2" />
      <circle cx="16" cy="8" r="5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16" cy="8" r="2" fill="currentColor" opacity="0.4" />
      <path d="M16 13V24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 17C18.5 15 20 15.5 21 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      {/* Right flower */}
      <circle cx="23" cy="11" r="3.5" fill="currentColor" opacity="0.15" />
      <circle cx="23" cy="11" r="3.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="23" cy="11" r="1.2" fill="currentColor" opacity="0.4" />
      <path d="M23 14.5V24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function OasisIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      {/* Water */}
      <path
        d="M4 22C4 22 8 20 16 20C24 20 28 22 28 22C28 24 24 28 16 28C8 28 4 24 4 22Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M4 22C4 22 8 20 16 20C24 20 28 22 28 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Palm tree */}
      <path d="M16 22V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Palm leaves */}
      <path
        d="M16 10C14 6 10 4 7 5C9 7 12 9 16 10Z"
        fill="currentColor"
        opacity="0.25"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M16 10C18 6 22 4 25 5C23 7 20 9 16 10Z"
        fill="currentColor"
        opacity="0.2"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M16 10C14 8 10 8 8 9C10 10 13 10 16 10Z"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M16 10C18 8 22 8 24 9C22 10 19 10 16 10Z"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Sun reflection on water */}
      <path d="M12 24C12 24 14 23 16 23C18 23 20 24 20 24" stroke="currentColor" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

export function LightIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      {/* Outer glow */}
      <circle cx="16" cy="16" r="12" fill="currentColor" opacity="0.06" />
      <circle cx="16" cy="16" r="8" fill="currentColor" opacity="0.1" />
      {/* Rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="16"
          y1="16"
          x2={16 + 14 * Math.cos((angle * Math.PI) / 180)}
          y2={16 + 14 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth={angle % 90 === 0 ? '1.5' : '0.8'}
          opacity={angle % 90 === 0 ? '0.5' : '0.25'}
          strokeLinecap="round"
        />
      ))}
      {/* Inner star (4-point) */}
      <path
        d="M16 6L18 13L25 12L19 16L25 20L18 19L16 26L14 19L7 20L13 16L7 12L14 13Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M16 6L18 13L25 12L19 16L25 20L18 19L16 26L14 19L7 20L13 16L7 12L14 13Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Center */}
      <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function MosqueIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      {/* Main dome */}
      <path
        d="M8 18C8 12 12 7 16 5C20 7 24 12 24 18"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M8 18C8 12 12 7 16 5C20 7 24 12 24 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Crescent on top */}
      <path
        d="M16 5V3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M15 3.5C14.5 3.2 14.5 2.3 15.5 2C14 2.3 13.5 3.7 15 4C15.3 3.8 15.2 3.6 15 3.5Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Base */}
      <rect x="6" y="18" width="20" height="10" rx="1" fill="currentColor" opacity="0.1" />
      <rect x="6" y="18" width="20" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
      {/* Door */}
      <path
        d="M13 28V22C13 20.5 14.5 19 16 19C17.5 19 19 20.5 19 22V28"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M13 28V22C13 20.5 14.5 19 16 19C17.5 19 19 20.5 19 22V28"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      {/* Minaret left */}
      <rect x="3" y="14" width="3" height="14" rx="0.5" fill="currentColor" opacity="0.1" />
      <rect x="3" y="14" width="3" height="14" rx="0.5" stroke="currentColor" strokeWidth="1" />
      <path d="M4.5 14L3 16H6L4.5 14Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="0.8" />
      {/* Minaret right */}
      <rect x="26" y="14" width="3" height="14" rx="0.5" fill="currentColor" opacity="0.1" />
      <rect x="26" y="14" width="3" height="14" rx="0.5" stroke="currentColor" strokeWidth="1" />
      <path d="M27.5 14L26 16H29L27.5 14Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

// ===== MOOD ICONS =====

export function AnxiousIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <circle cx="16" cy="16" r="12" fill="currentColor" opacity="0.1" />
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" />
      {/* Worried brows */}
      <path d="M10 11C11 9.5 13 10 13 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 11C21 9.5 19 10 19 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="12" cy="14" r="1.5" fill="currentColor" />
      <circle cx="20" cy="14" r="1.5" fill="currentColor" />
      {/* Wavy mouth */}
      <path d="M11 20C12.5 19 14 21 16 19C18 21 19.5 19 21 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Sweat drop */}
      <path d="M24 8C24 8 25.5 10 25.5 11.5C25.5 12.5 24.8 13 24 13C23.2 13 22.5 12.5 22.5 11.5C22.5 10 24 8 24 8Z" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function SadIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <circle cx="16" cy="16" r="12" fill="currentColor" opacity="0.1" />
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" />
      {/* Eyes */}
      <circle cx="12" cy="13" r="1.5" fill="currentColor" />
      <circle cx="20" cy="13" r="1.5" fill="currentColor" />
      {/* Tear */}
      <path d="M21 15C21 15 22 17 22 18C22 19 21.3 19.5 20.5 19.5C19.7 19.5 19 19 19 18C19 17 21 15 21 15Z" fill="currentColor" opacity="0.25" />
      {/* Sad mouth */}
      <path d="M11 22C13 19.5 19 19.5 21 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function GratefulIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      {/* Open hands (palms up for dua) */}
      <path
        d="M6 20C6 16 8 12 10 10L12 12C10 14 9 17 9 20V26H6V20Z"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M26 20C26 16 24 12 22 10L20 12C22 14 23 17 23 20V26H26V20Z"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Fingers */}
      <path d="M9 20L7 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M10 19L8.5 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M23 20L25 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M22 19L23.5 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      {/* Light from above */}
      <path d="M16 3V7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <path d="M12 4L13 7" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
      <path d="M20 4L19 7" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function AngryIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <circle cx="16" cy="16" r="12" fill="currentColor" opacity="0.1" />
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" />
      {/* Angry brows */}
      <path d="M9 10L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M23 10L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="12" cy="15" r="1.5" fill="currentColor" />
      <circle cx="20" cy="15" r="1.5" fill="currentColor" />
      {/* Tight mouth */}
      <path d="M12 21H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LonelyIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <circle cx="16" cy="16" r="12" fill="currentColor" opacity="0.1" />
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" />
      {/* Big pleading eyes */}
      <circle cx="12" cy="14" r="3" fill="currentColor" opacity="0.15" />
      <circle cx="12" cy="14" r="3" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="13.5" r="1.5" fill="currentColor" />
      <circle cx="13" cy="12.5" r="0.5" fill="white" opacity="0.8" />
      <circle cx="20" cy="14" r="3" fill="currentColor" opacity="0.15" />
      <circle cx="20" cy="14" r="3" stroke="currentColor" strokeWidth="1" />
      <circle cx="20" cy="13.5" r="1.5" fill="currentColor" />
      <circle cx="21" cy="12.5" r="0.5" fill="white" opacity="0.8" />
      {/* Brows */}
      <path d="M9 10.5C10 9.5 12 9 14 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M23 10.5C22 9.5 20 9 18 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Small frown */}
      <path d="M13 22C14.5 20.5 17.5 20.5 19 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function HopefulIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      {/* Sunrise rays */}
      {[-60, -30, 0, 30, 60].map((angle) => (
        <line
          key={angle}
          x1="16"
          y1="20"
          x2={16 + 14 * Math.cos(((angle - 90) * Math.PI) / 180)}
          y2={20 + 14 * Math.sin(((angle - 90) * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth={angle === 0 ? '1.5' : '1'}
          opacity={angle === 0 ? '0.4' : '0.2'}
          strokeLinecap="round"
        />
      ))}
      {/* Horizon */}
      <path d="M2 22H30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {/* Sun half */}
      <path
        d="M8 22C8 17.6 11.6 14 16 14C20.4 14 24 17.6 24 22"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M8 22C8 17.6 11.6 14 16 14C20.4 14 24 17.6 24 22"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Ground reflection */}
      <path d="M10 25H22" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      <path d="M12 27H20" stroke="currentColor" strokeWidth="0.8" opacity="0.15" strokeLinecap="round" />
    </svg>
  );
}

export function OverwhelmedIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <circle cx="16" cy="16" r="12" fill="currentColor" opacity="0.1" />
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" />
      {/* Closed/squished eyes */}
      <path d="M9 14C10 12.5 12.5 12.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 14C19 12.5 21.5 12.5 23 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Open distressed mouth */}
      <ellipse cx="16" cy="21" rx="3.5" ry="3" fill="currentColor" opacity="0.15" />
      <ellipse cx="16" cy="21" rx="3.5" ry="3" stroke="currentColor" strokeWidth="1.5" />
      {/* Stress lines */}
      <path d="M5 6L7 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M27 6L25 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M3 10L5 10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
      <path d="M29 10L27 10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
    </svg>
  );
}

export function PeacefulIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} {...props}>
      {/* Dove body */}
      <path
        d="M8 18C6 16 6 12 10 10C12 9 14 10 16 12C18 10 20 9 22 10C26 12 26 16 24 18L16 26L8 18Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M8 18C6 16 6 12 10 10C12 9 14 10 16 12C18 10 20 9 22 10C26 12 26 16 24 18L16 26L8 18Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Wing detail left */}
      <path
        d="M10 14C8 12 4 12 3 14C5 14 8 15 10 16"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
        strokeLinecap="round"
      />
      {/* Wing detail right */}
      <path
        d="M22 14C24 12 28 12 29 14C27 14 24 15 22 16"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
        strokeLinecap="round"
      />
      {/* Olive branch */}
      <path d="M16 26C16 26 18 24 20 26" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <circle cx="20.5" cy="25.5" r="1" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

// ===== LOOKUP COMPONENTS =====

/**
 * Render a level icon by level name.
 * Falls back to SeedlingIcon if not found.
 */
export function LevelIcon({ level, className = 'w-6 h-6', ...props }) {
  const map = {
    Seedling: SeedlingIcon,
    Sprout: SproutIcon,
    Blossom: BlossomIcon,
    Tree: TreeIcon,
    Garden: GardenIcon,
    Oasis: OasisIcon,
    Light: LightIcon,
    'Paradise Garden': MosqueIcon,
  };
  const IconComponent = map[level] || SeedlingIcon;
  return <IconComponent className={className} {...props} />;
}

/**
 * Render a mood icon by mood id.
 * Falls back to PeacefulIcon if not found.
 */
export function MoodIcon({ mood, className = 'w-6 h-6', ...props }) {
  const map = {
    anxious: AnxiousIcon,
    sad: SadIcon,
    grateful: GratefulIcon,
    angry: AngryIcon,
    lonely: LonelyIcon,
    hopeful: HopefulIcon,
    overwhelmed: OverwhelmedIcon,
    peaceful: PeacefulIcon,
  };
  const IconComponent = map[mood] || PeacefulIcon;
  return <IconComponent className={className} {...props} />;
}
