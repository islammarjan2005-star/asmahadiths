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
  Calendar,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card, LevelIcon } from '../ui';
import { hadithDatabase, topics } from '../../data';
import { usePrayerTimes } from '../../hooks';
import { useApp } from '../../context/AppContext';
import { getTodayChallenges } from '../../data/challenges';
import { getLevel, getNextLevel } from '../../data/spiritualJourney';
import { IslamicPattern, IslamicDivider } from './IslamicPattern';
import { getGreeting } from '../../utils/greetings';

const DAY_OF_YEAR = Math.floor(Date.now() / 86400000);

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
  onNamesOfAllah,
  onQuranBrowser,
  onStudyPlans,
  onKidsMode,
  onAnalytics,
  onRamadan,
}) {
  const { state } = useApp();
  const [showPanic, setShowPanic] = useState(false);
  const { prayerTimes, hijriData, countdown, getNextPrayer } = usePrayerTimes();
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

  // Context-aware greeting
  const greeting = useMemo(() => getGreeting({
    userName,
    streak,
  }), [userName, streak]);

  if (showPanic) {
    return (
      <div className="min-h-screen bg-cream-200 dark:bg-night-300 flex items-center justify-center p-4">
        <div className="bg-cream-50 dark:bg-night-100 rounded-2xl shadow-lg p-6 w-full max-w-xs">
          <div className="text-right text-4xl font-light text-text-primary dark:text-cream-200 mb-4 h-12 flex items-center justify-end">
            0
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['C','±','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','.','='].map((btn) => (
              <button
                key={btn}
                onClick={() => btn === 'C' && setShowPanic(false)}
                className={`p-3 rounded-lg text-lg font-medium transition-colors ${
                  ['÷','×','−','+','='].includes(btn)
                    ? 'bg-gold-400 text-white'
                    : ['C','±','%'].includes(btn)
                    ? 'bg-cream-200 dark:bg-night-50 text-text-primary dark:text-cream-200'
                    : 'bg-cream-100 dark:bg-night-200 text-text-primary dark:text-cream-200 active:bg-cream-200'
                } ${btn === '0' ? 'col-span-2' : ''}`}
              >
                {btn}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-text-tertiary mt-4">Tap C to return</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
      {/* Header */}
      <div className="relative overflow-hidden bg-sanctuary-700 dark:bg-sanctuary-900 pt-14 pb-12 px-6">
        <IslamicPattern opacity={0.04} color="text-cream-200" />

        <div className="relative max-w-lg mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gold-300/60 text-sm font-arabic mb-0.5">السلام عليكم</p>
              <h1 className="text-2xl font-semibold text-cream-100">
                {greeting.primary}{userName ? `, ${userName}` : ''}
              </h1>
              {greeting.secondary && (
                <p className="text-sm text-cream-200/60 mt-0.5">{greeting.secondary}</p>
              )}
            </div>
            <button
              onClick={() => setShowPanic(true)}
              className="w-10 h-10 bg-cream-100/10 rounded-xl flex items-center justify-center active:bg-cream-100/20 transition-colors"
            >
              <EyeOff className="w-5 h-5 text-cream-200/40" />
            </button>
          </div>

          {/* Hijri Date + Arabic Subtext */}
          {(hijriData || greeting.arabicSubtext) && (
            <div className="flex items-center justify-between mb-4">
              {hijriData && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-gold-400/60" />
                  <p className="text-xs text-cream-200/50">{hijriData.formatted}</p>
                </div>
              )}
              {greeting.arabicSubtext && (
                <p className="text-xs font-arabic text-gold-300/40" dir="rtl">
                  {greeting.arabicSubtext}
                </p>
              )}
            </div>
          )}

          {/* Next Prayer with Countdown */}
          {countdown && (
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              <p className="text-sm text-cream-200/70">
                {countdown.prayer} {countdown.isSoon ? 'in' : 'at'}{' '}
                <span className={`font-medium ${countdown.isSoon ? 'text-gold-300' : 'text-gold-400'}`}>
                  {countdown.isSoon ? countdown.display : (nextPrayer && nextPrayer.time)}
                </span>
                {countdown.isSoon && (
                  <span className="ml-1.5 inline-flex items-center">
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse-soft" />
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Streak Note */}
          {greeting.streakNote && streak > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-3.5 h-3.5 text-gold-400" />
              <p className="text-xs text-gold-300/60">
                {streak} day streak — {greeting.streakNote}
              </p>
            </div>
          )}

          {/* Level */}
          <div
            className="bg-cream-100/10 rounded-2xl p-4 cursor-pointer card-interactive"
            onClick={onJourney}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-cream-100/10 rounded-xl flex items-center justify-center">
                  <LevelIcon level={currentLevel.name} className="w-5 h-5 text-cream-100" />
                </div>
                <div>
                  <p className="text-sm font-medium text-cream-100">{currentLevel.name}</p>
                  <p className="text-xs text-gold-300/50 font-arabic">{currentLevel.arabic}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gold-300/70">
                <Zap className="w-3.5 h-3.5 text-gold-400" />
                <span className="text-sm font-semibold text-cream-100">{xp}</span>
                <span className="text-xs">XP</span>
              </div>
            </div>
            <div className="h-1.5 bg-cream-100/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-400 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            {nextLevel && (
              <p className="text-xs text-gold-300/40 mt-1.5 text-right">
                {nextLevel.minXP - xp} XP to {nextLevel.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 max-w-lg mx-auto -mt-2 space-y-3">

        {/* Daily Reflection */}
        <Card className="p-4" variant="gold">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Star className="w-3.5 h-3.5 text-gold-400" />
            <p className="text-xs font-medium text-gold-600 dark:text-gold-400 uppercase tracking-wider">
              Daily reflection
            </p>
          </div>
          <p className="text-text-secondary dark:text-cream-300 text-sm leading-relaxed italic mb-2">
            &ldquo;{dailyHadith.text.substring(0, 150)}...&rdquo;
          </p>
          <p className="text-xs text-text-tertiary">{dailyHadith.source}</p>
        </Card>

        {/* Challenges */}
        <Card className="p-4 card-interactive" onClick={onChallenges}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sanctuary-50 dark:bg-sanctuary-900/20 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-sanctuary-600 dark:text-sanctuary-400" />
              </div>
              <div>
                <p className="text-xs text-text-tertiary font-medium">Daily challenges</p>
                <p className="text-base font-semibold text-text-primary dark:text-cream-200">
                  {challengesCompleted}/{todayChallenges.length} complete
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1">
                {todayChallenges.map((c, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      completedToday.some((done) => done.id === c.id)
                        ? 'bg-sanctuary-500'
                        : 'bg-cream-300 dark:bg-night-50'
                    }`}
                  />
                ))}
              </div>
              <ChevronRight className="w-4 h-4 text-cream-400" />
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 card-interactive" onClick={onMood}>
            <div className="w-9 h-9 bg-rose-50 dark:bg-rose-600/10 rounded-xl flex items-center justify-center mb-3">
              <Heart className="w-5 h-5 text-rose-400" />
            </div>
            <p className="text-sm font-semibold text-text-primary dark:text-cream-200">How are you?</p>
            <p className="text-xs text-text-tertiary mt-0.5">Mood guidance</p>
          </Card>
          <Card className="p-4 card-interactive" onClick={onQibla}>
            <div className="w-9 h-9 bg-sanctuary-50 dark:bg-sanctuary-900/20 rounded-xl flex items-center justify-center mb-3">
              <Compass className="w-5 h-5 text-sanctuary-500" />
            </div>
            <p className="text-sm font-semibold text-text-primary dark:text-cream-200">Qibla</p>
            <p className="text-xs text-text-tertiary mt-0.5">Find direction</p>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 card-interactive" onClick={onSmartAdhkar}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-gold-50 dark:bg-gold-900/20 rounded-xl flex items-center justify-center">
                <Sun className="w-5 h-5 text-gold-500" />
              </div>
              {streak > 0 && (
                <span className="text-xs font-semibold text-gold-700 dark:text-gold-400 bg-gold-100 dark:bg-gold-900/20 px-1.5 py-0.5 rounded">
                  {streak}d
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-text-primary dark:text-cream-200">Daily Adhkar</p>
            <p className="text-xs text-text-tertiary mt-0.5">Morning & evening</p>
          </Card>
          <Card className="p-4 card-interactive" onClick={onDuaCoach}>
            <div className="w-9 h-9 bg-lavender-50 dark:bg-lavender-400/10 rounded-xl flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-lavender-300" />
            </div>
            <p className="text-sm font-semibold text-text-primary dark:text-cream-200">Dua Coach</p>
            <p className="text-xs text-text-tertiary mt-0.5">Find the right dua</p>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 card-interactive" onClick={onAskSafely}>
            <div className="w-9 h-9 bg-sanctuary-50 dark:bg-sanctuary-900/20 rounded-xl flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-sanctuary-600 dark:text-sanctuary-400" />
            </div>
            <p className="text-sm font-semibold text-text-primary dark:text-cream-200">Ask Safely</p>
            <p className="text-xs text-text-tertiary mt-0.5">Private AI guidance</p>
          </Card>
          <Card className="p-4 card-interactive" onClick={onCultureVsIslam}>
            <div className="w-9 h-9 bg-gold-50 dark:bg-gold-900/20 rounded-xl flex items-center justify-center mb-3">
              <Scale className="w-5 h-5 text-gold-600 dark:text-gold-400" />
            </div>
            <p className="text-sm font-semibold text-text-primary dark:text-cream-200">Culture vs Islam</p>
            <p className="text-xs text-text-tertiary mt-0.5">Know the difference</p>
          </Card>
        </div>

        {/* Spiritual Journey */}
        <Card className="p-4 card-interactive" onClick={onJourney}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sanctuary-50 dark:bg-sanctuary-900/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-sanctuary-600 dark:text-sanctuary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary dark:text-cream-200">Spiritual Journey</p>
              <p className="text-xs text-text-tertiary">
                {currentLevel.name} &middot; {xp} XP
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-cream-400" />
          </div>
        </Card>

        {/* Explore */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center card-interactive" onClick={onQuran}>
            <div className="w-9 h-9 bg-sanctuary-50 dark:bg-sanctuary-900/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Book className="w-5 h-5 text-sanctuary-500" />
            </div>
            <p className="text-xs font-semibold text-text-primary dark:text-cream-300">Quran</p>
          </Card>
          <Card className="p-4 text-center card-interactive" onClick={onDuas}>
            <div className="w-9 h-9 bg-rose-50 dark:bg-rose-600/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Heart className="w-5 h-5 text-rose-400" />
            </div>
            <p className="text-xs font-semibold text-text-primary dark:text-cream-300">Duas</p>
          </Card>
          <Card className="p-4 text-center card-interactive" onClick={onSahabiyat}>
            <div className="w-9 h-9 bg-gold-50 dark:bg-gold-900/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-gold-500" />
            </div>
            <p className="text-xs font-semibold text-text-primary dark:text-cream-300">Sahabiyat</p>
          </Card>
        </div>

        {/* Journal */}
        <Card className="p-4 card-interactive" onClick={onJournal}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lavender-50 dark:bg-lavender-400/10 rounded-xl flex items-center justify-center">
              <Feather className="w-5 h-5 text-lavender-300" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary dark:text-cream-200">Journal</p>
              <p className="text-xs text-text-tertiary">
                {(state.journal || []).length > 0
                  ? `${(state.journal || []).length} entries`
                  : 'Start reflecting'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-cream-400" />
          </div>
        </Card>

        {/* Topics Divider */}
        <IslamicDivider />

        <p className="text-xs font-medium text-gold-600 dark:text-gold-400 uppercase tracking-wider px-1">
          Topics
        </p>
        <div className="space-y-2">
          {topics.map((topic) => {
            const TopicIcon = Icons[topic.icon] || Icons.Circle;
            const count = hadithDatabase.filter((h) => h.topic === topic.id).length;
            return (
              <Card key={topic.id} className="p-4 card-interactive" onClick={() => onSelectTopic(topic)}>
                <div className="flex items-center gap-3">
                  <TopicIcon className="w-5 h-5 text-sanctuary-500 dark:text-sanctuary-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary dark:text-cream-200">{topic.name}</p>
                    <p className="text-xs text-text-tertiary truncate">{topic.description}</p>
                  </div>
                  <span className="text-xs text-text-tertiary">{count}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2.5 px-1 py-4">
          <Info className="w-3.5 h-3.5 text-cream-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-tertiary leading-relaxed">
            Asma provides educational guidance with Islamic sources. Not a substitute for scholarly advice.
          </p>
        </div>
      </div>
    </div>
  );
}
