import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, X, CheckCircle, Scale } from 'lucide-react';
import { Card, Badge } from '../ui';
import { cultureVsIslam, mythCategories } from '../../data';

export function CultureVsIslam({ onBack }) {
  const [expanded, setExpanded] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredMyths = selectedCategory
    ? cultureVsIslam.filter((m) => m.category === selectedCategory)
    : cultureVsIslam;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24">
      <div className="p-5 pt-12 max-w-lg mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 mb-8 active:text-neutral-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/50 rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-neutral-800 dark:text-neutral-100">
                Culture vs Islam
              </h1>
              <p className="text-sm text-neutral-400">Know the difference</p>
            </div>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
            Many practices attributed to Islam are actually cultural. Here is the evidence from
            authentic sources.
          </p>
        </Card>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 hide-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              !selectedCategory
                ? 'bg-amber-600 text-white'
                : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
            }`}
          >
            All
          </button>
          {mythCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Myths List */}
        <div className="space-y-3">
          {filteredMyths.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden"
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-rose-50 dark:bg-rose-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-rose-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-neutral-700 dark:text-neutral-200 text-sm font-medium">
                      {item.myth}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">Tap to see the evidence</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-300 dark:text-neutral-600 transition-transform ${
                      expanded === item.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {expanded === item.id && (
                <div className="px-4 pb-4 border-t border-neutral-100 dark:border-neutral-700 pt-4 animate-fade-in">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-6 h-6 bg-emerald-50 dark:bg-emerald-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                        What Islam Says
                      </p>
                      <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                        {item.truth}
                      </p>
                      <p className="text-xs text-neutral-400 mt-2">{item.source}</p>
                    </div>
                  </div>

                  {item.explanation && (
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                      <p className="text-xs font-medium text-neutral-400 mb-1">More Context</p>
                      <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
