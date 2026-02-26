import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  Star,
  Flame,
  Trophy,
  Target,
  BookOpen,
  Heart,
  Zap,
  Award,
  TrendingUp,
  Calendar,
  Check,
} from 'lucide-react';
import { Card, LevelIcon } from '../ui';
import { useApp } from '../../context/AppContext';
import { LEVELS, ACHIEVEMENTS, getLevel, getNextLevel, getLevelProgress } from '../../data/spiritualJourney';

export function SpiritualJourney({ onBack }) {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const xp = state.spiritualXP || 0;
  const currentLevel = getLevel(xp);
  const nextLevel = getNextLevel(xp);
  const progress = getLevelProgress(xp);
  const unlockedAchievements = state.achievements || [];

  // Calculate weekly activity from adhkar history
  const weeklyActivity = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayAdhkar = (state.adhkarHistory || []).filter(
        (h) => new Date(h.date).toDateString() === dateStr
      ).length;
      const dayDhikr = (state.dhikrHistory || []).filter(
        (h) => new Date(h.date).toDateString() === dateStr
      ).length;
      const dayChallenges = (state.completedChallenges || []).filter(
        (c) => new Date(c.date).toDateString() === dateStr
      ).length;
      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        total: dayAdhkar + dayDhikr + dayChallenges,
        date: dateStr,
      });
    }
    return days;
  }, [state.adhkarHistory, state.dhikrHistory, state.completedChallenges]);

  const maxActivity = Math.max(...weeklyActivity.map((d) => d.total), 1);

  // Stats
  const totalDhikr = (state.dhikrHistory || []).reduce((sum, h) => sum + (h.count || 0), 0);
  const totalJournals = (state.journal || []).length;
  const totalAdhkar = (state.adhkarHistory || []).length;

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

        {/* Level Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sanctuary-600 via-sanctuary-500 to-sanctuary-400 dark:from-sanctuary-700 dark:via-sanctuary-600 dark:to-sanctuary-500 p-6 mb-6">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="journey-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="8" fill="none" stroke="white" strokeWidth="0.5" />
                <circle cx="0" cy="0" r="4" fill="none" stroke="white" strokeWidth="0.5" />
                <circle cx="40" cy="0" r="4" fill="none" stroke="white" strokeWidth="0.5" />
                <circle cx="0" cy="40" r="4" fill="none" stroke="white" strokeWidth="0.5" />
                <circle cx="40" cy="40" r="4" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#journey-pattern)" />
            </svg>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sanctuary-100 text-sm mb-1">Your Spiritual Level</p>
                <div className="flex items-center gap-3">
                  <LevelIcon level={currentLevel.name} className="w-8 h-8 text-white" />
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{currentLevel.name}</h2>
                    <p className="text-sanctuary-200 font-arabic text-lg">{currentLevel.arabic}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{xp}</p>
                <p className="text-sanctuary-200 text-sm">Total XP</p>
              </div>
            </div>

            {/* Progress to next level */}
            {nextLevel && (
              <div>
                <div className="flex justify-between text-xs text-sanctuary-100 mb-2">
                  <span>{currentLevel.name}</span>
                  <span>{nextLevel.name} ({nextLevel.minXP} XP)</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-sanctuary-200 mt-2 text-center">
                  {nextLevel.minXP - xp} XP to next level
                </p>
              </div>
            )}
            {!nextLevel && (
              <p className="text-center text-sanctuary-100 text-sm mt-2">
                You've reached the highest level! Masha'Allah!
              </p>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 mb-6 bg-cream-200 dark:bg-night-200 p-1 rounded-xl">
          {['overview', 'achievements', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-cream-50 dark:bg-night-100 text-text-primary dark:text-cream-200 shadow-sm'
                  : 'text-text-tertiary dark:text-cream-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            {/* Weekly Activity */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-text-primary dark:text-cream-200 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sanctuary-500" />
                  This Week
                </h3>
                <Calendar className="w-4 h-4 text-text-tertiary" />
              </div>
              <div className="flex items-end justify-between gap-2 h-32">
                {weeklyActivity.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        day.total > 0
                          ? 'bg-gradient-to-t from-sanctuary-500 to-sanctuary-400'
                          : 'bg-cream-300 dark:bg-night-100'
                      }`}
                      style={{
                        height: `${day.total > 0 ? Math.max((day.total / maxActivity) * 100, 15) : 8}%`,
                        animationDelay: `${i * 50}ms`,
                      }}
                    />
                    <span className="text-xs text-text-tertiary">{day.day}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-500" />
                  </div>
                  <span className="text-2xl font-bold text-text-primary dark:text-cream-200">
                    {state.adhkarStreak?.current || 0}
                  </span>
                </div>
                <p className="text-xs text-text-tertiary">Day Streak</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-violet-500" />
                  </div>
                  <span className="text-2xl font-bold text-text-primary dark:text-cream-200">
                    {totalDhikr}
                  </span>
                </div>
                <p className="text-xs text-text-tertiary">Total Dhikr</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-2xl font-bold text-text-primary dark:text-cream-200">
                    {totalAdhkar}
                  </span>
                </div>
                <p className="text-xs text-text-tertiary">Adhkar Sessions</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-rose-500" />
                  </div>
                  <span className="text-2xl font-bold text-text-primary dark:text-cream-200">
                    {totalJournals}
                  </span>
                </div>
                <p className="text-xs text-text-tertiary">Reflections</p>
              </Card>
            </div>

            {/* Level roadmap */}
            <Card className="p-5">
              <h3 className="font-medium text-text-primary dark:text-cream-200 mb-4">
                Your Path
              </h3>
              <div className="space-y-3">
                {LEVELS.map((level) => {
                  const reached = xp >= level.minXP;
                  const isCurrent = level.name === currentLevel.name;
                  return (
                    <div key={level.name} className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          reached
                            ? 'bg-sanctuary-100 dark:bg-sanctuary-900/30 scale-100'
                            : 'bg-cream-200 dark:bg-night-200 scale-90 opacity-50'
                        } ${isCurrent ? 'ring-2 ring-sanctuary-500 ring-offset-2 dark:ring-offset-night-300' : ''}`}
                      >
                        <LevelIcon
                          level={level.name}
                          className={`w-5 h-5 ${reached ? 'text-sanctuary-600 dark:text-sanctuary-400' : 'text-text-tertiary'}`}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            reached
                              ? 'text-text-primary dark:text-cream-200'
                              : 'text-text-tertiary'
                          }`}
                        >
                          {level.name}
                          {isCurrent && (
                            <span className="ml-2 text-xs text-sanctuary-500 font-normal">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-text-tertiary">{level.minXP} XP</p>
                      </div>
                      {reached && (
                        <Check className="w-5 h-5 text-sanctuary-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-sm text-text-tertiary dark:text-cream-300 mb-2">
              {unlockedAchievements.length} of {ACHIEVEMENTS.length} unlocked
            </p>
            {ACHIEVEMENTS.map((achievement) => {
              const unlocked = unlockedAchievements.includes(achievement.id);
              const Icon = achievement.icon;
              return (
                <Card
                  key={achievement.id}
                  className={`p-4 transition-all ${
                    unlocked ? '' : 'opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        unlocked
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20'
                          : 'bg-cream-300 dark:bg-night-100'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          unlocked ? 'text-white' : 'text-text-tertiary'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-medium text-sm ${
                          unlocked
                            ? 'text-text-primary dark:text-cream-200'
                            : 'text-text-tertiary'
                        }`}
                      >
                        {achievement.name}
                      </h4>
                      <p className="text-xs text-text-tertiary">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-medium ${
                          unlocked ? 'text-amber-500' : 'text-text-tertiary'
                        }`}
                      >
                        +{achievement.xp} XP
                      </span>
                      {unlocked && (
                        <p className="text-xs text-sanctuary-500 mt-0.5">Unlocked</p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-4 animate-fade-in">
            <Card className="p-5">
              <h3 className="font-medium text-text-primary dark:text-cream-200 mb-4">
                Lifetime Statistics
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Total XP Earned', value: xp, icon: Star, color: 'amber' },
                  { label: 'Adhkar Sessions', value: totalAdhkar, icon: Trophy, color: 'sanctuary' },
                  { label: 'Total Dhikr Count', value: totalDhikr, icon: Zap, color: 'violet' },
                  { label: 'Journal Entries', value: totalJournals, icon: BookOpen, color: 'blue' },
                  { label: 'Saved Content', value: (state.savedHadith?.length || 0) + (state.savedVerses?.length || 0) + (state.savedDuas?.length || 0), icon: Heart, color: 'rose' },
                  { label: 'Best Streak', value: `${state.adhkarStreak?.longest || 0} days`, icon: Flame, color: 'orange' },
                  { label: 'Achievements', value: `${unlockedAchievements.length}/${ACHIEVEMENTS.length}`, icon: Award, color: 'yellow' },
                  { label: 'Challenges Done', value: (state.completedChallenges || []).length, icon: Target, color: 'teal' },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 text-${stat.color}-500`} />
                        <span className="text-sm text-text-secondary dark:text-cream-300">
                          {stat.label}
                        </span>
                      </div>
                      <span className="font-medium text-text-primary dark:text-cream-200">
                        {stat.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Inspirational quote */}
            <Card className="p-5 bg-gradient-to-br from-sanctuary-50 to-sanctuary-100 dark:from-sanctuary-900/20 dark:to-sanctuary-800/20 border-sanctuary-200 dark:border-sanctuary-800">
              <p className="text-center text-text-secondary dark:text-cream-300 italic text-sm leading-relaxed">
                "The most beloved deeds to Allah are those done consistently, even if they are small."
              </p>
              <p className="text-center text-xs text-text-tertiary mt-2">
                — Sahih al-Bukhari 6464
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
