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
  Navigation,
  TrendingUp,
  Compass,
  Star,
  Feather,
  Moon,
  Sunrise,
  Sunset,
  Zap,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card } from '../ui';
import { hadithDatabase, topics } from '../../data';
import { usePrayerTimes } from '../../hooks';
import { useApp } from '../../context/AppContext';
import { getTodayChallenges } from '../../data/challenges';
import { getLevel, getNextLevel } from '../../data/spiritualJourney';
import { IslamicPattern } from './IslamicPattern';

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

  // Daily hadith based on day of year
  const dailyHadith = useMemo(() => {
    const dayOfYear = Math.floor(Date.now() / 86400000);
    return hadithDatabase[dayOfYear % hadithDatabase.length];
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
      {/* Dynamic Time-of-Day Header */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} pt-10 pb-8 px-5`}>
        <IslamicPattern opacity={0.08} />
        <div className="relative max-w-lg mx-auto">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TimeIcon className={`w-5 h-5 ${theme.subColor}`} />
                <span className={`text-sm ${theme.subColor}`}>{theme.greeting}</span>
              </div>
              <h1 className={`text-2xl font-semibold ${theme.textColor} tracking-tight`}>
                Assalamu Alaikum{userName ? `, ${userName}` : ''}
              </h1>
            </div>
            <button
              onClick={() => setShowPanic(true)}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center active:bg-white/20 transition-colors"
              title="Panic button - shows calculator"
            >
              <EyeOff className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Level Progress Mini */}
          <div
            className="bg-white/15 backdrop-blur-sm rounded-xl p-3 cursor-pointer active:bg-white/20 transition-colors"
            onClick={onJourney}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{currentLevel.icon}</span>
                <span className={`text-sm font-medium ${theme.textColor}`}>
                  {currentLevel.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span className={`text-sm font-bold ${theme.textColor}`}>{xp} XP</span>
              </div>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 rounded-full transition-all duration-700"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 max-w-lg mx-auto -mt-2">
        {/* Prayer Times Card */}
        {nextPrayer && prayerTimes && (
          <Card className="p-4 mb-4 shadow-sm" onClick={onPrayerTimes}>
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

        {/* Today's Challenges Mini */}
        <Card className="p-4 mb-4 shadow-sm" onClick={onChallenges}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-neutral-400">Daily Challenges</p>
                <p className="font-medium text-neutral-700 dark:text-neutral-200">
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
                        : 'bg-neutral-300 dark:bg-neutral-600'
                    }`}
                  />
                ))}
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-300" />
            </div>
          </div>
        </Card>

        {/* Daily Hadith */}
        <Card className="p-5 mb-6 shadow-sm">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-3">
            Today's Reflection
          </p>
          <p className="text-neutral-600 dark:text-neutral-300 italic leading-relaxed mb-3">
            "{dailyHadith.text.substring(0, 100)}..."
          </p>
          <p className="text-xs text-neutral-400">{dailyHadith.source}</p>
        </Card>

        {/* NEW: Mood Check-in & Qibla Row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4 relative overflow-hidden" onClick={onMood}>
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-violet-200/30 to-purple-200/30 dark:from-violet-800/20 dark:to-purple-800/20 rounded-full blur-xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Heart className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="font-medium text-neutral-700 dark:text-neutral-200 text-sm">
                How are you?
              </h3>
              <p className="text-xs text-neutral-400">Mood-based guidance</p>
            </div>
          </Card>

          <Card className="p-4 relative overflow-hidden" onClick={onQibla}>
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-sky-200/30 to-cyan-200/30 dark:from-sky-800/20 dark:to-cyan-800/20 rounded-full blur-xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                  <Compass className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="font-medium text-neutral-700 dark:text-neutral-200 text-sm">
                Qibla
              </h3>
              <p className="text-xs text-neutral-400">Find the direction</p>
            </div>
          </Card>
        </div>

        {/* Featured: Smart Adhkar & Dua Coach */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4 relative overflow-hidden" onClick={onSmartAdhkar}>
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-amber-200/30 to-orange-200/30 dark:from-amber-800/20 dark:to-orange-800/20 rounded-full blur-xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold text-orange-500">{streak}</span>
                  </div>
                )}
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

        {/* Spiritual Journey Card */}
        <Card
          className="p-4 mb-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800 shadow-sm"
          onClick={onJourney}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-neutral-700 dark:text-neutral-200 text-sm">
                Your Spiritual Journey
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Level {currentLevel.name} {currentLevel.icon} · {xp} XP · Track your growth
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-300" />
          </div>
        </Card>

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

        {/* Journal Quick Entry */}
        <Card className="p-4 mb-6" onClick={onJournal}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/50 rounded-xl flex items-center justify-center">
              <Feather className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-neutral-700 dark:text-neutral-200 text-sm">
                Reflection Journal
              </h3>
              <p className="text-xs text-neutral-400">
                {(state.journal || []).length > 0
                  ? `${(state.journal || []).length} entries · Keep writing`
                  : 'Start your reflections today'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600" />
          </div>
        </Card>

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
