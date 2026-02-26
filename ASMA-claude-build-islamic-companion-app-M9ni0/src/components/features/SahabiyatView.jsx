import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, BookOpen, Users } from 'lucide-react';
import { Card, Badge } from '../ui';
import { sahabiyatDatabase } from '../../data';

export function SahabiyatView({ onBack }) {
  const [selectedStory, setSelectedStory] = useState(null);

  if (selectedStory) {
    return (
      <StoryDetail story={selectedStory} onBack={() => setSelectedStory(null)} />
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-night-300 pb-24">
      <div className="p-5 pt-12 max-w-lg mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-tertiary mb-6 active:text-text-secondary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <Card className="p-5 mb-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-rose-400 dark:text-rose-400" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-text-primary dark:text-cream-200">
                Stories of Sahabiyat
              </h1>
              <p className="text-sm text-text-tertiary">Women of the Prophet's era</p>
            </div>
          </div>
          <p className="text-text-tertiary dark:text-cream-300 text-sm leading-relaxed">
            The remarkable women who shaped early Islam. Their stories of courage, scholarship, and
            faith.
          </p>
        </Card>

        {/* Stories List */}
        <div className="space-y-4">
          {sahabiyatDatabase.map((story) => (
            <Card
              key={story.id}
              className="p-4"
              onClick={() => setSelectedStory(story)}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/50 dark:to-rose-800/50 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-arabic text-rose-700 dark:text-rose-300">
                    {story.arabic.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-text-primary dark:text-cream-200">
                    {story.name}
                  </h3>
                  <p className="text-sm text-text-tertiary">{story.title}</p>
                  <p className="text-xs text-text-tertiary dark:text-cream-300 mt-1">
                    {story.summary}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-cream-300 dark:text-night-50" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoryDetail({ story, onBack }) {
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-night-300 pb-24">
      <div className="p-5 pt-12 max-w-lg mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-tertiary mb-6 active:text-text-secondary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        {/* Hero Card */}
        <Card className="p-6 mb-6 text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/50 dark:to-rose-800/50 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl font-arabic text-rose-700 dark:text-rose-300">
              {story.arabic.charAt(0)}
            </span>
          </div>
          <h1 className="text-2xl font-medium text-text-primary dark:text-cream-200 mb-1">
            {story.name}
          </h1>
          <p className="text-lg text-text-secondary dark:text-cream-200 font-arabic" dir="rtl">
            {story.arabic}
          </p>
          <Badge variant="rose" className="mt-3">
            {story.title}
          </Badge>
          <p className="text-xs text-text-tertiary mt-2">{story.era}</p>
        </Card>

        {/* Story */}
        <Card className="p-5 mb-6">
          <h2 className="text-sm font-medium text-text-tertiary uppercase tracking-wide mb-4">
            Her Story
          </h2>
          <div className="text-text-secondary dark:text-cream-300 leading-relaxed whitespace-pre-line text-sm">
            {story.story}
          </div>
        </Card>

        {/* Lessons */}
        <Card className="p-5 mb-6">
          <h2 className="text-sm font-medium text-text-tertiary uppercase tracking-wide mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-gold-500" />
            Lessons from Her Life
          </h2>
          <div className="space-y-3">
            {story.lessons.map((lesson, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold-100 dark:bg-gold-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-gold-700 dark:text-gold-300">
                    {i + 1}
                  </span>
                </div>
                <p className="text-text-secondary dark:text-cream-300 text-sm">{lesson}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Sources */}
        <Card className="p-4">
          <div className="flex items-center gap-2 text-text-tertiary">
            <BookOpen className="w-4 h-4" />
            <p className="text-xs">Sources: {story.sources.join(', ')}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
