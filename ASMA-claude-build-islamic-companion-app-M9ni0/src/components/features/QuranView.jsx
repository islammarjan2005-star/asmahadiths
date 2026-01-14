import React, { useState } from 'react';
import { ChevronLeft, BookOpen, Bookmark, Share2, Heart, ChevronDown } from 'lucide-react';
import { Card, Badge } from '../ui';
import { quranicVerses, verseCategories } from '../../data';
import { useApp } from '../../context/AppContext';

export function QuranView({ onBack }) {
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24">
      <div className="p-5 pt-12 max-w-lg mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 mb-6 active:text-neutral-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <Card className="p-5 mb-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/50 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-neutral-800 dark:text-neutral-100">
                Quranic Verses
              </h1>
              <p className="text-sm text-neutral-400">Words of comfort & guidance</p>
            </div>
          </div>
        </Card>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 hide-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              !selectedCategory
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
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
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
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
                  <Badge variant="rose" className="mb-4">
                    {verse.theme}
                  </Badge>

                  {/* Arabic */}
                  <p
                    className="text-xl text-neutral-700 dark:text-neutral-200 leading-loose text-right font-arabic mb-4"
                    dir="rtl"
                  >
                    {verse.arabic}
                  </p>

                  {/* Translation */}
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4 italic">
                    "{verse.translation}"
                  </p>

                  {/* Reference & Actions */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-400">{verse.reference}</p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSave(verse.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isSaved
                            ? 'bg-rose-50 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400'
                            : 'text-neutral-400 active:bg-neutral-100 dark:active:bg-neutral-700'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                      <button className="p-2 rounded-lg text-neutral-400 active:bg-neutral-100 dark:active:bg-neutral-700 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Tafsir */}
                <div className="border-t border-neutral-100 dark:border-neutral-700">
                  <button
                    onClick={() => setExpandedVerse(isExpanded ? null : verse.id)}
                    className="w-full px-5 py-3 flex items-center justify-between text-neutral-500 dark:text-neutral-400 active:bg-neutral-50 dark:active:bg-neutral-700/50 transition-colors"
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
                      <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
                          Understanding
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                          {verse.tafsir}
                        </p>
                      </div>

                      <div className="p-4 bg-rose-50 dark:bg-rose-900/30 rounded-xl">
                        <p className="text-xs font-medium text-rose-700 dark:text-rose-400 uppercase tracking-wide mb-2">
                          Personal Reflection
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
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
