import React, { useMemo } from 'react';
import {
  TrendingUp,
  Flame,
  BookOpen,
  Feather,
  Heart,
  Target,
  Zap,
  Calendar,
} from 'lucide-react';
import { Card, ScreenHeader } from '../ui';
import { useApp } from '../../context/AppContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MOOD_COLORS = {
  anxious: '#C99B9B',
  sad: '#A688C5',
  grateful: '#D4A574',
  angry: '#E57373',
  lonely: '#9A6F6F',
  hopeful: '#3A9E9E',
  overwhelmed: '#B38585',
  peaceful: '#267A7B',
};

export function Analytics({ onBack }) {
  const { state } = useApp();

  // Calculate analytics
  const analytics = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 86400000);
    const sevenDaysAgo = new Date(now - 7 * 86400000);

    // Dhikr stats
    const dhikrHistory = state.dhikrHistory || [];
    const totalDhikr = dhikrHistory.reduce((sum, h) => sum + (h.count || 0), 0);
    const weekDhikr = dhikrHistory
      .filter(h => new Date(h.date) >= sevenDaysAgo)
      .reduce((sum, h) => sum + (h.count || 0), 0);

    // Adhkar stats
    const adhkarHistory = state.adhkarHistory || [];
    const weekAdhkar = adhkarHistory.filter(h => new Date(h.date) >= sevenDaysAgo).length;
    const streak = state.adhkarStreak?.current || 0;
    const longestStreak = state.adhkarStreak?.longest || 0;

    // Journal stats
    const journal = state.journal || [];
    const weekJournal = journal.filter(j => new Date(j.date) >= sevenDaysAgo).length;

    // Mood stats
    const moodHistory = state.moodHistory || [];
    const monthMoods = moodHistory.filter(m => new Date(m.date) >= thirtyDaysAgo);
    const moodCounts = {};
    monthMoods.forEach(m => { moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1; });
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

    // Challenges
    const challenges = state.completedChallenges || [];
    const weekChallenges = challenges.filter(c => new Date(c.date) >= sevenDaysAgo).length;

    // Activity heatmap (last 12 weeks)
    const heatmapDays = 84;
    const heatmap = [];
    for (let i = heatmapDays - 1; i >= 0; i--) {
      const date = new Date(now - i * 86400000);
      const dateStr = date.toDateString();
      let activity = 0;
      activity += dhikrHistory.filter(h => new Date(h.date).toDateString() === dateStr).length;
      activity += adhkarHistory.filter(h => new Date(h.date).toDateString() === dateStr).length;
      activity += journal.filter(j => new Date(j.date).toDateString() === dateStr).length ? 1 : 0;
      activity += challenges.filter(c => new Date(c.date).toDateString() === dateStr).length;
      activity += moodHistory.filter(m => new Date(m.date).toDateString() === dateStr).length ? 1 : 0;
      heatmap.push({ date, activity, dateStr });
    }

    // Most active day of week
    const dayActivity = [0, 0, 0, 0, 0, 0, 0];
    heatmap.forEach(h => { dayActivity[h.date.getDay()] += h.activity; });
    const bestDay = DAYS[dayActivity.indexOf(Math.max(...dayActivity))];

    // Total days active
    const activeDays = new Set([
      ...dhikrHistory.map(h => new Date(h.date).toDateString()),
      ...adhkarHistory.map(h => new Date(h.date).toDateString()),
      ...journal.map(j => new Date(j.date).toDateString()),
      ...challenges.map(c => new Date(c.date).toDateString()),
    ]).size;

    return {
      totalDhikr,
      weekDhikr,
      weekAdhkar,
      streak,
      longestStreak,
      weekJournal,
      journalTotal: journal.length,
      weekChallenges,
      moodCounts,
      topMood,
      heatmap,
      bestDay,
      activeDays,
      xp: state.spiritualXP || 0,
      achievements: (state.achievements || []).length,
    };
  }, [state]);

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
      <ScreenHeader title="Analytics" subtitle="Your spiritual journey in numbers" onBack={onBack} />

      <div className="px-4 max-w-lg mx-auto mt-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <Zap className="w-5 h-5 text-gold-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-text-primary dark:text-cream-200">{analytics.xp}</p>
            <p className="text-xs text-text-tertiary">Total XP</p>
          </Card>
          <Card className="text-center">
            <Flame className="w-5 h-5 text-gold-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-text-primary dark:text-cream-200">{analytics.longestStreak}</p>
            <p className="text-xs text-text-tertiary">Longest Streak</p>
          </Card>
          <Card className="text-center">
            <Calendar className="w-5 h-5 text-sanctuary-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-text-primary dark:text-cream-200">{analytics.activeDays}</p>
            <p className="text-xs text-text-tertiary">Days Active</p>
          </Card>
          <Card className="text-center">
            <Target className="w-5 h-5 text-sanctuary-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-text-primary dark:text-cream-200">{analytics.achievements}</p>
            <p className="text-xs text-text-tertiary">Achievements</p>
          </Card>
        </div>

        {/* Activity Heatmap */}
        <Card>
          <h3 className="text-sm font-medium text-text-primary dark:text-cream-200 mb-3">
            Activity (12 weeks)
          </h3>
          <div className="grid grid-cols-12 gap-1">
            {analytics.heatmap.map((day, i) => {
              const level = day.activity === 0 ? 0 : day.activity <= 2 ? 1 : day.activity <= 4 ? 2 : 3;
              const colors = [
                'bg-cream-200 dark:bg-night-100',
                'bg-sanctuary-200 dark:bg-sanctuary-800/50',
                'bg-sanctuary-400 dark:bg-sanctuary-600',
                'bg-sanctuary-600 dark:bg-sanctuary-400',
              ];
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-sm ${colors[level]} transition-colors`}
                  title={`${day.dateStr}: ${day.activity} activities`}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-end gap-1 mt-2">
            <span className="text-xs text-text-tertiary mr-1">Less</span>
            {[0, 1, 2, 3].map(level => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${
                  level === 0 ? 'bg-cream-200 dark:bg-night-100' :
                  level === 1 ? 'bg-sanctuary-200 dark:bg-sanctuary-800/50' :
                  level === 2 ? 'bg-sanctuary-400 dark:bg-sanctuary-600' :
                  'bg-sanctuary-600 dark:bg-sanctuary-400'
                }`}
              />
            ))}
            <span className="text-xs text-text-tertiary ml-1">More</span>
          </div>
        </Card>

        {/* Weekly Report */}
        <Card>
          <h3 className="text-sm font-medium text-text-primary dark:text-cream-200 mb-3">
            This Week
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold-400" />
                <span className="text-sm text-text-secondary dark:text-cream-300">Dhikr count</span>
              </div>
              <span className="text-sm font-medium text-text-primary dark:text-cream-200">{analytics.weekDhikr}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sanctuary-500" />
                <span className="text-sm text-text-secondary dark:text-cream-300">Adhkar sessions</span>
              </div>
              <span className="text-sm font-medium text-text-primary dark:text-cream-200">{analytics.weekAdhkar}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-lavender-300" />
                <span className="text-sm text-text-secondary dark:text-cream-300">Journal entries</span>
              </div>
              <span className="text-sm font-medium text-text-primary dark:text-cream-200">{analytics.weekJournal}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="text-sm text-text-secondary dark:text-cream-300">Challenges done</span>
              </div>
              <span className="text-sm font-medium text-text-primary dark:text-cream-200">{analytics.weekChallenges}</span>
            </div>
          </div>
        </Card>

        {/* Mood Trends */}
        {Object.keys(analytics.moodCounts).length > 0 && (
          <Card>
            <h3 className="text-sm font-medium text-text-primary dark:text-cream-200 mb-3">
              Mood Patterns (30 days)
            </h3>
            <div className="space-y-2">
              {Object.entries(analytics.moodCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([mood, count]) => {
                  const max = Math.max(...Object.values(analytics.moodCounts));
                  return (
                    <div key={mood} className="flex items-center gap-2">
                      <span className="text-xs text-text-secondary dark:text-cream-300 w-20 capitalize">{mood}</span>
                      <div className="flex-1 h-3 bg-cream-200 dark:bg-night-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(count / max) * 100}%`,
                            backgroundColor: MOOD_COLORS[mood] || '#9B9B9B',
                          }}
                        />
                      </div>
                      <span className="text-xs text-text-tertiary w-6 text-right">{count}</span>
                    </div>
                  );
                })}
            </div>
          </Card>
        )}

        {/* Insights */}
        <Card variant="default">
          <h3 className="text-sm font-medium text-gold-600 dark:text-gold-400 mb-3">
            Personal Insights
          </h3>
          <div className="space-y-2 text-sm text-text-secondary dark:text-cream-300">
            <p>Most active day: <span className="font-medium">{analytics.bestDay}</span></p>
            <p>Total dhikr completed: <span className="font-medium">{analytics.totalDhikr}</span></p>
            <p>Journal entries: <span className="font-medium">{analytics.journalTotal}</span></p>
            {analytics.topMood && (
              <p>Most common mood: <span className="font-medium capitalize">{analytics.topMood[0]}</span></p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
