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
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      <div className="max-w-lg mx-auto px-3 pb-2">
        <div className="bg-white/95 dark:bg-neutral-800/95 backdrop-blur-lg border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-lg">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-colors ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-neutral-400 dark:text-neutral-500 active:text-neutral-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${item.id === 'dhikr' && isActive ? 'fill-current' : ''}`} />
                  {isActive && (
                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1" />
                  )}
                  {!isActive && (
                    <span className="text-xs mt-1">{item.label}</span>
                  )}
                  {isActive && (
                    <span className="text-xs mt-0.5 font-medium">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
