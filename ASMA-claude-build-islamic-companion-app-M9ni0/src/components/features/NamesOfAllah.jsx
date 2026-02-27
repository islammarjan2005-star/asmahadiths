import React, { useState, useMemo } from 'react';
import { Search, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, ScreenHeader } from '../ui';

// Inline a subset of names — full list provided by data file
const FALLBACK_NAMES = [
  { id: 1, name: 'Ar-Rahman', arabic: 'الرَّحْمَنُ', meaning: 'The Most Gracious', reflection: 'Allah\'s mercy encompasses everything. Begin every act knowing His grace surrounds you.' },
  { id: 2, name: 'Ar-Raheem', arabic: 'الرَّحِيمُ', meaning: 'The Most Merciful', reflection: 'His special mercy is reserved for the believers. Trust that He is always gentle with you.' },
  { id: 3, name: 'Al-Malik', arabic: 'الْمَلِكُ', meaning: 'The King', reflection: 'All sovereignty belongs to Allah alone. Find peace in knowing the best King rules over all.' },
];

export function NamesOfAllah({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [names, setNames] = useState(null);

  // Try to load full data dynamically
  useMemo(() => {
    import('../../data/asmaUlHusna').then(mod => {
      if (mod.asmaUlHusna) setNames(mod.asmaUlHusna);
    }).catch(() => {
      setNames(FALLBACK_NAMES);
    });
  }, []);

  const allNames = names || FALLBACK_NAMES;

  // Daily name based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const dailyName = allNames[dayOfYear % allNames.length];

  const filteredNames = searchQuery
    ? allNames.filter(
        (n) =>
          n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.arabic.includes(searchQuery)
      )
    : allNames;

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
      <ScreenHeader title="99 Names of Allah" subtitle="أسماء الله الحسنى" onBack={onBack} />

      {/* Daily Name Highlight & Search */}
      <div className="px-4 max-w-lg mx-auto">
        {dailyName && (
          <div className="bg-sanctuary-50 dark:bg-sanctuary-900/20 rounded-2xl p-5 text-center mb-4">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Star className="w-3.5 h-3.5 text-gold-400" />
              <p className="text-xs text-gold-600 dark:text-gold-400 uppercase tracking-wider font-medium">Name of the Day</p>
            </div>
            <p className="font-arabic text-4xl text-text-primary dark:text-cream-200 mb-2">{dailyName.arabic}</p>
            <p className="text-gold-600 dark:text-gold-400 font-medium mb-1">{dailyName.name}</p>
            <p className="text-text-tertiary text-sm">{dailyName.meaning}</p>
            {dailyName.reflection && (
              <p className="text-text-tertiary text-xs mt-3 italic leading-relaxed">
                {dailyName.reflection}
              </p>
            )}
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cream-50 dark:bg-night-100 rounded-xl text-sm text-text-primary dark:text-cream-200 placeholder-text-tertiary border border-cream-300 dark:border-night-50 focus:ring-1 focus:ring-sanctuary-400/30 outline-none"
          />
        </div>
      </div>

      {/* Names Grid */}
      <div className="px-4 max-w-lg mx-auto mt-4">
        {searchQuery ? (
          // List view for search results
          <div className="space-y-2">
            {filteredNames.map((name) => (
              <NameCard
                key={name.id}
                name={name}
                expanded={expandedId === name.id}
                onToggle={() => setExpandedId(expandedId === name.id ? null : name.id)}
              />
            ))}
            {filteredNames.length === 0 && (
              <p className="text-center text-text-tertiary py-8">No names found</p>
            )}
          </div>
        ) : (
          // Grid view
          <div className="grid grid-cols-3 gap-2 mb-4">
            {allNames.map((name) => (
              <button
                key={name.id}
                onClick={() => setExpandedId(expandedId === name.id ? null : name.id)}
                className={`p-3 rounded-xl text-center transition-all ${
                  expandedId === name.id
                    ? 'bg-sanctuary-50 dark:bg-sanctuary-900/30 ring-1 ring-sanctuary-400'
                    : 'bg-cream-50 dark:bg-night-100'
                }`}
              >
                <p className="font-arabic text-lg text-text-primary dark:text-cream-200 mb-0.5">
                  {name.arabic}
                </p>
                <p className="text-xs text-text-tertiary truncate">{name.name}</p>
              </button>
            ))}
          </div>
        )}

        {/* Expanded detail overlay */}
        {expandedId && !searchQuery && (
          <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-24 animate-slide-up">
            <div className="max-w-lg mx-auto">
              <NameCard
                name={allNames.find(n => n.id === expandedId)}
                expanded={true}
                onToggle={() => setExpandedId(null)}
                elevated
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NameCard({ name, expanded, onToggle, elevated }) {
  if (!name) return null;

  return (
    <Card
      className={`${elevated ? 'shadow-elevated' : ''}`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold-50 dark:bg-gold-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-gold-600 dark:text-gold-400">{name.id}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary dark:text-cream-200">{name.name}</p>
            <p className="text-xs text-text-tertiary">{name.meaning}</p>
          </div>
        </div>
        <p className="font-arabic text-xl text-text-primary dark:text-cream-200">{name.arabic}</p>
      </div>
      {expanded && name.reflection && (
        <div className="mt-3 pt-3 border-t border-cream-300 dark:border-night-50 animate-fade-in">
          <p className="text-sm text-text-secondary dark:text-cream-300 leading-relaxed italic">
            {name.reflection}
          </p>
        </div>
      )}
    </Card>
  );
}
