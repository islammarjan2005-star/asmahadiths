import React from 'react';
import { ChevronLeft, Leaf } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card } from '../ui';
import { HadithCard } from './HadithCard';
import { hadithDatabase } from '../../data';

export function TopicView({ topic, onBack, onExplain }) {
  const relevantHadith = hadithDatabase.filter((h) => h.topic === topic.id);

  // Get the icon component
  const TopicIcon = Icons[topic.icon] || Icons.Circle;

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

        {/* Topic Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center">
            <TopicIcon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-neutral-800 dark:text-neutral-100">
              {topic.name}
            </h1>
            <p className="text-neutral-400">{topic.description}</p>
          </div>
        </div>

        <p className="text-sm text-neutral-400 mb-4">{relevantHadith.length} hadith</p>

        {/* Hadith List */}
        {relevantHadith.map((h) => (
          <HadithCard key={h.id} hadith={h} onExplain={onExplain} />
        ))}

        {relevantHadith.length === 0 && (
          <Card className="p-8 text-center">
            <Leaf className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400">More content coming soon.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
