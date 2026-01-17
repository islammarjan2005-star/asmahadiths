import React, { useState } from 'react';
import {
  Lock,
  Scale,
  BookOpen,
  Heart,
  Users,
  Clock,
  ChevronRight,
  Info,
  EyeOff,
  Book,
  Sun,
  Sparkles,
  Flame,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card } from '../ui';
import { hadithDatabase, topics } from '../../data';
import { usePrayerTimes } from '../../hooks';

export function HomeScreen({
  onSelectTopic,
  onAskSafely,
  onCultureVsIslam,
  onQuran,
  onDuas,
  onSahabiyat,
  onPrayerTimes,
  onSmartAdhkar,
  onDuaCoach,
}) {
  const [showPanic, setShowPanic] = useState(false);
  const { prayerTimes, getNextPrayer } = usePrayerTimes();
  const nextPrayer = getNextPrayer();

  // Daily hadith based on day of year
  const dayOfYear = Math.floor(Date.now() / 86400000);
  const dailyHadith = hadithDatabase[dayOfYear % hadithDatabase.length];

  // Panic mode - shows fake calculator
  if (showPanic) {
    return (
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6 w-full max-w-xs">
          <div className="text-right text-4xl font-light text-neutral-700 dark:text-neutral-200 mb-4 h-12 flex items-center justify-end">
            0
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              'C', '±', '%', '÷',
              '7', '8', '9', '×',
              '4', '5', '6', '−',
              '1', '2', '3', '+',
              '0', '.', '=',
            ].map((btn) => (
              <button
                key={btn}
                onClick={() => btn === 'C' && setShowPanic(false)}
                className={`p-3.5 rounded-xl text-lg font-medium transition-colors ${
                  ['÷', '×', '−', '+', '='].includes(btn)
                    ? 'bg-amber-500 text-white'
                    : ['C', '±', '%'].includes(btn)
                    ? 'bg-neutral-200 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-200'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 active:bg-neutral-200 dark:active:bg-neutral-600'
                } ${btn === '0' ? 'col-span-2' : ''}`}
              >
                {btn}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-neutral-400 dark:text-neutral-500 mt-4">
            Tap C to return
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24">
      <div className="p-5 pt-8 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-neutral-800 dark:text-neutral-100 tracking-tight">
              Asma
            </h1>
            <p className="text-sm text-neutral-400">Your safe space</p>
          </div>
          <button
            onClick={() => setShowPanic(true)}
            className="w-10 h-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl flex items-center justify-center active:bg-neutral-50 dark:active:bg-neutral-700 transition-colors"
            title="Panic button - shows calculator"
          >
            <EyeOff className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Prayer Times Card */}
        {nextPrayer && prayerTimes && (
          <Card className="p-4 mb-4" onClick={onPrayerTimes}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/50 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Next Prayer</p>
                  <p className="font-medium text-neutral-700 dark:text-neutral-200">
                    {nextPrayer.name}
                  </p>
                </div>
              </div>
              <p className="text-lg font-medium text-violet-600 dark:text-violet-400">
                {nextPrayer.time}
              </p>
            </div>
          </Card>
        )}

        {/* Daily Hadith */}
        <Card className="p-5 mb-6">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-3">
            Today's Reflection
          </p>
          <p className="text-neutral-600 dark:text-neutral-300 italic leading-relaxed mb-3">
            "{dailyHadith.text.substring(0, 100)}..."
          </p>
          <p className="text-xs text-neutral-400">{dailyHadith.source}</p>
        </Card>

        {/* Featured: Smart Adhkar & Dua Coach */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4 relative overflow-hidden" onClick={onSmartAdhkar}>
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-amber-200/30 to-orange-200/30 dark:from-amber-800/20 dark:to-orange-800/20 rounded-full blur-xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <h3 className="font-medium text-neutral-700 dark:text-neutral-200 text-sm">
                Daily Adhkar
              </h3>
              <p className="text-xs text-neutral-400">Guided morning & evening</p>
            </div>
          </Card>

          <Card className="p-4 relative overflow-hidden" onClick={onDuaCoach}>
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-teal-200/30 to-emerald-200/30 dark:from-teal-800/20 dark:to-emerald-800/20 rounded-full blur-xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="font-medium text-neutral-700 dark:text-neutral-200 text-sm">
                Dua Coach
              </h3>
              <p className="text-xs text-neutral-400">Find the perfect dua</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4" onClick={onAskSafely}>
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-medium text-neutral-700 dark:text-neutral-200 text-sm">
              Ask Safely
            </h3>
            <p className="text-xs text-neutral-400">AI-powered guidance</p>
          </Card>

          <Card className="p-4" onClick={onCultureVsIslam}>
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/50 rounded-xl flex items-center justify-center mb-3">
              <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-medium text-neutral-700 dark:text-neutral-200 text-sm">
              Culture vs Islam
            </h3>
            <p className="text-xs text-neutral-400">Know the difference</p>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Card className="p-4 text-center" onClick={onQuran}>
            <div className="w-10 h-10 mx-auto bg-teal-50 dark:bg-teal-900/50 rounded-xl flex items-center justify-center mb-2">
              <Book className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300">Quran</p>
          </Card>

          <Card className="p-4 text-center" onClick={onDuas}>
            <div className="w-10 h-10 mx-auto bg-indigo-50 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300">Duas</p>
          </Card>

          <Card className="p-4 text-center" onClick={onSahabiyat}>
            <div className="w-10 h-10 mx-auto bg-purple-50 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300">Sahabiyat</p>
          </Card>
        </div>

        {/* Topics */}
        <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-4">
          Explore Topics
        </h2>
        <div className="space-y-2">
          {topics.map((topic) => {
            const TopicIcon = Icons[topic.icon] || Icons.Circle;
            const count = hadithDatabase.filter((h) => h.topic === topic.id).length;
            return (
              <Card key={topic.id} className="p-4" onClick={() => onSelectTopic(topic)}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-700 rounded-xl flex items-center justify-center">
                    <TopicIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-700 dark:text-neutral-200 text-sm">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-neutral-400">{topic.description}</p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs text-neutral-400">{count}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Disclaimer */}
        <Card className="p-4 mt-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-neutral-400 flex-shrink-0" />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Asma uses AI to provide educational guidance with Islamic sources. This is not a
              substitute for scholarly advice.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
