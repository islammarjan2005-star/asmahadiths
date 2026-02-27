import React, { useRef, useEffect, useState } from 'react';

const TAB_VIEWS = new Set(['home', 'search', 'dhikr', 'saved', 'settings']);

export function PageTransition({ viewKey, children }) {
  const prevView = useRef(viewKey);
  const [animClass, setAnimClass] = useState('animate-fade-in');

  useEffect(() => {
    const prev = prevView.current;
    prevView.current = viewKey;

    if (prev === viewKey) return;

    const prevIsTab = TAB_VIEWS.has(prev);
    const nextIsTab = TAB_VIEWS.has(viewKey);

    if (prevIsTab && nextIsTab) {
      // Tab switch: crossfade
      setAnimClass('animate-fade-in');
    } else if (viewKey === 'home') {
      // Going back to home: slide right
      setAnimClass('animate-slide-in-left');
    } else {
      // Drilling in: slide left
      setAnimClass('animate-slide-in-right');
    }
  }, [viewKey]);

  return (
    <div key={viewKey} className={animClass}>
      {children}
    </div>
  );
}
