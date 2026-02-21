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
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (showPanic) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 w-full max-w-xs">
          <div className="text-right text-4xl font-light text-slate-700 dark:text-slate-200 mb-4 h-12 flex items-center justify-end">
            0
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['C','±','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','.','='].map((btn) => (
              <button
                key={btn}
                onClick={() => btn === 'C' && setShowPanic(false)}
                className={`p-3 rounded-lg text-lg font-medium transition-colors ${
                  ['÷','×','−','+','='].includes(btn)
                    ? 'bg-amber-500 text-white'
                    : ['C','±','%'].includes(btn)
                    ? 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 active:bg-slate-200'
                } ${btn === '0' ? 'col-span-2' : ''}`}
              >
                {btn}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">Tap C to return</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
      {/* Header */}
      <div className="relative overflow-hidden bg-emerald-800 dark:bg-emerald-900 pt-14 pb-10 px-6">
        <IslamicPattern opacity={0.03} />

        <div className="relative max-w-lg mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-emerald-300/60 text-sm font-arabic mb-0.5">السلام عليكم</p>
              <h1 className="text-2xl font-semibold text-white">
                {greeting}{userName ? `, ${userName}` : ''}
              </h1>
            </div>
            <button
              onClick={() => setShowPanic(true)}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center active:bg-white/20 transition-colors"
            >
              <EyeOff className="w-4.5 h-4.5 text-white/60" />
            </button>
          </div>

          {/* Level */}
          <div
            className="bg-white/10 rounded-2xl p-4 cursor-pointer active:bg-white/15 transition-colors"
            onClick={onJourney}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                  <LevelIcon level={currentLevel.name} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{currentLevel.name}</p>
                  <p className="text-xs text-emerald-300/50 font-arabic">{currentLevel.arabic}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-200/70">
                <Zap className="w-3.5 h-3.5" />
                <span className="text-sm font-semibold text-white">{xp}</span>
                <span className="text-xs">XP</span>
              </div>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            {nextLevel && (
              <p className="text-xs text-emerald-300/40 mt-1.5 text-right">
                {nextLevel.minXP - xp} XP to {nextLevel.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 max-w-lg mx-auto -mt-2 space-y-3">

        {/* Next Prayer */}
        {nextPrayer && prayerTimes && (
          <Card className="p-4" onClick={onPrayerTimes}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Next prayer</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {nextPrayer.name}
                  </p>
                </div>
              </div>
              <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {nextPrayer.time}
              </p>
            </div>
          </Card>
        )}

        {/* Reflection */}
        <Card className="p-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Daily reflection
            </p>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic mb-2">
            &ldquo;{dailyHadith.text.substring(0, 150)}...&rdquo;
          </p>
          <p className="text-xs text-slate-400">{dailyHadith.source}</p>
        </Card>

        {/* Challenges */}
        <Card className="p-4" onClick={onChallenges}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Daily challenges</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  {challengesCompleted}/{todayChallenges.length} complete
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1">
                {todayChallenges.map((c, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      completedToday.some((done) => done.id === c.id)
                        ? 'bg-emerald-500'
                        : 'bg-slate-200 dark:bg-slate-600'
                    }`}
                  />
                ))}
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4" onClick={onMood}>
            <Heart className="w-5 h-5 text-slate-400 mb-3" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">How are you?</p>
            <p className="text-xs text-slate-400 mt-0.5">Mood guidance</p>
          </Card>
          <Card className="p-4" onClick={onQibla}>
            <Compass className="w-5 h-5 text-slate-400 mb-3" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Qibla</p>
            <p className="text-xs text-slate-400 mt-0.5">Find direction</p>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4" onClick={onSmartAdhkar}>
            <div className="flex items-center gap-2 mb-3">
              <Sun className="w-5 h-5 text-slate-400" />
              {streak > 0 && (
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">
                  {streak}d
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Daily Adhkar</p>
            <p className="text-xs text-slate-400 mt-0.5">Morning & evening</p>
          </Card>
          <Card className="p-4" onClick={onDuaCoach}>
            <Sparkles className="w-5 h-5 text-slate-400 mb-3" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Dua Coach</p>
            <p className="text-xs text-slate-400 mt-0.5">Find the right dua</p>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4" onClick={onAskSafely}>
            <Lock className="w-5 h-5 text-slate-400 mb-3" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Ask Safely</p>
            <p className="text-xs text-slate-400 mt-0.5">Private AI guidance</p>
          </Card>
          <Card className="p-4" onClick={onCultureVsIslam}>
            <Scale className="w-5 h-5 text-slate-400 mb-3" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Culture vs Islam</p>
            <p className="text-xs text-slate-400 mt-0.5">Know the difference</p>
          </Card>
        </div>

        {/* Spiritual Journey */}
        <Card className="p-4" onClick={onJourney}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Spiritual Journey</p>
              <p className="text-xs text-slate-400">
                {currentLevel.name} &middot; {xp} XP
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>
        </Card>

        {/* Explore */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center" onClick={onQuran}>
            <Book className="w-5 h-5 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Quran</p>
          </Card>
          <Card className="p-4 text-center" onClick={onDuas}>
            <Heart className="w-5 h-5 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Duas</p>
          </Card>
          <Card className="p-4 text-center" onClick={onSahabiyat}>
            <Users className="w-5 h-5 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sahabiyat</p>
          </Card>
        </div>

        {/* Journal */}
        <Card className="p-4" onClick={onJournal}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center">
              <Feather className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Journal</p>
              <p className="text-xs text-slate-400">
                {(state.journal || []).length > 0
                  ? `${(state.journal || []).length} entries`
                  : 'Start reflecting'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>
        </Card>

        {/* Topics */}
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider pt-2 px-1">
          Topics
        </p>
        <div className="space-y-2">
          {topics.map((topic) => {
            const TopicIcon = Icons[topic.icon] || Icons.Circle;
            const count = hadithDatabase.filter((h) => h.topic === topic.id).length;
            return (
              <Card key={topic.id} className="p-4" onClick={() => onSelectTopic(topic)}>
                <div className="flex items-center gap-3">
                  <TopicIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{topic.name}</p>
                    <p className="text-xs text-slate-400 truncate">{topic.description}</p>
                  </div>
                  <span className="text-xs text-slate-400">{count}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2.5 px-1 py-4">
          <Info className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            Asma provides educational guidance with Islamic sources. Not a substitute for scholarly advice.
          </p>
        </div>
      </div>
    </div>
  );
}
