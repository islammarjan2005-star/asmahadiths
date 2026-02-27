import React, { useState, useMemo } from 'react';
import {
  Star,
  Trophy,
  BookOpen,
  Heart,
  Check,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Card, ScreenHeader } from '../ui';
import { useApp } from '../../context/AppContext';

// Will be loaded from data file
const FALLBACK_TRIVIA = [
  { id: 1, question: 'How many times do Muslims pray every day?', options: ['3', '4', '5', '6'], answer: '5', difficulty: 'easy', explanation: 'Muslims pray Fajr, Dhuhr, Asr, Maghrib, and Isha.' },
];
const FALLBACK_STORIES = [];
const FALLBACK_DUAS = [];

export function KidsMode({ onBack }) {
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState('trivia');
  const [kidsData, setKidsData] = useState(null);

  // Trivia state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [expandedStory, setExpandedStory] = useState(null);

  // Load kids data
  useMemo(() => {
    import('../../data/kidsContent').then(mod => {
      setKidsData({
        trivia: mod.kidsTrivia || FALLBACK_TRIVIA,
        stories: mod.kidsStories || FALLBACK_STORIES,
        duas: mod.kidsDailyDuas || FALLBACK_DUAS,
      });
    }).catch(() => {
      setKidsData({ trivia: FALLBACK_TRIVIA, stories: FALLBACK_STORIES, duas: FALLBACK_DUAS });
    });
  }, []);

  const data = kidsData || { trivia: FALLBACK_TRIVIA, stories: FALLBACK_STORIES, duas: FALLBACK_DUAS };
  const kidsProgress = state.kidsProgress || { trivia: 0, stickers: 0, streak: 0 };

  const handleAnswer = (option) => {
    if (showResult) return;
    setSelectedAnswer(option);
    setShowResult(true);
    const correct = option === data.trivia[currentQuestion]?.answer;
    if (correct) {
      setScore(s => s + 1);
      dispatch({ type: 'ADD_XP', payload: { amount: 5 } });
      dispatch({ type: 'UPDATE_KIDS_PROGRESS', payload: { trivia: (kidsProgress.trivia || 0) + 1, stickers: (kidsProgress.stickers || 0) + 1 } });
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < data.trivia.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCurrentQuestion(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  // Daily dua (one per day)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const dailyDua = data.duas[dayOfYear % Math.max(data.duas.length, 1)];

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
      <ScreenHeader title="Kids Zone" onBack={onBack} />

      {/* Stars earned & Tab bar */}
      <div className="px-4 max-w-lg mx-auto mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
          <span className="text-sm text-gold-600 dark:text-gold-400 font-medium">
            {kidsProgress.stickers || 0} stars earned
          </span>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 bg-cream-200 dark:bg-night-200 p-1 rounded-xl">
          {[
            { id: 'trivia', label: 'Quiz', icon: Trophy },
            { id: 'stories', label: 'Stories', icon: BookOpen },
            { id: 'duas', label: 'Daily Dua', icon: Heart },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                tab === id
                  ? 'bg-cream-50 dark:bg-night-100 text-sanctuary-700 dark:text-sanctuary-400 shadow-sm'
                  : 'text-text-tertiary'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto mt-4">
        {/* Trivia Tab */}
        {tab === 'trivia' && data.trivia.length > 0 && (
          <div className="space-y-4">
            <Card padding={false} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-text-tertiary">
                  Question {currentQuestion + 1} of {data.trivia.length}
                </span>
                <span className="text-xs font-medium text-gold-600 dark:text-gold-400">
                  Score: {score}
                </span>
              </div>

              <p className="text-lg font-semibold text-text-primary dark:text-cream-200 mb-5 leading-relaxed">
                {data.trivia[currentQuestion]?.question}
              </p>

              <div className="space-y-2">
                {data.trivia[currentQuestion]?.options.map((option, i) => {
                  const isCorrect = option === data.trivia[currentQuestion]?.answer;
                  const isSelected = option === selectedAnswer;

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                      className={`w-full p-3.5 rounded-xl text-left text-sm font-medium transition-all ${
                        showResult
                          ? isCorrect
                            ? 'bg-sanctuary-100 dark:bg-sanctuary-900/30 text-sanctuary-700 dark:text-sanctuary-400 ring-2 ring-sanctuary-500'
                            : isSelected
                            ? 'bg-rose-100 dark:bg-rose-600/10 text-rose-600 dark:text-rose-400 ring-2 ring-rose-400'
                            : 'bg-cream-200 dark:bg-night-100 text-text-tertiary'
                          : 'bg-cream-200 dark:bg-night-100 text-text-primary dark:text-cream-200 active:bg-cream-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>{option}</span>
                        {showResult && isCorrect && <Check className="w-4 h-4 ml-auto" />}
                        {showResult && isSelected && !isCorrect && <X className="w-4 h-4 ml-auto" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div className="mt-4 animate-fade-in">
                  <p className={`text-sm mb-3 ${
                    selectedAnswer === data.trivia[currentQuestion]?.answer
                      ? 'text-sanctuary-600 dark:text-sanctuary-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {selectedAnswer === data.trivia[currentQuestion]?.answer
                      ? 'MashaAllah! Correct!'
                      : 'Not quite — keep learning!'}
                  </p>
                  {data.trivia[currentQuestion]?.explanation && (
                    <p className="text-xs text-text-tertiary mb-3">
                      {data.trivia[currentQuestion].explanation}
                    </p>
                  )}
                  <button
                    onClick={nextQuestion}
                    className="w-full py-2.5 bg-sanctuary-600 text-white rounded-xl text-sm font-medium"
                  >
                    Next Question
                  </button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Stories Tab */}
        {tab === 'stories' && (
          <div className="space-y-3">
            {data.stories.length === 0 ? (
              <p className="text-center text-text-tertiary py-8">Stories loading...</p>
            ) : (
              data.stories.map((story) => (
                <Card
                  key={story.id}
                  onClick={() => setExpandedStory(expandedStory === story.id ? null : story.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-50 dark:bg-gold-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-gold-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text-primary dark:text-cream-200">
                        {story.title}
                      </p>
                      <p className="text-xs text-text-tertiary">{story.lesson}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-cream-400 transition-transform ${
                      expandedStory === story.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                  {expandedStory === story.id && (
                    <div className="mt-3 pt-3 border-t border-cream-300 dark:border-night-50 animate-fade-in">
                      <p className="text-sm text-text-secondary dark:text-cream-300 leading-relaxed">
                        {story.content}
                      </p>
                      {story.relatedDua && (
                        <p className="font-arabic text-base text-gold-600 dark:text-gold-400 mt-3 text-right" dir="rtl">
                          {story.relatedDua}
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {/* Daily Dua Tab */}
        {tab === 'duas' && (
          <div className="space-y-3">
            {dailyDua && (
              <Card padding={false} className="p-5" variant="default">
                <div className="flex items-center gap-1.5 mb-3">
                  <Star className="w-3.5 h-3.5 text-gold-400" />
                  <p className="text-xs font-medium text-gold-600 dark:text-gold-400 uppercase tracking-wider">
                    Today's Dua
                  </p>
                </div>
                <p className="font-arabic text-2xl text-text-primary dark:text-cream-200 text-center mb-3" dir="rtl">
                  {dailyDua.arabic}
                </p>
                {dailyDua.transliteration && (
                  <p className="text-sm text-text-tertiary text-center italic mb-2">
                    {dailyDua.transliteration}
                  </p>
                )}
                <p className="text-sm text-text-secondary dark:text-cream-300 text-center">
                  {dailyDua.meaning}
                </p>
                {dailyDua.tip && (
                  <p className="text-xs text-gold-600 dark:text-gold-400 text-center mt-3 bg-gold-50 dark:bg-gold-900/20 rounded-lg p-2">
                    {dailyDua.tip}
                  </p>
                )}
              </Card>
            )}

            <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider px-1">
              All Duas
            </p>
            {data.duas.map((dua, i) => (
              <Card key={i}>
                <p className="text-xs text-gold-600 dark:text-gold-400 font-medium mb-1">{dua.name}</p>
                <p className="font-arabic text-lg text-text-primary dark:text-cream-200 text-right mb-1" dir="rtl">
                  {dua.arabic}
                </p>
                {dua.transliteration && (
                  <p className="text-xs text-text-tertiary italic">{dua.transliteration}</p>
                )}
                <p className="text-sm text-text-secondary dark:text-cream-300 mt-1">{dua.meaning}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
