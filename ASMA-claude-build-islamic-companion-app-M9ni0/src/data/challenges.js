// Daily spiritual challenges
export const dailyChallenges = [
  {
    id: 'dhikr_100',
    title: 'Century of Praise',
    description: 'Complete 100 dhikr today',
    category: 'dhikr',
    xp: 15,
    icon: 'Zap',
    check: (state) => {
      const today = new Date().toDateString();
      const todayDhikr = (state.dhikrHistory || []).filter(
        (h) => new Date(h.date).toDateString() === today
      );
      return todayDhikr.reduce((sum, h) => sum + (h.count || 0), 0) >= 100;
    },
  },
  {
    id: 'morning_adhkar',
    title: 'Morning Devotion',
    description: 'Complete your morning adhkar',
    category: 'adhkar',
    xp: 20,
    icon: 'Sun',
    check: (state) => {
      const today = new Date().toDateString();
      return (state.adhkarHistory || []).some(
        (h) => new Date(h.date).toDateString() === today && h.type === 'morning' && h.completed
      );
    },
  },
  {
    id: 'evening_adhkar',
    title: 'Evening Serenity',
    description: 'Complete your evening adhkar',
    category: 'adhkar',
    xp: 20,
    icon: 'Moon',
    check: (state) => {
      const today = new Date().toDateString();
      return (state.adhkarHistory || []).some(
        (h) => new Date(h.date).toDateString() === today && h.type === 'evening' && h.completed
      );
    },
  },
  {
    id: 'read_hadith',
    title: 'Words of Wisdom',
    description: 'Read and save a hadith',
    category: 'knowledge',
    xp: 10,
    icon: 'BookOpen',
    check: (state) => (state.savedHadith || []).length > 0,
  },
  {
    id: 'journal_entry',
    title: 'Heart on Paper',
    description: 'Write a reflection in your journal',
    category: 'reflection',
    xp: 15,
    icon: 'Feather',
    check: (state) => {
      const today = new Date().toDateString();
      return (state.journal || []).some(
        (j) => new Date(j.date).toDateString() === today
      );
    },
  },
  {
    id: 'dua_coach',
    title: 'Supplication Seeker',
    description: 'Explore a new dua from the Dua Coach',
    category: 'dua',
    xp: 10,
    icon: 'Heart',
    check: (state) => (state.savedCoachDuas || []).length > 0,
  },
  {
    id: 'mood_check',
    title: 'Know Thyself',
    description: 'Check in with your mood today',
    category: 'wellness',
    xp: 5,
    icon: 'Smile',
    check: (state) => {
      const today = new Date().toDateString();
      return (state.moodHistory || []).some(
        (m) => new Date(m.date).toDateString() === today
      );
    },
  },
  {
    id: 'dhikr_33',
    title: 'Sacred Thirty-Three',
    description: 'Complete a set of 33 dhikr',
    category: 'dhikr',
    xp: 10,
    icon: 'Circle',
    check: (state) => {
      const today = new Date().toDateString();
      return (state.dhikrHistory || []).some(
        (h) => new Date(h.date).toDateString() === today
      );
    },
  },
  {
    id: 'save_verse',
    title: 'Treasure the Word',
    description: 'Save a Quranic verse to your collection',
    category: 'quran',
    xp: 10,
    icon: 'Book',
    check: (state) => (state.savedVerses || []).length > 0,
  },
  {
    id: 'dhikr_subhanallah',
    title: 'Glory to Allah',
    description: 'Say SubhanAllah 33 times',
    category: 'dhikr',
    xp: 10,
    icon: 'Sparkles',
    check: (state) => {
      const today = new Date().toDateString();
      return (state.dhikrHistory || []).some(
        (h) => new Date(h.date).toDateString() === today && h.count >= 33
      );
    },
  },
  {
    id: 'both_adhkar',
    title: 'Complete Remembrance',
    description: 'Complete both morning and evening adhkar',
    category: 'adhkar',
    xp: 30,
    icon: 'Trophy',
    check: (state) => {
      const today = new Date().toDateString();
      const todayAdhkar = (state.adhkarHistory || []).filter(
        (h) => new Date(h.date).toDateString() === today && h.completed
      );
      const hasMorning = todayAdhkar.some((h) => h.type === 'morning');
      const hasEvening = todayAdhkar.some((h) => h.type === 'evening');
      return hasMorning && hasEvening;
    },
  },
  {
    id: 'save_dua',
    title: 'Collect a Gem',
    description: 'Save a dua to remember later',
    category: 'dua',
    xp: 5,
    icon: 'Bookmark',
    check: (state) => (state.savedDuas || []).length > 0,
  },
];

// Get today's challenges (3 per day, rotated by date)
export function getTodayChallenges() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );

  // Always include morning/evening adhkar based on time of day
  const hour = today.getHours();
  const timeBased = hour < 12
    ? dailyChallenges.find((c) => c.id === 'morning_adhkar')
    : dailyChallenges.find((c) => c.id === 'evening_adhkar');

  // Rotate through remaining challenges
  const remaining = dailyChallenges.filter(
    (c) => c.id !== 'morning_adhkar' && c.id !== 'evening_adhkar'
  );

  const idx1 = dayOfYear % remaining.length;
  const idx2 = (dayOfYear + 3) % remaining.length;

  const selected = [timeBased, remaining[idx1], remaining[idx2]].filter(Boolean);

  // Remove duplicates
  const seen = new Set();
  return selected.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}
