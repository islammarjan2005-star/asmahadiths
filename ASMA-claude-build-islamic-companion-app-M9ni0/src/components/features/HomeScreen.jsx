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
  Moon,
  Sunrise,
  Sunset,
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

// Time-of-day configuration
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 7) return 'fajr';
  if (hour >= 7 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 15) return 'dhuhr';
  if (hour >= 15 && hour < 17) return 'asr';
  if (hour >= 17 && hour < 19) return 'maghrib';
  if (hour >= 19 && hour < 21) return 'isha';
  return 'night';
}

const timeThemes = {
  fajr: {
    greeting: 'Blessed Fajr',
    gradient: 'from-indigo-900 via-purple-800 to-rose-700',
    textColor: 'text-rose-100',
    subColor: 'text-purple-200',
    icon: Sunrise,
  },
  morning: {
    greeting: 'Good Morning',
    gradient: 'from-amber-400 via-orange-300 to-yellow-200',
    textColor: 'text-amber-900',
    subColor: 'text-amber-700',
    icon: Sun,
  },
  dhuhr: {
    greeting: 'Blessed Afternoon',
    gradient: 'from-sky-400 via-blue-300 to-cyan-200',
    textColor: 'text-sky-900',
    subColor: 'text-sky-700',
    icon: Sun,
  },
  asr: {
    greeting: 'Good Afternoon',
    gradient: 'from-orange-400 via-amber-300 to-yellow-200',
    textColor: 'text-orange-900',
    subColor: 'text-orange-700',
    icon: Sun,
  },
  maghrib: {
    greeting: 'Beautiful Maghrib',
    gradient: 'from-orange-600 via-rose-500 to-purple-600',
    textColor: 'text-orange-100',
    subColor: 'text-rose-200',
    icon: Sunset,
  },
  isha: {
    greeting: 'Peaceful Evening',
    gradient: 'from-indigo-800 via-purple-700 to-violet-600',
    textColor: 'text-indigo-100',
    subColor: 'text-purple-200',
    icon: Moon,
  },
  night: {
    greeting: 'Restful Night',
    gradient: 'from-slate-900 via-indigo-900 to-purple-900',
    textColor: 'text-slate-100',
    subColor: 'text-indigo-300',
    icon: Moon,
  },
};

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

  // Time-based theme
  const timeOfDay = getTimeOfDay();
  const theme = timeThemes[timeOfDay];
  const TimeIcon = theme.icon;

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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-28">
      {/* Header */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} pt-14 pb-8 px-5`}>
        <IslamicPattern opacity={0.06} />

        <div className="relative max-w-lg mx-auto">
          {/* Greeting */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TimeIcon className={`w-4 h-4 ${theme.subColor}`} />
                <span className={`text-xs font-medium uppercase tracking-wide ${theme.subColor}`}>
                  {theme.greeting}
                </span>
              </div>
              <h1 className={`text-3xl font-semibold ${theme.textColor} tracking-tight`}>
                Assalamu Alaikum{userName ? ',' : ''}
              </h1>
              {userName && (
                <h2 className={`text-2xl font-light ${theme.textColor} mt-0.5`}>
                  {userName}
                </h2>
              )}
            </div>
            <button
              onClick={() => setShowPanic(true)}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center active:bg-white/20 transition-all"
              title="Panic button"
            >
              <EyeOff className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Level Progress */}
          <div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 cursor-pointer active:bg-white/20 transition-all"
            onClick={onJourney}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
                  <LevelIcon level={currentLevel.name} className={`w-5 h-5 ${theme.textColor}`} />
                </div>
                <div>
                  <span className={`text-sm font-semibold ${theme.textColor}`}>
                    {currentLevel.name}
                  </span>
                  <span className={`text-xs block ${theme.subColor} font-arabic`}>
                    {currentLevel.arabic}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span className={`text-sm font-bold ${theme.textColor}`}>{xp}</span>
                <span className={`text-xs ${theme.subColor}`}>XP</span>
              </div>
            </div>
            <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/70 rounded-full transition-all duration-700"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            {nextLevel && (
              <p className={`text-xs ${theme.subColor} mt-1.5 text-right`}>
                {nextLevel.minXP - xp} XP to {nextLevel.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 max-w-lg mx-auto space-y-3 pt-5">

        {/* Next Prayer */}
        {nextPrayer && prayerTimes && (
          <Card className="p-4" onClick={onPrayerTimes}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Next Prayer</p>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-100">
                    {nextPrayer.name}
                  </p>
                </div>
              </div>
              <p className="text-xl font-semibold text-violet-600 dark:text-violet-400 tabular-nums">
                {nextPrayer.time}
              </p>
            </div>
          </Card>
        )}

        {/* Daily Challenges */}
        <Card className="p-4" onClick={onChallenges}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
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
                        ? 'bg-emerald-500'
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
        <Card className="p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-50 to-transparent dark:from-emerald-900/10 rounded-bl-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
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
          <Card className="p-4" onClick={onMood}>
            <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center mb-3">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
              How are you?
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">Mood-based guidance</p>
          </Card>

          <Card className="p-4" onClick={onQibla}>
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-xl flex items-center justify-center mb-3">
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
          <Card className="p-4" onClick={onSmartAdhkar}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
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

          <Card className="p-4" onClick={onDuaCoach}>
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center mb-3">
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
          <Card className="p-4" onClick={onAskSafely}>
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
              Ask Safely
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">AI-powered guidance</p>
          </Card>

          <Card className="p-4" onClick={onCultureVsIslam}>
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-3">
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
          className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800"
          onClick={onJourney}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
                Your Spiritual Journey
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <LevelIcon level={currentLevel.name} className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
          <Card className="p-4 text-center" onClick={onQuran}>
            <div className="w-10 h-10 mx-auto bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-2">
              <Book className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Quran</p>
          </Card>

          <Card className="p-4 text-center" onClick={onDuas}>
            <div className="w-10 h-10 mx-auto bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Duas</p>
          </Card>

          <Card className="p-4 text-center" onClick={onSahabiyat}>
            <div className="w-10 h-10 mx-auto bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Sahabiyat</p>
          </Card>
        </div>

        {/* Journal */}
        <Card className="p-4" onClick={onJournal}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
              <Feather className="w-5 h-5 text-rose-600 dark:text-rose-400" />
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
              <Card key={topic.id} className="p-4" onClick={() => onSelectTopic(topic)}>
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
        <Card className="p-4 mt-4">
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
