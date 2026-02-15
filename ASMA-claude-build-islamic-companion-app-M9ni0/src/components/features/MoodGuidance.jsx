import React, { useState } from 'react';
import {
  ChevronLeft,
  BookOpen,
  Heart,
  Sparkles,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { Card, Button, MoodIcon } from '../ui';
import { useApp } from '../../context/AppContext';
import { moods, moodGuidanceContent } from '../../data/moodGuidance';

export function MoodGuidance({ onBack, onDhikr, onAdhkar, onJournal }) {
  const { state, dispatch } = useApp();
  const [selectedMood, setSelectedMood] = useState(null);
  const [showFullGuidance, setShowFullGuidance] = useState(false);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setShowFullGuidance(true);

    // Track mood check for achievements
    dispatch({ type: 'LOG_MOOD', payload: { mood: mood.id, date: new Date().toISOString() } });

    // Award XP for mood check
    dispatch({ type: 'ADD_XP', payload: { amount: 5, source: 'mood_check' } });
  };

  const guidance = selectedMood ? moodGuidanceContent[selectedMood.id] : null;

  // Mood selector screen
  if (!showFullGuidance) {
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

          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-2xl font-medium text-neutral-800 dark:text-neutral-100 mb-2">
              How are you feeling?
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              Let me find the right words for your heart today
            </p>
          </div>

          {/* Mood Grid */}
          <div className="grid grid-cols-2 gap-3">
            {moods.map((mood, index) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood)}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className={`p-5 text-center hover:scale-[1.02] active:scale-[0.98] transition-all ${mood.bgLight} ${mood.bgDark} border-2 border-transparent`}>
                  <div className="w-10 h-10 mx-auto mb-2">
                    <MoodIcon mood={mood.id} className="w-10 h-10 text-neutral-600 dark:text-neutral-300" />
                  </div>
                  <p className="font-medium text-neutral-700 dark:text-neutral-200 text-sm">
                    {mood.label}
                  </p>
                  <p className="text-xs text-neutral-400 font-arabic mt-1">{mood.arabic}</p>
                </Card>
              </button>
            ))}
          </div>

          {/* Recent moods */}
          {(state.moodHistory || []).length > 0 && (
            <div className="mt-8">
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3">
                Recent Check-ins
              </h3>
              <div className="flex gap-2 flex-wrap">
                {(state.moodHistory || []).slice(0, 7).map((entry, i) => {
                  const mood = moods.find((m) => m.id === entry.mood);
                  return mood ? (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs ${mood.bgLight} ${mood.bgDark}`}
                    >
                      <MoodIcon mood={mood.id} className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full guidance screen
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24">
      <div className="p-5 pt-12 max-w-lg mx-auto">
        {/* Header */}
        <button
          onClick={() => {
            setShowFullGuidance(false);
            setSelectedMood(null);
          }}
          className="flex items-center gap-2 text-neutral-400 mb-6 active:text-neutral-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Choose another mood</span>
        </button>

        {/* Mood Banner */}
        <div className={`rounded-2xl bg-gradient-to-br ${selectedMood.gradient} p-6 mb-6 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="mood-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M15 0L30 15L15 30L0 15Z" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#mood-pattern)" />
            </svg>
          </div>
          <div className="relative text-center">
            <div className="w-14 h-14 mx-auto mb-3">
              <MoodIcon mood={selectedMood.id} className="w-14 h-14 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">
              Feeling {selectedMood.label}
            </h2>
            <p className="text-white/80 text-sm">Here is what Allah has for you</p>
          </div>
        </div>

        {/* Quranic Verse */}
        {guidance && (
          <div className="space-y-4 animate-fade-in">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-medium text-neutral-800 dark:text-neutral-100 text-sm">
                  From the Quran
                </h3>
              </div>
              <p className="text-xl font-arabic text-neutral-800 dark:text-neutral-100 text-center leading-loose mb-4" dir="rtl">
                {guidance.verse.arabic}
              </p>
              <p className="text-neutral-600 dark:text-neutral-300 text-center text-sm italic mb-2">
                "{guidance.verse.translation}"
              </p>
              <p className="text-xs text-neutral-400 text-center">{guidance.verse.reference}</p>
            </Card>

            {/* Hadith */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-medium text-neutral-800 dark:text-neutral-100 text-sm">
                  From the Sunnah
                </h3>
              </div>
              <p className="text-neutral-600 dark:text-neutral-300 text-sm italic leading-relaxed mb-2">
                {guidance.hadith.text}
              </p>
              <p className="text-xs text-neutral-400">{guidance.hadith.source}</p>
            </Card>

            {/* Dua */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="font-medium text-neutral-800 dark:text-neutral-100 text-sm">
                  Make this Dua
                </h3>
              </div>
              <p className="text-lg font-arabic text-neutral-800 dark:text-neutral-100 text-center leading-loose mb-3" dir="rtl">
                {guidance.dua.arabic}
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-center text-xs italic mb-2">
                {guidance.dua.transliteration}
              </p>
              <p className="text-neutral-600 dark:text-neutral-300 text-center text-sm mb-2">
                "{guidance.dua.translation}"
              </p>
              <p className="text-xs text-neutral-400 text-center">{guidance.dua.source}</p>
            </Card>

            {/* Personal Advice */}
            <Card className="p-5 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-800/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="font-medium text-neutral-800 dark:text-neutral-100 text-sm">
                  A Gentle Reminder
                </h3>
              </div>
              <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                {guidance.advice}
              </p>
            </Card>

            {/* Suggested Action */}
            <Card
              className={`p-4 ${selectedMood.bgLight} ${selectedMood.bgDark}`}
              onClick={() => {
                if (guidance.actionSuggestion.includes('dhikr') || guidance.actionSuggestion.includes('SubhanAllah') || guidance.actionSuggestion.includes('Astaghfirullah')) {
                  onDhikr?.();
                } else if (guidance.actionSuggestion.includes('adhkar')) {
                  onAdhkar?.();
                } else if (guidance.actionSuggestion.includes('journal') || guidance.actionSuggestion.includes('Write')) {
                  onJournal?.();
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-neutral-500" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      Suggested Action
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {guidance.actionSuggestion}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400" />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
