import { useState, useEffect } from 'react';

// Simple prayer time calculation based on location
// In production, use Aladhan API or similar
export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  const fetchPrayerTimes = async (lat, lng) => {
    try {
      setLoading(true);
      const today = new Date();
      const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lng}&method=2`
      );

      if (!response.ok) throw new Error('Failed to fetch prayer times');

      const data = await response.json();
      setPrayerTimes({
        fajr: data.data.timings.Fajr,
        sunrise: data.data.timings.Sunrise,
        dhuhr: data.data.timings.Dhuhr,
        asr: data.data.timings.Asr,
        maghrib: data.data.timings.Maghrib,
        isha: data.data.timings.Isha,
        date: data.data.date.readable,
        hijriDate: `${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year}`,
      });
      setError(null);
    } catch (err) {
      console.error('Prayer times error:', err);
      setError('Unable to fetch prayer times');
      // Fallback times (approximate)
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
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          fetchPrayerTimes(latitude, longitude);
        },
        (err) => {
          console.error('Geolocation error:', err);
          // Default to Mecca
          setLocation({ lat: 21.4225, lng: 39.8262 });
          fetchPrayerTimes(21.4225, 39.8262);
        }
      );
    } else {
      // Default to Mecca
      setLocation({ lat: 21.4225, lng: 39.8262 });
      fetchPrayerTimes(21.4225, 39.8262);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const getNextPrayer = () => {
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

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      if (prayerMinutes > currentTime) {
        return prayer;
      }
    }

    return prayers[0]; // Next day's Fajr
  };

  return { prayerTimes, loading, error, location, getNextPrayer, refresh: getLocation };
}
