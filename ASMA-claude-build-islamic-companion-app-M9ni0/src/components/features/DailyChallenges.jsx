import React, { useMemo } from 'react';
import {
  ChevronLeft,
  Target,
  Check,
  Zap,
  Sun,
  Moon,
  BookOpen,
  Heart,
  Sparkles,
  Circle,
  Book,
  Trophy,
  Bookmark,
  Feather,
  Smile,
  Star,
} from 'lucide-react';
import { Card } from '../ui';
import { useApp } from '../../context/AppContext';
import { getTodayChallenges } from '../../data/challenges';

const iconMap = {
  Zap, Sun, Moon, BookOpen, Heart, Sparkles, Circle, Book, Trophy, Bookmark, Feather, Smile, Star, Target, Check,
};

export function DailyChallenges({ onBack, onNavigate }) {
  const { state, dispatch } = useApp();

  const todayChallenges = useMemo(() => getTodayChallenges(), []);
  const completedToday = state.completedChallenges || [];
  const todayStr = new Date().toDateString();

  const checkAndComplete = (challenge) => {
    const isAlreadyDone = completedToday.some(
      (c) => c.id === challenge.id && new Date(c.date).toDateString() === todayStr
    );
    if (isAlreadyDone) return;

    if (challenge.check(state)) {
      dispatch({
        type: 'COMPLETE_CHALLENGE',
        payload: { id: challenge.id, date: new Date().toISOString(), xp: challenge.xp },
      });
      dispatch({ type: 'ADD_XP', payload: { amount: challenge.xp, source: 'challenge' } });
    }
  };

  // Check all challenges on render
  useMemo(() => {
    todayChallenges.forEach((challenge) => checkAndComplete(challenge));
  }, [state]);

  const completedCount = todayChallenges.filter((c) =>
    completedToday.some(
      (done) => done.id === c.id && new Date(done.date).toDateString() === todayStr
    )
  ).length;

  const allComplete = completedCount === todayChallenges.length;

  // Get navigation target from challenge category
  const getNavTarget = (category) => {
    const map = {
      dhikr: 'dhikr',
      adhkar: 'adhkar',
      knowledge: 'home',
      reflection: 'journal',
      dua: 'coach',
      wellness: 'mood',
      quran: 'quran',
    };
    return map[category] || 'home';
  };

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
      <div className="p-5 pt-12 max-w-lg mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-tertiary mb-6 active:text-text-secondary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-medium text-text-primary dark:text-cream-200 mb-1">
            Today's Challenges
          </h1>
          <p className="text-sm text-text-tertiary">
            Small steps, great rewards
          </p>
        </div>

        {/* Progress */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-secondary dark:text-cream-300">
              Daily Progress
            </span>
            <span className="text-sm font-bold text-sanctuary-600 dark:text-sanctuary-400">
              {completedCount}/{todayChallenges.length}
            </span>
          </div>
          <div className="h-3 bg-cream-200 dark:bg-night-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                allComplete
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                  : 'bg-gradient-to-r from-sanctuary-400 to-sanctuary-500'
              }`}
              style={{ width: `${(completedCount / todayChallenges.length) * 100}%` }}
            />
          </div>
          {allComplete && (
            <p className="text-center text-sm text-amber-600 dark:text-amber-400 mt-3 font-medium animate-fade-in">
              Masha'Allah! All challenges complete!
            </p>
          )}
        </Card>

        {/* Challenge Cards */}
        <div className="space-y-3">
          {todayChallenges.map((challenge, index) => {
            const isComplete = completedToday.some(
              (c) => c.id === challenge.id && new Date(c.date).toDateString() === todayStr
            );
            const Icon = iconMap[challenge.icon] || Target;

            return (
              <Card
                key={challenge.id}
                className={`p-4 transition-all animate-slide-up ${
                  isComplete ? 'opacity-75' : ''
                }`}
                style={{ animationDelay: `${index * 80}ms` }}
                onClick={() => {
                  if (!isComplete) {
                    onNavigate?.(getNavTarget(challenge.category));
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      isComplete
                        ? 'bg-sanctuary-100 dark:bg-sanctuary-900/30'
                        : 'bg-cream-200 dark:bg-night-200'
                    }`}
                  >
                    {isComplete ? (
                      <Check className="w-6 h-6 text-sanctuary-500" />
                    ) : (
                      <Icon className="w-6 h-6 text-text-tertiary dark:text-cream-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-medium text-sm ${
                        isComplete
                          ? 'text-text-tertiary dark:text-cream-300 line-through'
                          : 'text-text-primary dark:text-cream-200'
                      }`}
                    >
                      {challenge.title}
                    </h3>
                    <p className="text-xs text-text-tertiary">{challenge.description}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold ${
                        isComplete ? 'text-sanctuary-500' : 'text-amber-500'
                      }`}
                    >
                      +{challenge.xp} XP
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Total XP from challenges today */}
        <Card className="p-4 mt-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-text-secondary dark:text-cream-200">
                Today's XP from Challenges
              </span>
            </div>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
              {todayChallenges
                .filter((c) =>
                  completedToday.some(
                    (done) => done.id === c.id && new Date(done.date).toDateString() === todayStr
                  )
                )
                .reduce((sum, c) => sum + c.xp, 0)}{' '}
              XP
            </span>
          </div>
        </Card>

        {/* Motivational card */}
        <Card className="p-5 mt-4 text-center">
          <p className="text-text-secondary dark:text-cream-300 text-sm italic leading-relaxed">
            "Whoever treads a path seeking knowledge, Allah will make easy for them a path to Paradise."
          </p>
          <p className="text-xs text-text-tertiary mt-2">— Sahih Muslim 2699</p>
        </Card>
      </div>
    </div>
  );
}
