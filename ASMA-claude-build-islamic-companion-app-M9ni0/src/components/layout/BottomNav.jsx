import React from 'react';
import { Home, Compass, Circle, Bookmark, Settings } from 'lucide-react';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Compass, label: 'Explore' },
  { id: 'dhikr', icon: Circle, label: 'Dhikr' },
  { id: 'saved', icon: Bookmark, label: 'Saved' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream-100/95 dark:bg-night-300/95 backdrop-blur-lg border-t border-cream-300/50 dark:border-night-50/50 safe-bottom z-40">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center py-1 px-5 transition-colors ${
                  isActive
                    ? 'text-sanctuary-600 dark:text-sanctuary-400'
                    : 'text-text-tertiary dark:text-cream-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${item.id === 'dhikr' && isActive ? 'fill-current' : ''}`} />
                <span className={`text-xs mt-1 ${isActive ? 'font-medium' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
