import React, { useState, useMemo } from 'react';
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
  Target,
  Compass,
  Star,
  Feather,
  Zap,
  TrendingUp,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card, LevelIcon } from '../ui';
import { hadithDatabase, topics } from '../../data';
import { usePrayerTimes } from '../../hooks';
import { useApp } from '../../context/AppContext';
import { getTodayChallenges } from '../../data/challenges';
import { getLevel, getNextLevel } from '../../data/spiritualJourney';
import { IslamicPattern } from './IslamicPattern';

// Module-level constant (computed once at import time, not during render)
const DAY_OF_YEAR = Math.floor(Date.now() / 86400000);

// Mosque silhouette SVG component
function MosqueSilhouette() {
  return (
    <svg
      viewBox="0 0 400 120"
      className="w-full text-pink-300/30 dark:text-pink-900/20"
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Main dome */}
      <ellipse cx="200" cy="60" rx="50" ry="45" fill="currentColor" />
      {/* Left minaret */}
      <rect x="110" y="20" width="12" height="100" fill="currentColor" rx="2" />
      <circle cx="116" cy="18" r="8" fill="currentColor" />
      {/* Right minaret */}
      <rect x="278" y="20" width="12" height="100" fill="currentColor" rx="2" />
      <circle cx="284" cy="18" r="8" fill="currentColor" />
      {/* Dome finial */}
      <ellipse cx="200" cy="20" rx="3" ry="8" fill="currentColor" />
      {/* Base */}
      <rect x="140" y="60" width="120" height="60" fill="currentColor" />
      {/* Side structures */}
      <rect x="60" y="70" width="80" height="50" fill="currentColor" rx="4" />
      <rect x="260" y="70" width="80" height="50" fill="currentColor" rx="4" />
      {/* Far left/right */}
      <rect x="0" y="90" width="60" height="30" fill="currentColor" />
      <rect x="340" y="90" width="60" height="30" fill="currentColor" />
    </svg>
  );
}

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
  onJourney,
  onMood,
  onQibla,
  onChallenges,
  onJournal,
}) {
  const { state } = useApp();
  const [showPanic, setShowPanic] = useState(false);
  const { prayerTimes, getNextPrayer } = usePrayerTimes();
  const nextPrayer = getNextPrayer();

  // User name
  const userName = state.userName || '';

  // Spiritual level
  const xp = state.spiritualXP || 0;
  const currentLevel = getLevel(xp);
  const nextLevel = getNextLevel(xp);
  const levelProgress = nextLevel
    ? ((xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
    : 100;

  // Daily hadith
  const dailyHadith = useMemo(() => {
    return hadithDatabase[DAY_OF_YEAR % hadithDatabase.length];
  }, []);

  // Today's challenges
  const todayChallenges = useMemo(() => getTodayChallenges(), []);
  const completedToday = (state.completedChallenges || []).filter(
    (c) => new Date(c.date).toDateString() === new Date().toDateString()
  );
  const challengesCompleted = todayChallenges.filter((c) =>
    completedToday.some((done) => done.id === c.id)
  ).length;

  // Streak
  const streak = state.adhkarStreak?.current || 0;

  // Panic mode
  if (showPanic) {
    return (
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl p-6 w-full max-w-xs">
          <div className="text-right text-4xl font-light text-neutral-700 dark:text-neutral-200 mb-4 h-12 flex items-center justify-end">
            0
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['C','±','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','.','='].map((btn) => (
              <button
                key={btn}
                onClick={() => btn === 'C' && setShowPanic(false)}
                className={`p-3.5 rounded-xl text-lg font-medium transition-colors ${
                  ['÷','×','−','+','='].includes(btn)
                    ? 'bg-amber-500 text-white'
                    : ['C','±','%'].includes(btn)
                    ? 'bg-neutral-200 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-200'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 active:bg-neutral-200'
                } ${btn === '0' ? 'col-span-2' : ''}`}
              >
                {btn}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-neutral-400 mt-4">Tap C to return</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-white dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 pb-28">
      {/* Pink Header with Islamic Pattern */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-400 via-rose-400 to-fuchsia-500 dark:from-pink-800 dark:via-rose-800 dark:to-fuchsia-900 pt-14 pb-8 px-5">
        <IslamicPattern opacity={0.08} />

        {/* Floating sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-lg mx-auto">
          {/* Greeting */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-pink-100">
                Assalamu Alaikum
              </span>
              <h1 className="text-3xl font-semibold text-white tracking-tight">
                {userName || 'Welcome back'}
              </h1>
            </div>
            <button
              onClick={() => setShowPanic(true)}
              className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center active:bg-white/25 transition-all"
              title="Panic button"
            >
              <EyeOff className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Level Progress - Glassmorphism */}
          <div
            className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 cursor-pointer active:bg-white/25 transition-all"
            onClick={onJourney}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <LevelIcon level={currentLevel.name} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white">
                    {currentLevel.name}
                  </span>
                  <span className="text-xs block text-pink-100 font-arabic">
                    {currentLevel.arabic}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-lg">
                <Zap className="w-3.5 h-3.5 text-amber-200" />
                <span className="text-sm font-bold text-white">{xp}</span>
                <span className="text-xs text-pink-100">XP</span>
              </div>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/70 rounded-full transition-all duration-700"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            {nextLevel && (
              <p className="text-xs text-pink-100 mt-1.5 text-right">
                {nextLevel.minXP - xp} XP to {nextLevel.name}
              </p>
            )}
          </div>
        </div>

        {/* Mosque silhouette at bottom of header */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1">
          <MosqueSilhouette />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 max-w-lg mx-auto space-y-3 pt-5">

        {/* Next Prayer - Glassmorphism card */}
        {nextPrayer && prayerTimes && (
          <Card variant="glass" className="p-4" onClick={onPrayerTimes}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Next Prayer</p>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-100">
                    {nextPrayer.name}
                  </p>
                </div>
              </div>
              <p className="text-xl font-semibold text-rose-500 dark:text-rose-400 tabular-nums">
                {nextPrayer.time}
              </p>
            </div>
          </Card>
        )}

        {/* Daily Challenges */}
        <Card variant="glass" className="p-4" onClick={onChallenges}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Daily Challenges</p>
                <p className="font-semibold text-neutral-800 dark:text-neutral-100">
                  {challengesCompleted}/{todayChallenges.length} complete
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {todayChallenges.map((c, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${
                      completedToday.some((done) => done.id === c.id)
                        ? 'bg-rose-500'
                        : 'bg-neutral-200 dark:bg-neutral-600'
                    }`}
                  />
                ))}
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-300" />
            </div>
          </div>
        </Card>

        {/* Daily Reflection */}
        <Card variant="glass" className="p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-pink-100/50 to-transparent dark:from-pink-900/10 rounded-bl-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-rose-500" />
              <p className="text-xs font-semibold text-rose-500 dark:text-rose-400 uppercase tracking-wide">
                Today's Reflection
              </p>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 italic leading-relaxed text-sm mb-3">
              "{dailyHadith.text.substring(0, 120)}..."
            </p>
            <p className="text-xs text-neutral-400">{dailyHadith.source}</p>
          </div>
        </Card>

        {/* Mood & Qibla */}
        <div className="grid grid-cols-2 gap-3">
          <Card variant="glass" className="p-4" onClick={onMood}>
            <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center mb-3 shadow-md shadow-violet-500/20">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
              How are you?
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">Mood-based guidance</p>
          </Card>

          <Card variant="glass" className="p-4" onClick={onQibla}>
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-xl flex items-center justify-center mb-3 shadow-md shadow-sky-500/20">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
              Qibla
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">Find the direction</p>
          </Card>
        </div>

        {/* Adhkar & Dua Coach */}
        <div className="grid grid-cols-2 gap-3">
          <Card variant="glass" className="p-4" onClick={onSmartAdhkar}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20">
                <Sun className="w-5 h-5 text-white" />
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-lg">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{streak}</span>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
              Daily Adhkar
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">Morning & evening</p>
          </Card>

          <Card variant="glass" className="p-4" onClick={onDuaCoach}>
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center mb-3 shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
              Dua Coach
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">Find the perfect dua</p>
          </Card>
        </div>

        {/* Ask Safely & Culture vs Islam */}
        <div className="grid grid-cols-2 gap-3">
          <Card variant="glass" className="p-4" onClick={onAskSafely}>
            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-rose-500 dark:text-rose-400" />
            </div>
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
              Ask Safely
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">AI-powered guidance</p>
          </Card>

          <Card variant="glass" className="p-4" onClick={onCultureVsIslam}>
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-3">
              <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
              Culture vs Islam
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">Know the difference</p>
          </Card>
        </div>

        {/* Spiritual Journey */}
        <Card
          variant="glass"
          className="p-4 bg-gradient-to-r from-pink-50/80 to-rose-50/80 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-800"
          onClick={onJourney}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-md shadow-pink-500/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
                Your Spiritual Journey
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <LevelIcon level={currentLevel.name} className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Level {currentLevel.name} &middot; {xp} XP
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-300" />
          </div>
        </Card>

        {/* Quran, Duas, Sahabiyat */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="glass" className="p-4 text-center" onClick={onQuran}>
            <div className="w-10 h-10 mx-auto bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-2">
              <Book className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Quran</p>
          </Card>

          <Card variant="glass" className="p-4 text-center" onClick={onDuas}>
            <div className="w-10 h-10 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Duas</p>
          </Card>

          <Card variant="glass" className="p-4 text-center" onClick={onSahabiyat}>
            <div className="w-10 h-10 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Sahabiyat</p>
          </Card>
        </div>

        {/* Journal */}
        <Card variant="glass" className="p-4" onClick={onJournal}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
              <Feather className="w-5 h-5 text-rose-500 dark:text-rose-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
                Reflection Journal
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                {(state.journal || []).length > 0
                  ? `${(state.journal || []).length} entries`
                  : 'Start your reflections'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300" />
          </div>
        </Card>

        {/* Topics */}
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide pt-4">
          Explore Topics
        </h2>
        <div className="space-y-2">
          {topics.map((topic) => {
            const TopicIcon = Icons[topic.icon] || Icons.Circle;
            const count = hadithDatabase.filter((h) => h.topic === topic.id).length;
            return (
              <Card variant="glass" key={topic.id} className="p-4" onClick={() => onSelectTopic(topic)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-700 rounded-xl flex items-center justify-center">
                    <TopicIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-neutral-400 truncate">{topic.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-700 px-2 py-0.5 rounded-md">
                      {count}
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-300" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Disclaimer */}
        <Card variant="glass" className="p-4 mt-4">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-neutral-400 leading-relaxed">
              Asma uses AI to provide educational guidance with Islamic sources. This is not a
              substitute for scholarly advice.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
