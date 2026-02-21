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
    <nav className="fixed bottom-0 left-0 right-0 safe-bottom z-40">
      {/* Warm frosted glass background */}
      <div className="bg-white/85 dark:bg-stone-900/90 backdrop-blur-xl border-t border-orange-100/60 dark:border-stone-700/60 shadow-lg shadow-stone-900/5">
        <div className="max-w-lg mx-auto flex items-center justify-around py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center py-2 px-5 transition-all"
              >
                <div className={`p-2 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-br from-rose-100 to-orange-50 dark:from-rose-900/40 dark:to-orange-900/30 shadow-sm'
                    : ''
                }`}>
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive
                        ? 'text-rose-500 dark:text-rose-400'
                        : 'text-stone-400 dark:text-stone-500'
                    } ${item.id === 'dhikr' && isActive ? 'fill-current' : ''}`}
                  />
                </div>
                <span className={`text-xs mt-0.5 transition-colors ${
                  isActive
                    ? 'text-rose-500 dark:text-rose-400 font-semibold'
                    : 'text-stone-400 dark:text-stone-500'
                }`}>
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
