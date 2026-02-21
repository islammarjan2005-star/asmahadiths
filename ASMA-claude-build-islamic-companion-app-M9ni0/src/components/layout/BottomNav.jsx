import React from 'react';
import { Home, Search, Bookmark, Circle, Settings } from 'lucide-react';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'dhikr', icon: Circle, label: 'Dhikr' },
  { id: 'saved', icon: Bookmark, label: 'Saved' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg border-t border-pink-100 dark:border-neutral-700 safe-bottom z-40 shadow-lg shadow-pink-900/5">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center py-2 px-4 transition-colors ${
                isActive
                  ? 'text-rose-500 dark:text-rose-400'
                  : 'text-neutral-400 dark:text-neutral-500'
              }`}
            >
              <Icon
                className={`w-6 h-6 ${
                  item.id === 'dhikr' && isActive ? 'fill-current' : ''
                }`}
              />
              <span className={`text-xs mt-1 ${isActive ? 'font-medium' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-rose-500 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
