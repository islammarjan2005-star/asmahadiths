import React, { useMemo } from 'react';
import {
  Moon,
  Sun,
  Star,
  Check,
  Flame,
  Heart,
} from 'lucide-react';
import { Card, ScreenHeader } from '../ui';
import { useApp } from '../../context/AppContext';
import { usePrayerTimes } from '../../hooks';
import { getRamadanDay, isLastTenNights } from '../../utils/hijriCalendar';

const ramadanDuas = [
  { arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', transliteration: 'Allahumma innaka afuwwun tuhibbul afwa fa\'fu anni', meaning: 'O Allah, You are the Most Forgiving and You love forgiveness, so forgive me', context: 'Laylat al-Qadr' },
  { arabic: 'اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ', transliteration: 'Allahumma laka sumtu wa ala rizqika aftartu', meaning: 'O Allah, for You I have fasted and with Your provision I break my fast', context: 'Breaking fast' },
  { arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ', transliteration: 'Dhahaba al-dhama wa abtallatil-urooq wa thabata al-ajru in sha Allah', meaning: 'The thirst has gone, the veins are moistened and the reward is certain if Allah wills', context: 'After iftar' },
  { arabic: 'اللَّهُمَّ بَلِّغْنَا رَمَضَانَ', transliteration: 'Allahumma ballighna Ramadan', meaning: 'O Allah, let us reach Ramadan', context: 'Before Ramadan' },
];

const lastTenNightsDuas = [
  { arabic: 'اللَّهُمَّ أَعْتِقْ رِقَابَنَا مِنَ النَّارِ', meaning: 'O Allah, free our necks from the Fire' },
  { arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', meaning: 'Our Lord, give us good in this world and good in the hereafter and save us from the punishment of the Fire' },
];

export function RamadanMode({ onBack, hijriData }) {
  const { state, dispatch } = useApp();
  const { prayerTimes } = usePrayerTimes();

  const ramadanDay = getRamadanDay(hijriData);
  const isLastTen = isLastTenNights(hijriData);
  const today = new Date().toISOString().split('T')[0];
  const isFastingToday = (state.ramadanFasting || []).includes(today);
  const totalFasted = (state.ramadanFasting || []).length;

  const suhoorTime = prayerTimes?.fajr;
  const iftarTime = prayerTimes?.maghrib;

  // Calculate iftar countdown
  const iftarCountdown = useMemo(() => {
    if (!iftarTime) return null;
    const now = new Date();
    const [h, m] = iftarTime.split(':').map(Number);
    const iftarMinutes = h * 60 + m;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const diff = iftarMinutes - currentMinutes;
    if (diff <= 0) return null;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }, [iftarTime]);

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
      <ScreenHeader
        title="Ramadan"
        subtitle={ramadanDay ? `Day ${ramadanDay} of 30${isLastTen ? ' — Last 10 Nights' : ''}` : 'Prepare for the blessed month'}
        onBack={onBack}
      />

      <div className="px-4 max-w-lg mx-auto space-y-3">
        {/* Suhoor / Iftar times */}
        {prayerTimes && (
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 text-center">
              <Sun className="w-4 h-4 text-gold-400 mx-auto mb-1" />
              <p className="text-xs text-text-tertiary">Suhoor ends</p>
              <p className="text-lg font-semibold text-text-primary dark:text-cream-200">{suhoorTime}</p>
            </Card>
            <Card className="p-3 text-center">
              <Moon className="w-4 h-4 text-gold-400 mx-auto mb-1" />
              <p className="text-xs text-text-tertiary">Iftar</p>
              <p className="text-lg font-semibold text-text-primary dark:text-cream-200">{iftarTime}</p>
              {iftarCountdown && (
                <p className="text-xs text-gold-600 dark:text-gold-400 mt-0.5">{iftarCountdown} left</p>
              )}
            </Card>
          </div>
        )}
        {/* Fasting Tracker */}
        <Card variant="default">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-gold-500" />
              <p className="text-sm font-medium text-text-primary dark:text-cream-200">
                Fasting Today
              </p>
            </div>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_FASTING_DAY', payload: today })}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isFastingToday
                  ? 'bg-sanctuary-500 text-white'
                  : 'bg-cream-200 dark:bg-night-100 text-text-tertiary'
              }`}
            >
              <Check className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-cream-200 dark:bg-night-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-400 rounded-full transition-all duration-500"
                style={{ width: `${(totalFasted / 30) * 100}%` }}
              />
            </div>
            <span className="text-xs text-text-tertiary font-medium">{totalFasted}/30</span>
          </div>
        </Card>

        {/* Last 10 Nights Special */}
        {isLastTen && (
          <Card className="bg-sanctuary-50 dark:bg-sanctuary-900/20 border-sanctuary-200 dark:border-sanctuary-800">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-gold-500" />
              <p className="text-sm font-semibold text-sanctuary-700 dark:text-sanctuary-300">
                Last 10 Nights — Seek Laylat al-Qadr
              </p>
            </div>
            {lastTenNightsDuas.map((dua, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <p className="font-arabic text-lg text-sanctuary-800 dark:text-cream-200 text-right mb-1" dir="rtl">
                  {dua.arabic}
                </p>
                <p className="text-xs text-text-tertiary">{dua.meaning}</p>
              </div>
            ))}
          </Card>
        )}

        {/* Ramadan Duas */}
        <p className="text-xs font-medium text-gold-600 dark:text-gold-400 uppercase tracking-wider px-1">
          Ramadan Duas
        </p>
        {ramadanDuas.map((dua, i) => (
          <Card key={i}>
            <div className="flex items-center gap-1.5 mb-2">
              <Heart className="w-3 h-3 text-sanctuary-500" />
              <p className="text-xs text-sanctuary-600 dark:text-sanctuary-400 font-medium">{dua.context}</p>
            </div>
            <p className="font-arabic text-xl text-text-primary dark:text-cream-200 text-right mb-2 leading-loose" dir="rtl">
              {dua.arabic}
            </p>
            <p className="text-xs text-text-tertiary italic mb-1">{dua.transliteration}</p>
            <p className="text-sm text-text-secondary dark:text-cream-300">{dua.meaning}</p>
          </Card>
        ))}

        {/* Daily Progress Grid */}
        <p className="text-xs font-medium text-gold-600 dark:text-gold-400 uppercase tracking-wider px-1 mt-4">
          Fasting Calendar
        </p>
        <Card>
          <div className="grid grid-cols-10 gap-1.5">
            {Array.from({ length: 30 }, (_, i) => {
              const dayNum = i + 1;
              const date = new Date();
              date.setDate(date.getDate() - ((ramadanDay || 1) - dayNum));
              const dateStr = date.toISOString().split('T')[0];
              const fasted = (state.ramadanFasting || []).includes(dateStr);
              const isToday = dayNum === ramadanDay;

              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                    fasted
                      ? 'bg-sanctuary-500 text-white'
                      : isToday
                      ? 'bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 ring-1 ring-gold-400'
                      : 'bg-cream-200 dark:bg-night-100 text-text-tertiary'
                  }`}
                >
                  {dayNum}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
