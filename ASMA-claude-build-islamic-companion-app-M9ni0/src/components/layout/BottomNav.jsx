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
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-2 safe-bottom">
      <div className="max-w-lg mx-auto bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl shadow-lg shadow-neutral-900/5 dark:shadow-none">
        <div className="flex items-center justify-around py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-neutral-400 dark:text-neutral-500 active:text-neutral-600 dark:active:text-neutral-300'
                }`}
              >
                <div className={`relative transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  <Icon
                    className={`w-5.5 h-5.5 ${
                      item.id === 'dhikr' && isActive ? 'fill-current' : ''
                    }`}
                    style={{ width: '22px', height: '22px' }}
                  />
                  {isActive && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
                  )}
                </div>
                <span className={`text-[10px] mt-1.5 font-medium transition-colors ${
                  isActive ? 'text-emerald-600 dark:text-emerald-400' : ''
                }`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
