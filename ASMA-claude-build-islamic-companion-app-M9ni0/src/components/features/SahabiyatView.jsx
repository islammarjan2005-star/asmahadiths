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
            <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-neutral-800 dark:text-neutral-100">
                Stories of Sahabiyat
              </h1>
              <p className="text-sm text-neutral-400">Women of the Prophet's ﷺ era</p>
            </div>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
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
                <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/50 dark:to-rose-900/50 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-arabic text-pink-700 dark:text-pink-300">
                    {story.arabic.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-800 dark:text-neutral-100">
                    {story.name}
                  </h3>
                  <p className="text-sm text-neutral-400">{story.title}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {story.summary}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-300 dark:text-neutral-600" />
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

        {/* Hero Card */}
        <Card className="p-6 mb-6 text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/50 dark:to-rose-900/50 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl font-arabic text-pink-700 dark:text-pink-300">
              {story.arabic.charAt(0)}
            </span>
          </div>
          <h1 className="text-2xl font-medium text-neutral-800 dark:text-neutral-100 mb-1">
            {story.name}
          </h1>
          <p className="text-lg text-neutral-700 dark:text-neutral-200 font-arabic" dir="rtl">
            {story.arabic}
          </p>
          <Badge variant="rose" className="mt-3">
            {story.title}
          </Badge>
          <p className="text-xs text-neutral-400 mt-2">{story.era}</p>
        </Card>

        {/* Story */}
        <Card className="p-5 mb-6">
          <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wide mb-4">
            Her Story
          </h2>
          <div className="text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line text-sm">
            {story.story}
          </div>
        </Card>

        {/* Lessons */}
        <Card className="p-5 mb-6">
          <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            Lessons from Her Life
          </h2>
          <div className="space-y-3">
            {story.lessons.map((lesson, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    {i + 1}
                  </span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm">{lesson}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Sources */}
        <Card className="p-4">
          <div className="flex items-center gap-2 text-neutral-400">
            <BookOpen className="w-4 h-4" />
            <p className="text-xs">Sources: {story.sources.join(', ')}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
