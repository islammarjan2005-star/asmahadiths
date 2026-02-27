import { useState, useEffect, useCallback } from 'react';

const CACHE_KEY = 'asma-prayer-times-cache';
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

function getCachedPrayerTimes() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function setCachedPrayerTimes(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch { /* quota exceeded — silently ignore */ }
}

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [hijriData, setHijriData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const fetchPrayerTimes = async (lat, lng) => {
    // Try cache first
    const cached = getCachedPrayerTimes();
    const today = new Date();
    const todayStr = today.toDateString();

    if (cached && cached._cacheDate === todayStr) {
      setPrayerTimes(cached.times);
      setHijriData(cached.hijri);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lng}&method=2`
      );

      if (!response.ok) throw new Error('Failed to fetch prayer times');

      const data = await response.json();
      const times = {
        fajr: data.data.timings.Fajr,
        sunrise: data.data.timings.Sunrise,
        dhuhr: data.data.timings.Dhuhr,
        asr: data.data.timings.Asr,
        maghrib: data.data.timings.Maghrib,
        isha: data.data.timings.Isha,
        date: data.data.date.readable,
        hijriDate: `${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year}`,
      };

      const hijri = {
        day: parseInt(data.data.date.hijri.day),
        month: data.data.date.hijri.month.en,
        monthAr: data.data.date.hijri.month.ar,
        monthNumber: parseInt(data.data.date.hijri.month.number),
        year: parseInt(data.data.date.hijri.year),
        designation: data.data.date.hijri.designation.abbreviated,
        weekdayEn: data.data.date.hijri.weekday.en,
        weekdayAr: data.data.date.hijri.weekday.ar,
        formatted: `${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year}`,
      };

      setPrayerTimes(times);
      setHijriData(hijri);
      setCachedPrayerTimes({ times, hijri, _cacheDate: todayStr });
      setError(null);
    } catch (err) {
      console.error('Prayer times error:', err);
      setError('Unable to fetch prayer times');
      setPrayerTimes({
        fajr: '05:30',
        sunrise: '06:45',
        dhuhr: '12:30',
        asr: '15:45',
        maghrib: '18:15',
        isha: '19:45',
        date: new Date().toLocaleDateString(),
        hijriDate: '',
      });
      setHijriData(null);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          fetchPrayerTimes(latitude, longitude);
        },
        () => {
          setLocation({ lat: 21.4225, lng: 39.8262 });
          fetchPrayerTimes(21.4225, 39.8262);
        }
      );
    } else {
      setLocation({ lat: 21.4225, lng: 39.8262 });
      fetchPrayerTimes(21.4225, 39.8262);
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const getNextPrayer = useCallback(() => {
    if (!prayerTimes) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: 'Fajr', time: prayerTimes.fajr, arabic: 'الفجر' },
      { name: 'Dhuhr', time: prayerTimes.dhuhr, arabic: 'الظهر' },
      { name: 'Asr', time: prayerTimes.asr, arabic: 'العصر' },
      { name: 'Maghrib', time: prayerTimes.maghrib, arabic: 'المغرب' },
      { name: 'Isha', time: prayerTimes.isha, arabic: 'العشاء' },
    ];

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      if (prayerMinutes > currentTime) {
        return prayer;
      }
    }

    return { ...prayers[0], isNextDay: true };
  }, [prayerTimes]);

  // Countdown timer - updates every minute
  useEffect(() => {
    function updateCountdown() {
      const next = getNextPrayer();
      if (!next) { setCountdown(null); return; }

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [h, m] = next.time.split(':').map(Number);
      let prayerMinutes = h * 60 + m;

      if (next.isNextDay) prayerMinutes += 24 * 60;
      const diff = prayerMinutes - currentMinutes;

      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;

      setCountdown({
        prayer: next.name,
        arabic: next.arabic,
        hours,
        minutes,
        isSoon: diff <= 30,
        isNow: diff <= 5,
        display: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      });
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [getNextPrayer]);

  const isJumuah = () => new Date().getDay() === 5;

  const getCurrentPrayerWindow = useCallback(() => {
    if (!prayerTimes) return null;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: 'Fajr', time: prayerTimes.fajr },
      { name: 'Dhuhr', time: prayerTimes.dhuhr },
      { name: 'Asr', time: prayerTimes.asr },
      { name: 'Maghrib', time: prayerTimes.maghrib },
      { name: 'Isha', time: prayerTimes.isha },
    ];

    for (let i = prayers.length - 1; i >= 0; i--) {
      const [h, m] = prayers[i].time.split(':').map(Number);
      if (currentTime >= h * 60 + m) return prayers[i].name;
    }
    return 'Isha'; // After midnight before Fajr
  }, [prayerTimes]);

  return {
    prayerTimes,
    hijriData,
    loading,
    error,
    location,
    countdown,
    getNextPrayer,
    isJumuah,
    getCurrentPrayerWindow,
    refresh: getLocation,
  };
}
