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
  Moon,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card, LevelIcon } from '../ui';
import { hadithDatabase, topics } from '../../data';
import { usePrayerTimes } from '../../hooks';
import { useApp } from '../../context/AppContext';
import { getTodayChallenges } from '../../data/challenges';
import { getLevel, getNextLevel } from '../../data/spiritualJourney';
import { IslamicPattern } from './IslamicPattern';

const DAY_OF_YEAR = Math.floor(Date.now() / 86400000);

function MosqueSilhouette() {
  return (
    <svg viewBox="0 0 400 100" className="w-full" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="mosqueGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="55" rx="45" ry="40" fill="url(#mosqueGrad)" />
      <rect x="118" y="25" width="10" height="75" fill="url(#mosqueGrad)" rx="2" />
      <circle cx="123" cy="22" r="6" fill="url(#mosqueGrad)" />
      <rect x="272" y="25" width="10" height="75" fill="url(#mosqueGrad)" rx="2" />
      <circle cx="277" cy="22" r="6" fill="url(#mosqueGrad)" />
      <ellipse cx="200" cy="20" rx="2.5" ry="7" fill="url(#mosqueGrad)" />
      <rect x="148" y="55" width="104" height="45" fill="url(#mosqueGrad)" />
      <rect x="70" y="68" width="78" height="32" fill="url(#mosqueGrad)" rx="3" />
      <rect x="252" y="68" width="78" height="32" fill="url(#mosqueGrad)" rx="3" />
      <rect x="0" y="82" width="70" height="18" fill="url(#mosqueGrad)" />
      <rect x="330" y="82" width="70" height="18" fill="url(#mosqueGrad)" />
    </svg>
  );
}

function SectionLabel({ children }) {
  return (
    <h2 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest px-1 pt-5 pb-1">
      {children}
    </h2>
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

  const userName = state.userName || '';
  const xp = state.spiritualXP || 0;
  const currentLevel = getLevel(xp);
  const nextLevel = getNextLevel(xp);
  const levelProgress = nextLevel
    ? ((xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
    : 100;

  const dailyHadith = useMemo(() => {
    return hadithDatabase[DAY_OF_YEAR % hadithDatabase.length];
  }, []);

  const todayChallenges = useMemo(() => getTodayChallenges(), []);
  const completedToday = (state.completedChallenges || []).filter(
    (c) => new Date(c.date).toDateString() === new Date().toDateString()
  );
  const challengesCompleted = todayChallenges.filter((c) =>
    completedToday.some((done) => done.id === c.id)
  ).length;

  const streak = state.adhkarStreak?.current || 0;

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const arabicGreeting = 'السلام عليكم';

  if (showPanic) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-stone-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-2xl p-6 w-full max-w-xs">
          <div className="text-right text-4xl font-light text-stone-700 dark:text-stone-200 mb-4 h-12 flex items-center justify-end">
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
                    ? 'bg-stone-200 dark:bg-stone-600 text-stone-700 dark:text-stone-200'
                    : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 active:bg-stone-200'
                } ${btn === '0' ? 'col-span-2' : ''}`}
              >
                {btn}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-stone-400 mt-4">Tap C to return</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      {/* Warm Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-rose-400 to-fuchsia-500 dark:from-orange-900 dark:via-rose-900 dark:to-fuchsia-900 pt-14 pb-12 px-6">
        <IslamicPattern opacity={0.05} />

        {/* Warm ambient lights */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-8 w-32 h-32 bg-amber-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-4 right-4 w-40 h-40 bg-fuchsia-300/15 rounded-full blur-3xl" />
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-float"
              style={{
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                left: `${15 + Math.random() * 70}%`,
                top: `${15 + Math.random() * 70}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-lg mx-auto">
          {/* Greeting Row */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-white/60 text-sm font-arabic mb-0.5">{arabicGreeting}</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {greeting}{userName ? `, ${userName}` : ''}
              </h1>
            </div>
            <button
              onClick={() => setShowPanic(true)}
              className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center active:bg-white/25 transition-all"
            >
              <EyeOff className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Level Progress Card */}
          <div
            className="bg-white/15 backdrop-blur-md rounded-3xl p-5 border border-white/20 cursor-pointer active:bg-white/20 transition-all"
            onClick={onJourney}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
                  <LevelIcon level={currentLevel.name} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{currentLevel.name}</p>
                  <p className="text-xs text-white/60 font-arabic">{currentLevel.arabic}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl">
                <Zap className="w-3.5 h-3.5 text-amber-200" />
                <span className="text-sm font-bold text-white">{xp}</span>
                <span className="text-xs text-white/60">XP</span>
              </div>
            </div>
            <div className="h-2 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-300 to-white rounded-full transition-all duration-700"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            {nextLevel && (
              <p className="text-xs text-white/50 mt-2 text-right">
                {nextLevel.minXP - xp} XP to {nextLevel.name}
              </p>
            )}
          </div>
        </div>

        {/* Mosque silhouette */}
        <div className="absolute bottom-0 left-0 right-0 text-white translate-y-px">
          <MosqueSilhouette />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 max-w-lg mx-auto space-y-4 pt-4">

        {/* Next Prayer */}
        {nextPrayer && prayerTimes && (
          <Card className="p-5" onClick={onPrayerTimes}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Next Prayer</p>
                  <p className="text-lg font-bold text-stone-800 dark:text-stone-100">
                    {nextPrayer.name}
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-rose-500 dark:text-rose-400 tabular-nums">
                {nextPrayer.time}
              </p>
            </div>
          </Card>
        )}

        {/* Daily Reflection */}
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-100/60 to-transparent dark:from-amber-900/10 rounded-bl-full" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-amber-500" />
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Today's Reflection
              </p>
            </div>
            <p className="text-stone-600 dark:text-stone-300 italic leading-relaxed mb-3">
              &ldquo;{dailyHadith.text.substring(0, 140)}...&rdquo;
            </p>
            <p className="text-xs text-stone-400 font-medium">{dailyHadith.source}</p>
          </div>
        </Card>

        {/* Daily Challenges */}
        <Card className="p-5" onClick={onChallenges}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Daily Challenges</p>
                <p className="text-lg font-bold text-stone-800 dark:text-stone-100">
                  {challengesCompleted} of {todayChallenges.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {todayChallenges.map((c, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      completedToday.some((done) => done.id === c.id)
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                        : 'bg-stone-200 dark:bg-stone-600'
                    }`}
                  />
                ))}
              </div>
              <ChevronRight className="w-5 h-5 text-stone-300" />
            </div>
          </div>
        </Card>

        <SectionLabel>How can we help?</SectionLabel>

        {/* Mood & Qibla - Large warm cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5" onClick={onMood}>
            <div className="w-12 h-12 bg-gradient-to-br from-rose-300 to-pink-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-rose-300/30">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-1">
              How are you?
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">Mood-based guidance</p>
          </Card>

          <Card className="p-5" onClick={onQibla}>
            <div className="w-12 h-12 bg-gradient-to-br from-sky-300 to-blue-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-sky-300/30">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-1">
              Qibla
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">Find the direction</p>
          </Card>
        </div>

        {/* Adhkar & Dua Coach */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5" onClick={onSmartAdhkar}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-300 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-300/30">
                <Sun className="w-6 h-6 text-white" />
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-2.5 py-1 rounded-xl">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{streak}</span>
                </div>
              )}
            </div>
            <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-1">
              Daily Adhkar
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">Morning & evening</p>
          </Card>

          <Card className="p-5" onClick={onDuaCoach}>
            <div className="w-12 h-12 bg-gradient-to-br from-teal-300 to-emerald-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-300/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-1">
              Dua Coach
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">Find the perfect dua</p>
          </Card>
        </div>

        {/* Ask Safely & Culture vs Islam */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5" onClick={onAskSafely}>
            <div className="w-12 h-12 bg-gradient-to-br from-rose-200 to-pink-300 dark:from-rose-800/40 dark:to-pink-800/40 rounded-2xl flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-1">
              Ask Safely
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">Private AI guidance</p>
          </Card>

          <Card className="p-5" onClick={onCultureVsIslam}>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-orange-300 dark:from-amber-800/40 dark:to-orange-800/40 rounded-2xl flex items-center justify-center mb-4">
              <Scale className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-1">
              Culture vs Islam
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">Know the difference</p>
          </Card>
        </div>

        {/* Spiritual Journey - Featured warm banner */}
        <Card
          className="p-5 bg-gradient-to-r from-orange-50 via-rose-50 to-fuchsia-50 dark:from-orange-900/20 dark:via-rose-900/20 dark:to-fuchsia-900/20 border-orange-200/50 dark:border-orange-800/30"
          onClick={onJourney}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 via-rose-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-400/25">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-stone-800 dark:text-stone-100">
                Your Spiritual Journey
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <LevelIcon level={currentLevel.name} className="w-4 h-4 text-rose-500" />
                <span className="text-sm text-stone-500 dark:text-stone-400">
                  {currentLevel.name} &middot; {xp} XP
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </div>
        </Card>

        <SectionLabel>Explore</SectionLabel>

        {/* Quran, Duas, Sahabiyat */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-5 text-center" onClick={onQuran}>
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center mb-3">
              <Book className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">Quran</p>
          </Card>

          <Card className="p-5 text-center" onClick={onDuas}>
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-2xl flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">Duas</p>
          </Card>

          <Card className="p-5 text-center" onClick={onSahabiyat}>
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/30 dark:to-fuchsia-900/30 rounded-2xl flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">Sahabiyat</p>
          </Card>
        </div>

        {/* Journal */}
        <Card className="p-5" onClick={onJournal}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-200 to-pink-200 dark:from-rose-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
              <Feather className="w-6 h-6 text-rose-500 dark:text-rose-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-stone-800 dark:text-stone-100">
                Reflection Journal
              </h3>
              <p className="text-sm text-stone-400 mt-0.5">
                {(state.journal || []).length > 0
                  ? `${(state.journal || []).length} entries`
                  : 'Start writing your thoughts'}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </div>
        </Card>

        <SectionLabel>Topics</SectionLabel>

        {/* Topics */}
        <div className="space-y-3">
          {topics.map((topic) => {
            const TopicIcon = Icons[topic.icon] || Icons.Circle;
            const count = hadithDatabase.filter((h) => h.topic === topic.id).length;
            return (
              <Card key={topic.id} className="p-5" onClick={() => onSelectTopic(topic)}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-stone-100 to-stone-50 dark:from-stone-700 dark:to-stone-700 rounded-2xl flex items-center justify-center">
                    <TopicIcon className="w-5 h-5 text-stone-500 dark:text-stone-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-800 dark:text-stone-100">
                      {topic.name}
                    </h3>
                    <p className="text-sm text-stone-400 truncate">{topic.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400 bg-stone-100 dark:bg-stone-700 px-2.5 py-1 rounded-lg font-semibold">
                      {count}
                    </span>
                    <ChevronRight className="w-5 h-5 text-stone-300" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="warm-card p-4 mt-3 mb-2">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-stone-400 leading-relaxed">
              Asma uses AI to provide educational guidance with Islamic sources. This is not a
              substitute for scholarly advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
