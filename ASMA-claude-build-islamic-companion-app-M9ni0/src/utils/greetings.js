const TIME_SEGMENTS = {
  preFajr: { start: 3, end: 5 },
  postFajr: { start: 5, end: 9 },
  lateMorning: { start: 9, end: 12 },
  afternoon: { start: 12, end: 15 },
  preMaghrib: { start: 15, end: 18 },
  evening: { start: 18, end: 24 },
  night: { start: 0, end: 3 },
};

const greetingVariants = {
  preFajr: [
    { primary: 'The blessed hour before Fajr', secondary: 'A time when duas are answered', arabicSubtext: 'ربِّ اجعلني مقيم الصلاة' },
    { primary: 'Tahajjud blessings', secondary: 'Allah descends to the lowest heaven', arabicSubtext: 'وَبِالْأَسْحَارِ هُمْ يَسْتَغْفِرُونَ' },
    { primary: 'Peace in the stillness', secondary: 'The night is yours with Allah', arabicSubtext: 'قُمِ اللَّيْلَ إِلَّا قَلِيلًا' },
  ],
  postFajr: [
    { primary: 'Sabah al-khayr', secondary: 'Start your day with barakah', arabicSubtext: 'صباح الخير' },
    { primary: 'Good morning', secondary: 'May your day be blessed', arabicSubtext: 'بارك الله في يومك' },
    { primary: 'A new day of mercy', secondary: "Allah's mercy renews with dawn", arabicSubtext: 'اللّهم بك أصبحنا' },
  ],
  lateMorning: [
    { primary: 'Good morning', secondary: 'Time for Duha prayer', arabicSubtext: 'وَالضُّحَىٰ' },
    { primary: 'Blessed morning', secondary: 'Remember your morning adhkar', arabicSubtext: 'اللهم إني أسألك خير هذا اليوم' },
    { primary: 'Morning light', secondary: 'Carry blessings through your day', arabicSubtext: 'نُورٌ عَلَىٰ نُورٍ' },
  ],
  afternoon: [
    { primary: 'Good afternoon', secondary: 'Take a moment to breathe', arabicSubtext: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا' },
    { primary: 'Midday blessings', secondary: 'Send salawat upon the Prophet ﷺ', arabicSubtext: 'اللهم صلِّ على محمد' },
    { primary: 'Peace be upon you', secondary: 'A gentle reminder to hydrate & pray', arabicSubtext: 'السلام عليكم' },
  ],
  preMaghrib: [
    { primary: 'Almost Maghrib', secondary: 'A golden hour for dua', arabicSubtext: 'اللّهم إني أسألك خير هذه الليلة' },
    { primary: 'Sunset approaches', secondary: 'Prepare for evening adhkar', arabicSubtext: 'اللّهم بك أمسينا' },
    { primary: 'End of day', secondary: 'Reflect on your blessings', arabicSubtext: 'الحمد لله على كل حال' },
  ],
  evening: [
    { primary: 'Good evening', secondary: 'Wind down with remembrance', arabicSubtext: 'أمسينا وأمسى الملك لله' },
    { primary: 'Peaceful night', secondary: 'May your sleep be restful', arabicSubtext: 'بِاسْمِكَ اللّهم أموت و أحيا' },
    { primary: 'Night blessings', secondary: "Don't forget your evening adhkar", arabicSubtext: 'أعوذ بكلمات الله التامات' },
  ],
  night: [
    { primary: 'Late night peace', secondary: "Rest well, you're in Allah's care", arabicSubtext: 'هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ' },
    { primary: 'Quiet hours', secondary: 'The world sleeps, but your Lord watches', arabicSubtext: 'لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ' },
  ],
};

const fridayGreetings = [
  { primary: "Jumu'ah Mubarak", secondary: 'Send abundant salawat today', arabicSubtext: 'اللهم صل وسلم على نبينا محمد' },
  { primary: 'Blessed Friday', secondary: 'The best day the sun rises upon', arabicSubtext: 'خير يوم طلعت عليه الشمس' },
  { primary: "Jumu'ah blessings", secondary: 'Read Surah Al-Kahf today', arabicSubtext: 'جمعة مباركة' },
];

const streakGreetings = [
  { min: 7, text: 'Your consistency is beautiful' },
  { min: 3, text: 'Keep the momentum going' },
  { min: 1, text: 'MashaAllah, keep it up' },
];

function getTimeSegment(hour) {
  for (const [segment, { start, end }] of Object.entries(TIME_SEGMENTS)) {
    if (hour >= start && hour < end) return segment;
  }
  return 'evening';
}

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / 86400000);
}

export function getGreeting({ userName, streak = 0, hijriEvent = null } = {}) {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();
  const dayOfYear = getDayOfYear();
  const segment = getTimeSegment(hour);

  // Friday override (50% chance if it's Friday)
  const isFriday = dayOfWeek === 5;
  if (isFriday && dayOfYear % 2 === 0) {
    const variant = fridayGreetings[dayOfYear % fridayGreetings.length];
    return {
      ...variant,
      userName,
      streakNote: getStreakNote(streak),
      isFriday: true,
    };
  }

  // Special Islamic event override
  if (hijriEvent) {
    return {
      primary: hijriEvent.greeting,
      secondary: hijriEvent.description,
      arabicSubtext: hijriEvent.arabic || '',
      userName,
      streakNote: getStreakNote(streak),
      isSpecialDay: true,
    };
  }

  // Time-of-day greeting with rotation
  const variants = greetingVariants[segment] || greetingVariants.evening;
  const idx = (dayOfYear * 7 + hour) % variants.length;
  const variant = variants[idx];

  return {
    ...variant,
    userName,
    streakNote: getStreakNote(streak),
  };
}

function getStreakNote(streak) {
  if (streak <= 0) return null;
  const match = streakGreetings.find(s => streak >= s.min);
  return match ? match.text : null;
}

export function getNextPrayerContext(nextPrayer, prayerTimes) {
  if (!nextPrayer || !prayerTimes) return null;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [h, m] = nextPrayer.time.split(':').map(Number);
  const prayerMinutes = h * 60 + m;

  let diff = prayerMinutes - currentMinutes;
  if (diff < 0) diff += 24 * 60;

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return {
    name: nextPrayer.name,
    time: nextPrayer.time,
    hours,
    minutes,
    isSoon: diff <= 30,
    isNow: diff <= 5,
    countdown: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
  };
}
