import React from 'react';
import { ChevronLeft, Sun, Sunrise, Clock, Moon, RefreshCw, MapPin } from 'lucide-react';
import { Card } from '../ui';
import { usePrayerTimes } from '../../hooks';

const prayerIcons = {
  fajr: Sunrise,
  sunrise: Sun,
  dhuhr: Sun,
  asr: Sun,
  maghrib: Sunrise,
  isha: Moon,
};

const prayerNames = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

export function PrayerTimes({ onBack }) {
  const { prayerTimes, loading, error, getNextPrayer, refresh } = usePrayerTimes();
  const nextPrayer = getNextPrayer();

  const prayers = prayerTimes
    ? ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].map((key) => ({
        key,
        name: prayerNames[key],
        time: prayerTimes[key],
        icon: prayerIcons[key],
        isNext: nextPrayer?.name === prayerNames[key],
      }))
    : [];

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
      <div className="p-5 pt-12 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-text-tertiary active:text-text-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <button
            onClick={refresh}
            className="p-2 rounded-lg text-text-tertiary active:bg-cream-200 dark:active:bg-night-200 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Date Card */}
        <Card className="p-6 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 text-text-tertiary mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{prayerTimes?.date || 'Loading...'}</span>
          </div>
          {prayerTimes?.hijriDate && (
            <p className="text-lg font-medium text-text-primary">
              {prayerTimes.hijriDate}
            </p>
          )}
          <div className="flex items-center justify-center gap-1 mt-2 text-text-tertiary">
            <MapPin className="w-3 h-3" />
            <span className="text-xs">Based on your location</span>
          </div>
        </Card>

        {/* Next Prayer Highlight */}
        {nextPrayer && (
          <Card variant="sanctuary" className="p-5 mb-6">
            <p className="text-xs font-medium text-sanctuary-600 dark:text-sanctuary-400 uppercase tracking-wide mb-1">
              Next Prayer
            </p>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium text-text-primary">
                {nextPrayer.name}
              </h2>
              <p className="text-2xl font-light text-sanctuary-600 dark:text-sanctuary-400">
                {nextPrayer.time}
              </p>
            </div>
          </Card>
        )}

        {/* Prayer Times List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-cream-300 dark:border-night-50 border-t-sanctuary-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <Card className="p-6 text-center">
            <p className="text-text-secondary dark:text-cream-300">{error}</p>
            <button
              onClick={refresh}
              className="mt-4 text-sanctuary-600 dark:text-sanctuary-400 text-sm font-medium"
            >
              Try Again
            </button>
          </Card>
        ) : (
          <div className="space-y-2">
            {prayers.map((prayer) => {
              const Icon = prayer.icon;
              return (
                <Card
                  key={prayer.key}
                  className={`p-4 ${
                    prayer.isNext
                      ? 'ring-2 ring-sanctuary-500 dark:ring-gold-400'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          prayer.isNext
                            ? 'bg-sanctuary-100 dark:bg-sanctuary-900/50'
                            : 'bg-cream-200 dark:bg-night-100'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            prayer.isNext
                              ? 'text-sanctuary-600 dark:text-sanctuary-400'
                              : 'text-text-tertiary'
                          }`}
                        />
                      </div>
                      <span
                        className={`font-medium ${
                          prayer.isNext
                            ? 'text-sanctuary-600 dark:text-sanctuary-400'
                            : 'text-text-secondary dark:text-cream-200'
                        }`}
                      >
                        {prayer.name}
                      </span>
                    </div>
                    <span
                      className={`text-lg ${
                        prayer.isNext
                          ? 'font-medium text-sanctuary-600 dark:text-sanctuary-400'
                          : 'text-text-secondary dark:text-cream-300'
                      }`}
                    >
                      {prayer.time}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <Card className="p-4 mt-6">
          <p className="text-xs text-text-secondary dark:text-cream-300 leading-relaxed">
            Prayer times are calculated using the Islamic Society of North America (ISNA) method.
            Times may vary slightly. For the most accurate times, consult your local mosque.
          </p>
        </Card>
      </div>
    </div>
  );
}
