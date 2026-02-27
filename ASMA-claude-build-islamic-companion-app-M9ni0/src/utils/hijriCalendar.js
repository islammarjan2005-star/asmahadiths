// Islamic events keyed by Hijri month number + day
// Month numbers: 1=Muharram, 2=Safar, 3=Rabi al-Awwal, ... 9=Ramadan, 10=Shawwal, 11=Dhul Qa'dah, 12=Dhul Hijjah
const ISLAMIC_EVENTS = [
  { month: 1, day: 1, name: 'Islamic New Year', arabic: 'رأس السنة الهجرية', greeting: 'Happy Islamic New Year', description: 'A new Hijri year begins', type: 'major' },
  { month: 1, day: 10, name: 'Day of Ashura', arabic: 'يوم عاشوراء', greeting: 'Blessed Day of Ashura', description: 'A day of fasting and reflection', type: 'major' },
  { month: 3, day: 12, name: 'Mawlid al-Nabi', arabic: 'المولد النبوي', greeting: 'Mawlid Mubarak', description: 'Birth of Prophet Muhammad ﷺ', type: 'major' },
  { month: 7, day: 27, name: "Isra' and Mi'raj", arabic: 'الإسراء والمعراج', greeting: "Blessed Night of Isra' Mi'raj", description: 'The Night Journey of the Prophet ﷺ', type: 'major' },
  { month: 8, day: 15, name: 'Laylat al-Bara\'ah', arabic: 'ليلة البراءة', greeting: 'Blessed Night of Bara\'ah', description: 'Night of forgiveness (15th Sha\'ban)', type: 'moderate' },
  { month: 9, day: 1, name: 'First of Ramadan', arabic: 'أول رمضان', greeting: 'Ramadan Kareem', description: 'The blessed month of fasting begins', type: 'major' },
  { month: 9, day: 27, name: 'Laylat al-Qadr', arabic: 'ليلة القدر', greeting: 'Blessed Laylat al-Qadr', description: 'The Night of Power — better than 1000 months', type: 'major' },
  { month: 10, day: 1, name: 'Eid al-Fitr', arabic: 'عيد الفطر', greeting: 'Eid Mubarak', description: 'Celebration after Ramadan', type: 'eid' },
  { month: 12, day: 1, name: 'First of Dhul Hijjah', arabic: 'أول ذي الحجة', greeting: 'Blessed Days of Dhul Hijjah', description: 'The 10 most blessed days begin', type: 'moderate' },
  { month: 12, day: 9, name: 'Day of Arafah', arabic: 'يوم عرفة', greeting: 'Blessed Day of Arafah', description: 'Fasting forgives two years of sins', type: 'major' },
  { month: 12, day: 10, name: 'Eid al-Adha', arabic: 'عيد الأضحى', greeting: 'Eid Mubarak', description: 'The Festival of Sacrifice', type: 'eid' },
];

// White Days (13th, 14th, 15th of each Hijri month) - recommended fasting
const WHITE_DAYS = [13, 14, 15];

export function getIslamicEvent(hijriData) {
  if (!hijriData) return null;
  const { day, monthNumber } = hijriData;
  return ISLAMIC_EVENTS.find(e => e.month === monthNumber && e.day === day) || null;
}

export function getUpcomingEvents(hijriData, count = 3) {
  if (!hijriData) return [];
  const { day, monthNumber } = hijriData;

  // Sort events by proximity
  const sorted = ISLAMIC_EVENTS.map(event => {
    let daysAway = 0;
    if (event.month > monthNumber || (event.month === monthNumber && event.day > day)) {
      daysAway = (event.month - monthNumber) * 30 + (event.day - day);
    } else {
      daysAway = (12 - monthNumber + event.month) * 30 + (event.day - day);
    }
    return { ...event, daysAway };
  }).sort((a, b) => a.daysAway - b.daysAway);

  return sorted.slice(0, count);
}

export function isRamadan(hijriData) {
  return hijriData && hijriData.monthNumber === 9;
}

export function getRamadanDay(hijriData) {
  if (!isRamadan(hijriData)) return null;
  return hijriData.day;
}

export function isLastTenNights(hijriData) {
  return isRamadan(hijriData) && hijriData.day >= 21;
}

export function isDhulHijjahFirst10(hijriData) {
  return hijriData && hijriData.monthNumber === 12 && hijriData.day <= 10;
}

export function isWhiteDay(hijriData) {
  return hijriData && WHITE_DAYS.includes(hijriData.day);
}

export function isSpecialDay(hijriData) {
  return !!getIslamicEvent(hijriData);
}

export function getRecommendedFasting(hijriData) {
  if (!hijriData) return null;
  const { day, monthNumber } = hijriData;

  // Ashura (9th-10th Muharram)
  if (monthNumber === 1 && (day === 9 || day === 10)) {
    return { reason: 'Day of Ashura', arabic: 'يوم عاشوراء' };
  }
  // Arafah
  if (monthNumber === 12 && day === 9) {
    return { reason: 'Day of Arafah', arabic: 'يوم عرفة' };
  }
  // Dhul Hijjah first 9
  if (monthNumber === 12 && day >= 1 && day <= 8) {
    return { reason: 'Blessed days of Dhul Hijjah', arabic: 'أيام ذي الحجة' };
  }
  // White days
  if (WHITE_DAYS.includes(day)) {
    return { reason: 'White Day fasting', arabic: 'الأيام البيض' };
  }
  // Mondays and Thursdays
  const dow = new Date().getDay();
  if (dow === 1) return { reason: 'Monday Sunnah fast', arabic: 'صوم الاثنين' };
  if (dow === 4) return { reason: 'Thursday Sunnah fast', arabic: 'صوم الخميس' };

  return null;
}
