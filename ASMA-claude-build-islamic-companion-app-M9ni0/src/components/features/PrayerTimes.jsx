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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24">
      <div className="p-5 pt-12 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-400 active:text-neutral-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <button
            onClick={refresh}
            className="p-2 rounded-lg text-neutral-400 active:bg-neutral-100 dark:active:bg-neutral-800 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Date Card */}
        <Card className="p-6 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 text-neutral-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{prayerTimes?.date || 'Loading...'}</span>
          </div>
          {prayerTimes?.hijriDate && (
            <p className="text-lg font-medium text-neutral-800 dark:text-neutral-100">
              {prayerTimes.hijriDate}
            </p>
          )}
          <div className="flex items-center justify-center gap-1 mt-2 text-neutral-400">
            <MapPin className="w-3 h-3" />
            <span className="text-xs">Based on your location</span>
          </div>
        </Card>

        {/* Next Prayer Highlight */}
        {nextPrayer && (
          <Card variant="emerald" className="p-5 mb-6">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">
              Next Prayer
            </p>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium text-neutral-800 dark:text-neutral-100">
                {nextPrayer.name}
              </h2>
              <p className="text-2xl font-light text-emerald-600 dark:text-emerald-400">
                {nextPrayer.time}
              </p>
            </div>
          </Card>
        )}

        {/* Prayer Times List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-neutral-200 dark:border-neutral-600 border-t-emerald-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <Card className="p-6 text-center">
            <p className="text-neutral-500 dark:text-neutral-400">{error}</p>
            <button
              onClick={refresh}
              className="mt-4 text-emerald-600 dark:text-emerald-400 text-sm font-medium"
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
                      ? 'ring-2 ring-emerald-500 dark:ring-emerald-400'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          prayer.isNext
                            ? 'bg-emerald-100 dark:bg-emerald-900/50'
                            : 'bg-neutral-100 dark:bg-neutral-700'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            prayer.isNext
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-neutral-500 dark:text-neutral-400'
                          }`}
                        />
                      </div>
                      <span
                        className={`font-medium ${
                          prayer.isNext
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-neutral-700 dark:text-neutral-200'
                        }`}
                      >
                        {prayer.name}
                      </span>
                    </div>
                    <span
                      className={`text-lg ${
                        prayer.isNext
                          ? 'font-medium text-emerald-600 dark:text-emerald-400'
                          : 'text-neutral-600 dark:text-neutral-300'
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
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Prayer times are calculated using the Islamic Society of North America (ISNA) method.
            Times may vary slightly. For the most accurate times, consult your local mosque.
          </p>
        </Card>
      </div>
    </div>
  );
}
