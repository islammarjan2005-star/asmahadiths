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
    <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
      <div className="p-5 pt-12 max-w-lg mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-tertiary mb-8 active:text-text-secondary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <Card padding={false} className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/50 rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-gold-600 dark:text-gold-400" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-text-primary">
                Culture vs Islam
              </h1>
              <p className="text-sm text-text-tertiary">Know the difference</p>
            </div>
          </div>
          <p className="text-text-secondary dark:text-cream-300 text-sm leading-relaxed">
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
                ? 'bg-sanctuary-600 text-white'
                : 'bg-cream-50 dark:bg-night-200 text-text-secondary dark:text-cream-300 border border-cream-300 dark:border-night-50'
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
                  ? 'bg-sanctuary-600 text-white'
                  : 'bg-cream-50 dark:bg-night-200 text-text-secondary dark:text-cream-300 border border-cream-300 dark:border-night-50'
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
                    <p className="text-text-secondary dark:text-cream-200 text-sm font-medium">
                      {item.myth}
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">Tap to see the evidence</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-cream-300 dark:text-night-50 transition-transform ${
                      expanded === item.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {expanded === item.id && (
                <div className="px-4 pb-4 border-t border-cream-300 dark:border-night-50 pt-4 animate-fade-in">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-6 h-6 bg-sanctuary-50 dark:bg-sanctuary-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-sanctuary-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-sanctuary-600 dark:text-sanctuary-400 mb-1">
                        What Islam Says
                      </p>
                      <p className="text-text-secondary dark:text-cream-300 text-sm">
                        {item.truth}
                      </p>
                      <p className="text-xs text-text-tertiary mt-2">{item.source}</p>
                    </div>
                  </div>

                  {item.explanation && (
                    <div className="p-3 bg-cream-200 dark:bg-night-300 rounded-xl">
                      <p className="text-xs font-medium text-text-tertiary mb-1">More Context</p>
                      <p className="text-text-secondary dark:text-cream-300 text-sm leading-relaxed">
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
