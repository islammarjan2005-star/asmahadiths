import React, { useState } from 'react';
import { Heart, Share2, BookOpen, ChevronDown, Volume2 } from 'lucide-react';
import { Card, Badge, ScreenHeader } from '../ui';
import { duasDatabase, duaCategories } from '../../data';
import { useApp } from '../../context/AppContext';

export function DuasView({ onBack }) {
  const { state, dispatch } = useApp();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedDua, setExpandedDua] = useState(null);

  const filteredDuas = selectedCategory
    ? duasDatabase.filter((d) => d.category === selectedCategory)
    : duasDatabase;

  const handleSave = (id) => {
    dispatch({ type: 'TOGGLE_SAVED_DUA', payload: id });
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-night-300 pb-24">
      <ScreenHeader title="Daily Duas" subtitle="Supplications for every moment" onBack={onBack} />
      <div className="px-5 max-w-lg mx-auto">

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 hide-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              !selectedCategory
                ? 'bg-sanctuary-600 text-white'
                : 'bg-cream-100 dark:bg-night-200 text-text-secondary dark:text-cream-300 border border-cream-300 dark:border-night-50'
            }`}
          >
            All
          </button>
          {duaCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-sanctuary-600 text-white'
                  : 'bg-cream-100 dark:bg-night-200 text-text-secondary dark:text-cream-300 border border-cream-300 dark:border-night-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Duas List */}
        <div className="space-y-4">
          {filteredDuas.map((dua) => {
            const isSaved = state.savedDuas.includes(dua.id);
            const isExpanded = expandedDua === dua.id;

            return (
              <Card key={dua.id} className="overflow-hidden">
                <div className="p-5">
                  {/* Time Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="default">{dua.time}</Badge>
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-lg text-text-tertiary active:bg-cream-200 dark:active:bg-night-100 transition-colors">
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSave(dua.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isSaved
                            ? 'bg-sanctuary-50 dark:bg-sanctuary-900/20 text-sanctuary-500'
                            : 'text-text-tertiary active:bg-cream-200 dark:active:bg-night-100'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Arabic */}
                  <p
                    className="text-xl text-text-secondary dark:text-cream-200 leading-loose text-right font-arabic mb-4"
                    dir="rtl"
                  >
                    {dua.arabic}
                  </p>

                  {/* Transliteration */}
                  <p className="text-text-tertiary dark:text-cream-300 text-sm italic mb-3">
                    {dua.transliteration}
                  </p>

                  {/* Translation */}
                  <p className="text-text-secondary dark:text-cream-300 leading-relaxed mb-3">
                    "{dua.translation}"
                  </p>

                  {/* Source */}
                  <p className="text-xs text-text-tertiary">{dua.source}</p>
                </div>

                {/* Expandable Section */}
                <div className="border-t border-cream-300 dark:border-night-50">
                  <button
                    onClick={() => setExpandedDua(isExpanded ? null : dua.id)}
                    className="w-full px-5 py-3 flex items-center justify-between text-text-tertiary dark:text-cream-300 active:bg-cream-100 dark:active:bg-night-100 transition-colors"
                  >
                    <span className="text-sm font-medium">Learn More</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 animate-fade-in">
                      <div className="p-4 bg-sanctuary-50 dark:bg-sanctuary-900/20 rounded-xl">
                        <p className="text-xs font-medium text-sanctuary-500 uppercase tracking-wide mb-2">
                          Why This Dua
                        </p>
                        <p className="text-text-secondary dark:text-cream-300 text-sm leading-relaxed">
                          {dua.benefit}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
