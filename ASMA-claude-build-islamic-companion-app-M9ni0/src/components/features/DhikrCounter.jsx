import React, { useState, useRef } from 'react';
import { RotateCcw, Settings, Check } from 'lucide-react';
import { Card, ScreenHeader } from '../ui';
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

// Milestone thresholds for celebration
const MILESTONES = new Set([33, 99, 100, 500, 1000]);

export function DhikrCounter({ onBack }) {
  const { state, dispatch } = useApp();
  const [selectedDhikr, setSelectedDhikr] = useState(dhikrOptions[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [isPop, setIsPop] = useState(false);
  const [particles, setParticles] = useState([]);
  const counterRef = useRef(null);

  const progress = (state.dhikrCount / state.dhikrGoal) * 100;
  const circumference = 2 * Math.PI * 100;

  const spawnParticles = () => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      angle: (i / 8) * 360,
      delay: Math.random() * 200,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  const handleTap = () => {
    if (state.hapticFeedback && navigator.vibrate) {
      navigator.vibrate(10);
    }

    // Pop animation
    setIsPop(true);
    setTimeout(() => setIsPop(false), 250);

    const newCount = state.dhikrCount + 1;

    // Milestone celebration
    if (MILESTONES.has(newCount) || newCount >= state.dhikrGoal) {
      if (state.hapticFeedback && navigator.vibrate) {
        navigator.vibrate([30, 50, 30]);
      }
      spawnParticles();
    }

    if (newCount >= state.dhikrGoal) {
      setShowComplete(true);
      setTimeout(() => setShowComplete(false), 2500);
    }

    dispatch({ type: 'INCREMENT_DHIKR' });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_DHIKR' });
  };

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-200 flex flex-col">
      {/* Header */}
      <ScreenHeader title="Dhikr Counter" onBack={onBack} />
      <div className="px-5 max-w-lg mx-auto w-full flex justify-end -mt-2 mb-2">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg text-text-tertiary active:bg-cream-200 dark:active:bg-night-100 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-5 max-w-lg mx-auto w-full mb-6 animate-fade-in">
          <Card padding={false} className="p-5">
            <h3 className="font-medium text-text-primary dark:text-cream-200 mb-4">Settings</h3>

            {/* Goal Selection */}
            <div className="mb-4">
              <p className="text-sm text-text-tertiary dark:text-text-tertiary mb-2">Goal</p>
              <div className="flex flex-wrap gap-2">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => dispatch({ type: 'SET_DHIKR_GOAL', payload: goal })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      state.dhikrGoal === goal
                        ? 'bg-sanctuary-600 text-white'
                        : 'bg-cream-200 dark:bg-night-100 text-text-secondary dark:text-cream-300'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Dhikr Selection */}
            <div>
              <p className="text-sm text-text-tertiary dark:text-text-tertiary mb-2">Dhikr</p>
              <div className="space-y-2">
                {dhikrOptions.map((dhikr) => (
                  <button
                    key={dhikr.name}
                    onClick={() => setSelectedDhikr(dhikr)}
                    className={`w-full p-3 rounded-xl text-left transition-colors ${
                      selectedDhikr.name === dhikr.name
                        ? 'bg-sanctuary-50 dark:bg-sanctuary-900/30 border-2 border-sanctuary-500'
                        : 'bg-cream-100 dark:bg-night-100 border-2 border-transparent'
                    }`}
                  >
                    <p className="font-medium text-text-primary dark:text-cream-200 text-sm">
                      {dhikr.name}
                    </p>
                    <p className="text-xs text-text-tertiary">{dhikr.meaning}</p>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Counter Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 max-w-lg mx-auto w-full">
        {/* Completion Celebration */}
        {showComplete && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="flex flex-col items-center animate-bounce-in">
              <div className="w-24 h-24 bg-gold-400 rounded-full flex items-center justify-center animate-glow-complete">
                <Check className="w-12 h-12 text-white" />
              </div>
              <p className="mt-4 text-lg font-semibold text-gold-600 dark:text-gold-400 animate-slide-up">
                MashaAllah!
              </p>
              <p className="text-sm text-text-tertiary animate-slide-up" style={{ animationDelay: '100ms' }}>
                Set complete
              </p>
            </div>
          </div>
        )}

        {/* Arabic Text */}
        <p className="text-3xl text-text-secondary dark:text-cream-200 font-arabic text-center mb-2" dir="rtl">
          {selectedDhikr.arabic}
        </p>
        <p className="text-text-tertiary dark:text-text-tertiary text-sm mb-8">{selectedDhikr.meaning}</p>

        {/* Counter Circle */}
        <div className="relative" ref={counterRef}>
          {/* Particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-gold-400 animate-float-up"
              style={{
                transform: `rotate(${p.angle}deg) translateY(-120px)`,
                animationDelay: `${p.delay}ms`,
              }}
            />
          ))}

          <button
            onClick={handleTap}
            className={`relative w-56 h-56 rounded-full flex items-center justify-center transition-transform ${
              isPop ? 'animate-count-pop' : ''
            }`}
          >
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="100"
                fill="none"
                strokeWidth="8"
                className="stroke-cream-300 dark:stroke-night-100"
              />
              <circle
                cx="112"
                cy="112"
                r="100"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress / 100)}
                className="stroke-sanctuary-500 transition-all duration-300 ease-out"
              />
            </svg>

            {/* Inner Circle */}
            <div className="w-44 h-44 rounded-full bg-cream-50 dark:bg-night-100 shadow-lg flex flex-col items-center justify-center">
              <span className={`text-5xl font-light text-text-primary dark:text-cream-200 ${isPop ? 'animate-number-tick' : ''}`}>
                {state.dhikrCount}
              </span>
              <span className="text-sm text-text-tertiary">/ {state.dhikrGoal}</span>
            </div>
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="mt-8 flex items-center gap-2 px-4 py-2 text-text-tertiary active:text-text-secondary transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">Reset</span>
        </button>
      </div>

      {/* History */}
      {state.dhikrHistory.length > 0 && (
        <div className="p-5 max-w-lg mx-auto w-full">
          <Card>
            <h3 className="text-sm font-medium text-text-secondary dark:text-cream-300 mb-3">
              Today's Progress
            </h3>
            <div className="flex gap-2 flex-wrap">
              {state.dhikrHistory.slice(-10).map((entry, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-sanctuary-100 dark:bg-sanctuary-900/50 flex items-center justify-center"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <Check className="w-4 h-4 text-sanctuary-600 dark:text-sanctuary-400" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
