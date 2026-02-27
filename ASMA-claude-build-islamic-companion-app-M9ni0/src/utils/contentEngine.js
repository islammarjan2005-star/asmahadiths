import { hadithDatabase } from '../data';
import { quranicVerses } from '../data/quran';
import { duas } from '../data/duas';

// Content recommendation engine
// Ranks content based on: time of day, mood, unseen content, Hijri calendar, streak
export function getRecommendations({ state, hijriData, timeOfDay, limit = 3 } = {}) {
  const recommendations = [];
  const viewed = new Set((state?.contentViews || []).map(v => `${v.type}-${v.id}`));
  const hour = new Date().getHours();

  // Time-based content
  if (hour >= 4 && hour < 7) {
    recommendations.push({
      type: 'adhkar',
      title: 'Morning Adhkar',
      subtitle: 'Start your day with remembrance',
      icon: 'Sun',
      priority: 10,
      action: 'adhkar',
    });
  } else if (hour >= 16 && hour < 20) {
    recommendations.push({
      type: 'adhkar',
      title: 'Evening Adhkar',
      subtitle: 'Wind down with remembrance',
      icon: 'Moon',
      priority: 10,
      action: 'adhkar',
    });
  }

  // Mood-based content
  const lastMood = (state?.moodHistory || [])[0];
  if (lastMood) {
    const moodDate = new Date(lastMood.date);
    const isRecent = (Date.now() - moodDate.getTime()) < 6 * 60 * 60 * 1000; // Within 6 hours
    if (isRecent) {
      if (['anxious', 'overwhelmed', 'sad'].includes(lastMood.mood)) {
        recommendations.push({
          type: 'dua',
          title: 'Comfort Duas',
          subtitle: 'Soothing supplications for your heart',
          icon: 'Heart',
          priority: 9,
          action: 'duas',
        });
      }
      if (['grateful', 'hopeful', 'peaceful'].includes(lastMood.mood)) {
        recommendations.push({
          type: 'quran',
          title: 'Quranic Reflection',
          subtitle: 'Deepen your gratitude with Allah\'s words',
          icon: 'BookOpen',
          priority: 8,
          action: 'quran',
        });
      }
    }
  }

  // Streak awareness
  const streak = state?.adhkarStreak?.current || 0;
  if (streak === 0) {
    recommendations.push({
      type: 'streak',
      title: 'Start a Streak',
      subtitle: 'Complete your adhkar to begin',
      icon: 'Flame',
      priority: 7,
      action: 'adhkar',
    });
  }

  // Unseen hadith
  const unseenHadith = hadithDatabase.filter(h => !viewed.has(`hadith-${h.id}`));
  if (unseenHadith.length > 0) {
    const pick = unseenHadith[Math.floor(Math.random() * unseenHadith.length)];
    recommendations.push({
      type: 'hadith',
      title: 'New Hadith',
      subtitle: `${pick.source} — ${pick.text.substring(0, 60)}...`,
      icon: 'BookOpen',
      priority: 6,
      hadithId: pick.id,
      action: 'home',
    });
  }

  // Friday special
  if (new Date().getDay() === 5) {
    recommendations.push({
      type: 'friday',
      title: 'Surah Al-Kahf',
      subtitle: 'Recite on this blessed Friday',
      icon: 'Book',
      priority: 9,
      action: 'quran',
    });
  }

  // Journal prompt if no entry today
  const todayEntries = (state?.journal || []).filter(
    j => new Date(j.date).toDateString() === new Date().toDateString()
  );
  if (todayEntries.length === 0 && hour >= 19) {
    recommendations.push({
      type: 'journal',
      title: 'Evening Reflection',
      subtitle: 'What are you grateful for today?',
      icon: 'Feather',
      priority: 5,
      action: 'journal',
    });
  }

  // Challenge reminder
  const completedToday = (state?.completedChallenges || []).filter(
    c => new Date(c.date).toDateString() === new Date().toDateString()
  );
  if (completedToday.length < 3) {
    recommendations.push({
      type: 'challenges',
      title: 'Daily Challenges',
      subtitle: `${completedToday.length} of 7 complete`,
      icon: 'Target',
      priority: 4,
      action: 'challenges',
    });
  }

  // Sort by priority and return top N
  return recommendations
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
}
