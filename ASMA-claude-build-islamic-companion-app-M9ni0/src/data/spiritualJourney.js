import {
  Star,
  Flame,
  Trophy,
  BookOpen,
  Heart,
  Zap,
  Award,
  Crown,
  Target,
  Sparkles,
} from 'lucide-react';

// Level thresholds and names
export const LEVELS = [
  { name: 'Seedling', arabic: 'بذرة', minXP: 0, color: 'emerald' },
  { name: 'Sprout', arabic: 'نبتة', minXP: 100, color: 'emerald' },
  { name: 'Blossom', arabic: 'زهرة', minXP: 300, color: 'pink' },
  { name: 'Tree', arabic: 'شجرة', minXP: 600, color: 'emerald' },
  { name: 'Garden', arabic: 'حديقة', minXP: 1000, color: 'violet' },
  { name: 'Oasis', arabic: 'واحة', minXP: 1500, color: 'teal' },
  { name: 'Light', arabic: 'نور', minXP: 2500, color: 'amber' },
  { name: 'Paradise Garden', arabic: 'جنة', minXP: 4000, color: 'emerald' },
];

// Achievement definitions
export const ACHIEVEMENTS = [
  { id: 'first_dhikr', name: 'First Dhikr', description: 'Complete your first dhikr set', icon: Star, xp: 10 },
  { id: 'streak_3', name: '3-Day Streak', description: 'Maintain a 3-day adhkar streak', icon: Flame, xp: 25 },
  { id: 'streak_7', name: 'Week of Devotion', description: '7-day adhkar streak', icon: Flame, xp: 50 },
  { id: 'streak_30', name: 'Month of Light', description: '30-day adhkar streak', icon: Crown, xp: 200 },
  { id: 'hadiths_10', name: 'Knowledge Seeker', description: 'Read 10 hadiths', icon: BookOpen, xp: 30 },
  { id: 'hadiths_40', name: 'Hadith Scholar', description: 'Read all 40 hadiths', icon: BookOpen, xp: 100 },
  { id: 'duas_20', name: 'Supplicant', description: 'Save 20 duas', icon: Heart, xp: 40 },
  { id: 'journal_5', name: 'Reflector', description: 'Write 5 journal entries', icon: Award, xp: 30 },
  { id: 'journal_30', name: 'Deep Thinker', description: 'Write 30 journal entries', icon: Award, xp: 100 },
  { id: 'dhikr_1000', name: 'Thousand Praises', description: 'Complete 1000 total dhikr', icon: Zap, xp: 75 },
  { id: 'all_morning', name: 'Morning Devotee', description: 'Complete a full morning adhkar', icon: Trophy, xp: 25 },
  { id: 'all_evening', name: 'Evening Devotee', description: 'Complete a full evening adhkar', icon: Trophy, xp: 25 },
  { id: 'challenge_7', name: 'Challenger', description: 'Complete 7 daily challenges', icon: Target, xp: 50 },
  { id: 'mood_check_7', name: 'Self-Aware', description: 'Check your mood 7 days', icon: Sparkles, xp: 30 },
];

export function getLevel(xp) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXP) level = l;
  }
  return level;
}

export function getNextLevel(xp) {
  for (const l of LEVELS) {
    if (xp < l.minXP) return l;
  }
  return null;
}

export function getLevelProgress(xp) {
  const current = getLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return 100;
  const range = next.minXP - current.minXP;
  const progress = xp - current.minXP;
  return Math.min((progress / range) * 100, 100);
}
