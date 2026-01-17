import React, { useState } from 'react';
import { ChevronLeft, RotateCcw, Settings, Check } from 'lucide-react';
import { Card, Button } from '../ui';
import { useApp } from '../../context/AppContext';

const dhikrOptions = [
  { name: 'SubhanAllah', arabic: 'سُبْحَانَ اللَّهِ', meaning: 'Glory be to Allah' },
  { name: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', meaning: 'Praise be to Allah' },
  { name: 'Allahu Akbar', arabic: 'اللَّهُ أَكْبَرُ', meaning: 'Allah is the Greatest' },
  { name: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', meaning: 'There is no god but Allah' },
  { name: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', meaning: 'I seek forgiveness from Allah' },
  { name: 'La hawla wa la quwwata', arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', meaning: 'There is no power except with Allah' },
];

const goalOptions = [33, 99, 100, 1000];

export function DhikrCounter({ onBack }) {
  const { state, dispatch } = useApp();
  const [selectedDhikr, setSelectedDhikr] = useState(dhikrOptions[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  const progress = (state.dhikrCount / state.dhikrGoal) * 100;

  const handleTap = () => {
    if (state.hapticFeedback && navigator.vibrate) {
      navigator.vibrate(10);
    }

    const newCount = state.dhikrCount + 1;
    if (newCount >= state.dhikrGoal) {
      setShowComplete(true);
      setTimeout(() => setShowComplete(false), 2000);
    }

    dispatch({ type: 'INCREMENT_DHIKR' });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_DHIKR' });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      {/* Header */}
      <div className="p-5 pt-12 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-400 active:text-neutral-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg text-neutral-400 active:bg-neutral-100 dark:active:bg-neutral-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-5 max-w-lg mx-auto w-full mb-6 animate-fade-in">
          <Card className="p-5">
            <h3 className="font-medium text-neutral-800 dark:text-neutral-100 mb-4">Settings</h3>

            {/* Goal Selection */}
            <div className="mb-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">Goal</p>
              <div className="flex flex-wrap gap-2">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => dispatch({ type: 'SET_DHIKR_GOAL', payload: goal })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      state.dhikrGoal === goal
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Dhikr Selection */}
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">Dhikr</p>
              <div className="space-y-2">
                {dhikrOptions.map((dhikr) => (
                  <button
                    key={dhikr.name}
                    onClick={() => setSelectedDhikr(dhikr)}
                    className={`w-full p-3 rounded-xl text-left transition-colors ${
                      selectedDhikr.name === dhikr.name
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-500'
                        : 'bg-neutral-50 dark:bg-neutral-800 border-2 border-transparent'
                    }`}
                  >
                    <p className="font-medium text-neutral-800 dark:text-neutral-100 text-sm">
                      {dhikr.name}
                    </p>
                    <p className="text-xs text-neutral-400">{dhikr.meaning}</p>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Counter Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 max-w-lg mx-auto w-full">
        {/* Completion Animation */}
        {showComplete && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse">
              <Check className="w-12 h-12 text-white" />
            </div>
          </div>
        )}

        {/* Arabic Text */}
        <p className="text-3xl text-neutral-700 dark:text-neutral-200 font-arabic text-center mb-2" dir="rtl">
          {selectedDhikr.arabic}
        </p>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">{selectedDhikr.meaning}</p>

        {/* Counter Circle */}
        <button
          onClick={handleTap}
          className="relative w-56 h-56 rounded-full flex items-center justify-center active:scale-95 transition-transform"
        >
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-neutral-200 dark:text-neutral-700"
            />
            <circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 100}
              strokeDashoffset={2 * Math.PI * 100 * (1 - progress / 100)}
              className="text-emerald-500 transition-all duration-200"
            />
          </svg>

          {/* Inner Circle */}
          <div className="w-44 h-44 rounded-full bg-white dark:bg-neutral-800 shadow-lg flex flex-col items-center justify-center">
            <span className="text-5xl font-light text-neutral-800 dark:text-neutral-100">
              {state.dhikrCount}
            </span>
            <span className="text-sm text-neutral-400">/ {state.dhikrGoal}</span>
          </div>
        </button>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="mt-8 flex items-center gap-2 px-4 py-2 text-neutral-400 active:text-neutral-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">Reset</span>
        </button>
      </div>

      {/* History */}
      {state.dhikrHistory.length > 0 && (
        <div className="p-5 max-w-lg mx-auto w-full">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-3">
              Today's Progress
            </h3>
            <div className="flex gap-2 flex-wrap">
              {state.dhikrHistory.slice(-10).map((entry, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
