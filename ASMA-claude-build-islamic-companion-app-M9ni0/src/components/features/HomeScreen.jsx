import React, { useState, useMemo } from 'react';
import {
  Lock,
  Scale,
  Heart,
  Clock,
  ChevronRight,
  EyeOff,
  Sun,
  Sparkles,
  Target,
  Compass,
  Feather,
  Calendar,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card } from '../ui';
import { hadithDatabase } from '../../data';
import { usePrayerTimes } from '../../hooks';
import { useApp } from '../../context/AppContext';
import { getTodayChallenges } from '../../data/challenges';
import { getGreeting } from '../../utils/greetings';
import { getRecommendations } from '../../utils/contentEngine';

const DAY_OF_YEAR = Math.floor(Date.now() / 86400000);

const quickActions = [
  { icon: Heart, label: 'Mood', key: 'onMood' },
  { icon: Compass, label: 'Qibla', key: 'onQibla' },
  { icon: Sparkles, label: 'Dua Coach', key: 'onDuaCoach' },
  { icon: Lock, label: 'Ask Safely', key: 'onAskSafely' },
  { icon: Scale, label: 'Culture vs Islam', key: 'onCultureVsIslam' },
  { icon: Feather, label: 'Journal', key: 'onJournal' },
];

export function HomeScreen({
  onAskSafely,
  onCultureVsIslam,
  onSmartAdhkar,
  onDuaCoach,
  onMood,
  onQibla,
  onChallenges,
  onJournal,
}) {
  const { state } = useApp();
  const [showPanic, setShowPanic] = useState(false);
  const { hijriData, countdown, getNextPrayer } = usePrayerTimes();
  const nextPrayer = getNextPrayer();

  const userName = state.userName || '';
  const streak = state.adhkarStreak?.current || 0;

  const greeting = useMemo(() => getGreeting({ userName, streak }), [userName, streak]);

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

  const recommendations = useMemo(
    () => getRecommendations({ state, limit: 2 }),
    [state.moodHistory, state.adhkarStreak, state.journal, state.completedChallenges]
  );

  const actionMap = {
    adhkar: onSmartAdhkar,
    duas: () => {},
    quran: () => {},
    journal: onJournal,
    challenges: onChallenges,
    home: () => {},
  };

  const handlers = { onMood, onQibla, onDuaCoach, onAskSafely, onCultureVsIslam, onJournal };

  if (showPanic) {
    return (
      <div className="min-h-screen bg-cream-200 dark:bg-night-300 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-night-100 rounded-2xl shadow-soft p-6 w-full max-w-xs">
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
                    ? 'bg-sanctuary-600 text-white'
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
      {/* Header — clean, focused */}
      <div className="bg-sanctuary-700 dark:bg-sanctuary-900 pt-14 pb-8 px-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-2xl font-semibold text-cream-100">
                {greeting.primary}{userName ? `, ${userName}` : ''}
              </h1>
              {greeting.secondary && (
                <p className="text-sm text-cream-200/50 mt-0.5">{greeting.secondary}</p>
              )}
            </div>
            <button
              onClick={() => setShowPanic(true)}
              className="w-10 h-10 bg-cream-100/8 rounded-xl flex items-center justify-center active:bg-cream-100/15 transition-colors"
            >
              <EyeOff className="w-5 h-5 text-cream-200/30" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {hijriData && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-cream-200/40" />
                <p className="text-xs text-cream-200/40">{hijriData.formatted}</p>
              </div>
            )}
            {countdown && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-cream-200/40" />
                <p className="text-xs text-cream-200/40">
                  {countdown.prayer}{' '}
                  <span className="text-cream-200/70 font-medium">
                    {countdown.isSoon ? countdown.display : (nextPrayer && nextPrayer.time)}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content — 5 focused sections */}
      <div className="px-5 max-w-lg mx-auto -mt-4 space-y-6">

        {/* 1. Daily Reflection — the ONE hero card */}
        <Card variant="featured" onClick={() => {}}>
          <p className="text-white/60 text-body leading-relaxed italic mb-2">
            &ldquo;{dailyHadith.text.substring(0, 160)}...&rdquo;
          </p>
          <p className="text-xs text-white/40">{dailyHadith.source}</p>
        </Card>

        {/* 2. Today's Focus — two cards only */}
        <div className="grid grid-cols-2 gap-4">
          <Card onClick={onChallenges}>
            <div className="w-10 h-10 bg-sanctuary-50 dark:bg-sanctuary-900/20 rounded-xl flex items-center justify-center mb-3">
              <Target className="w-5 h-5 text-sanctuary-500" />
            </div>
            <p className="text-sm font-semibold text-text-primary dark:text-cream-200">Challenges</p>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs text-text-tertiary">{challengesCompleted}/{todayChallenges.length}</p>
              <div className="flex gap-1">
                {todayChallenges.map((c, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      completedToday.some((done) => done.id === c.id)
                        ? 'bg-sanctuary-500'
                        : 'bg-cream-300 dark:bg-night-50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </Card>

          <Card onClick={onSmartAdhkar}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-sanctuary-50 dark:bg-sanctuary-900/20 rounded-xl flex items-center justify-center">
                <Sun className="w-5 h-5 text-sanctuary-500" />
              </div>
              {streak > 0 && (
                <span className="text-xs font-semibold text-sanctuary-600 dark:text-sanctuary-400 bg-sanctuary-50 dark:bg-sanctuary-900/20 px-1.5 py-0.5 rounded">
                  {streak}d
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-text-primary dark:text-cream-200">Daily Adhkar</p>
            <p className="text-xs text-text-tertiary mt-0.5">Morning & evening</p>
          </Card>
        </div>

        {/* 3. Quick Actions — horizontal scroll, minimal */}
        <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-5 px-5">
          {quickActions.map((item) => {
            const ActionIcon = item.icon;
            return (
              <button
                key={item.label}
                onClick={handlers[item.key]}
                className="flex flex-col items-center gap-1.5 min-w-[60px] active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 bg-white dark:bg-night-100 shadow-soft rounded-2xl flex items-center justify-center">
                  <ActionIcon className="w-5 h-5 text-sanctuary-500" />
                </div>
                <span className="text-caption text-text-secondary">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4. For You — smart recommendations (0-2 items) */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <p className="text-label text-text-tertiary px-1">For you</p>
            {recommendations.map((rec, i) => {
              const RecIcon = Icons[rec.icon] || Icons.Sparkles;
              return (
                <Card key={i} variant="subtle" onClick={actionMap[rec.action]}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-sanctuary-50 dark:bg-sanctuary-900/20 rounded-xl flex items-center justify-center">
                      <RecIcon className="w-4 h-4 text-sanctuary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary dark:text-cream-200">{rec.title}</p>
                      <p className="text-xs text-text-tertiary truncate">{rec.subtitle}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-cream-400 flex-shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
