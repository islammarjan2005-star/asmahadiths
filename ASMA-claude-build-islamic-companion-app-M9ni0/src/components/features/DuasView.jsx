import React, { useState } from 'react';
import { ChevronLeft, Heart, Share2, BookOpen, ChevronDown, Volume2 } from 'lucide-react';
import { Card, Badge } from '../ui';
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
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-neutral-800 dark:text-neutral-100">
                Daily Duas
              </h1>
              <p className="text-sm text-neutral-400">Supplications for every moment</p>
            </div>
          </div>
        </Card>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 hide-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              !selectedCategory
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
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
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
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
                    <Badge variant="blue">{dua.time}</Badge>
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-lg text-neutral-400 active:bg-neutral-100 dark:active:bg-neutral-700 transition-colors">
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSave(dua.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isSaved
                            ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                            : 'text-neutral-400 active:bg-neutral-100 dark:active:bg-neutral-700'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Arabic */}
                  <p
                    className="text-xl text-neutral-700 dark:text-neutral-200 leading-loose text-right font-arabic mb-4"
                    dir="rtl"
                  >
                    {dua.arabic}
                  </p>

                  {/* Transliteration */}
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm italic mb-3">
                    {dua.transliteration}
                  </p>

                  {/* Translation */}
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
                    "{dua.translation}"
                  </p>

                  {/* Source */}
                  <p className="text-xs text-neutral-400">{dua.source}</p>
                </div>

                {/* Expandable Section */}
                <div className="border-t border-neutral-100 dark:border-neutral-700">
                  <button
                    onClick={() => setExpandedDua(isExpanded ? null : dua.id)}
                    className="w-full px-5 py-3 flex items-center justify-between text-neutral-500 dark:text-neutral-400 active:bg-neutral-50 dark:active:bg-neutral-700/50 transition-colors"
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
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                        <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400 uppercase tracking-wide mb-2">
                          Why This Dua
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
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
