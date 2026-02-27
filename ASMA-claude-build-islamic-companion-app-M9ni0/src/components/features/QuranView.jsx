import React, { useState } from 'react';
import { BookOpen, Bookmark, Share2, Heart, ChevronDown } from 'lucide-react';
import { Card, Badge, ScreenHeader } from '../ui';
import { quranicVerses, verseCategories } from '../../data';
import { useApp } from '../../context/AppContext';

export function QuranView({ onBack, onBrowseQuran }) {
  const { state, dispatch } = useApp();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedVerse, setExpandedVerse] = useState(null);

  const filteredVerses = selectedCategory
    ? quranicVerses.filter((v) => v.category === selectedCategory)
    : quranicVerses;

  const handleSave = (id) => {
    dispatch({ type: 'TOGGLE_SAVED_VERSE', payload: id });
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-night-300 pb-24">
      <ScreenHeader title="Quranic Verses" subtitle="Words of comfort & guidance" onBack={onBack} />
      <div className="px-5 max-w-lg mx-auto">

        {/* Browse Full Quran */}
        {onBrowseQuran && (
          <Card className="mb-6" variant="default" onClick={onBrowseQuran}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-100 dark:bg-gold-900/30 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-gold-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary dark:text-cream-200">Browse Full Quran</p>
                <p className="text-xs text-text-tertiary">114 Surahs · Word-by-word · Audio</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gold-400 -rotate-90" />
            </div>
          </Card>
        )}

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
          {verseCategories.map((cat) => (
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

        {/* Verses List */}
        <div className="space-y-4">
          {filteredVerses.map((verse) => {
            const isSaved = state.savedVerses.includes(verse.id);
            const isExpanded = expandedVerse === verse.id;

            return (
              <Card key={verse.id} className="overflow-hidden">
                <div className="p-5">
                  {/* Theme Badge */}
                  <Badge variant="default" className="mb-4">
                    {verse.theme}
                  </Badge>

                  {/* Arabic */}
                  <p
                    className="text-xl text-text-secondary dark:text-cream-200 leading-loose text-right font-arabic mb-4"
                    dir="rtl"
                  >
                    {verse.arabic}
                  </p>

                  {/* Translation */}
                  <p className="text-text-secondary dark:text-cream-300 leading-relaxed mb-4 italic">
                    "{verse.translation}"
                  </p>

                  {/* Reference & Actions */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-tertiary">{verse.reference}</p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSave(verse.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isSaved
                            ? 'bg-sanctuary-50 dark:bg-sanctuary-900/20 text-sanctuary-500'
                            : 'text-text-tertiary active:bg-cream-200 dark:active:bg-night-100'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                      <button className="p-2 rounded-lg text-text-tertiary active:bg-cream-200 dark:active:bg-night-100 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Tafsir */}
                <div className="border-t border-cream-300 dark:border-night-50">
                  <button
                    onClick={() => setExpandedVerse(isExpanded ? null : verse.id)}
                    className="w-full px-5 py-3 flex items-center justify-between text-text-tertiary dark:text-cream-300 active:bg-cream-100 dark:active:bg-night-100 transition-colors"
                  >
                    <span className="text-sm font-medium">Reflection & Tafsir</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-4 animate-fade-in">
                      <div className="p-4 bg-cream-200 dark:bg-night-200 rounded-xl">
                        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">
                          Understanding
                        </p>
                        <p className="text-text-secondary dark:text-cream-300 text-sm leading-relaxed">
                          {verse.tafsir}
                        </p>
                      </div>

                      <div className="p-4 bg-sanctuary-50 dark:bg-sanctuary-900/20 rounded-xl">
                        <p className="text-xs font-medium text-sanctuary-500 uppercase tracking-wide mb-2">
                          Personal Reflection
                        </p>
                        <p className="text-text-secondary dark:text-cream-300 text-sm leading-relaxed">
                          {verse.reflection}
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
