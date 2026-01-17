import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Flame,
  Trophy,
  Play,
  Pause,
  Info,
} from 'lucide-react';
import { Card, Button } from '../ui';
import { useApp } from '../../context/AppContext';
import { adhkarDatabase, getAdhkarStats } from '../../data';

export function SmartAdhkar({ onBack }) {
  const { state, dispatch } = useApp();
  const [activeType, setActiveType] = useState('morning');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const cardRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const adhkars = adhkarDatabase[activeType] || [];
  const currentAdhkar = adhkars[currentIndex];
  const stats = getAdhkarStats(activeType);

  // Get progress for current adhkar
  const getProgress = (dhikrId) => {
    return state.adhkarProgress?.[activeType]?.[dhikrId] || 0;
  };

  // Calculate overall session progress
  const calculateSessionProgress = () => {
    let completed = 0;
    let total = 0;
    adhkars.forEach((adhkar) => {
      total += adhkar.count;
      completed += Math.min(getProgress(adhkar.id), adhkar.count);
    });
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const sessionProgress = calculateSessionProgress();
  const isSessionComplete = sessionProgress >= 100;

  // Check if current adhkar is complete
  const isCurrentComplete = currentAdhkar && getProgress(currentAdhkar.id) >= currentAdhkar.count;

  // Handle tap/count increment
  const handleTap = () => {
    if (!currentAdhkar || isCurrentComplete) return;

    if (state.hapticFeedback && navigator.vibrate) {
      navigator.vibrate(10);
    }

    const newCount = getProgress(currentAdhkar.id) + 1;
    dispatch({
      type: 'UPDATE_ADHKAR_PROGRESS',
      payload: { type: activeType, dhikrId: currentAdhkar.id, count: newCount },
    });

    // Check if this completes the adhkar
    if (newCount >= currentAdhkar.count) {
      // Auto-advance to next after a brief delay
      setTimeout(() => {
        if (currentIndex < adhkars.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          // Session complete
          handleSessionComplete();
        }
      }, 500);
    }
  };

  // Handle session completion
  const handleSessionComplete = () => {
    if (!isSessionComplete) return;

    setShowComplete(true);
    if (state.hapticFeedback && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    dispatch({
      type: 'COMPLETE_ADHKAR_SESSION',
      payload: { type: activeType },
    });

    setTimeout(() => setShowComplete(false), 3000);
  };

  // Touch/swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < adhkars.length - 1) {
        // Swipe left - next
        setCurrentIndex(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        // Swipe right - previous
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  // Navigate between adhkars
  const goNext = () => {
    if (currentIndex < adhkars.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Reset current session
  const handleReset = () => {
    dispatch({
      type: 'RESET_ADHKAR_PROGRESS',
      payload: { type: activeType },
    });
    setCurrentIndex(0);
  };

  // Switch between morning/evening
  const switchType = (type) => {
    setActiveType(type);
    setCurrentIndex(0);
  };

  // Text-to-speech for Arabic
  const toggleAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else if (currentAdhkar) {
      const utterance = new SpeechSynthesisUtterance(currentAdhkar.arabic);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Check for completion
  useEffect(() => {
    if (isSessionComplete && sessionProgress === 100) {
      handleSessionComplete();
    }
  }, [sessionProgress]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col pb-24">
      {/* Header */}
      <div className="p-5 pt-12 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-400 active:text-neutral-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg text-neutral-400 active:bg-neutral-100 dark:active:bg-neutral-800 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-medium text-neutral-800 dark:text-neutral-100 mb-1">
            Daily Adhkar
          </h1>
          <p className="text-sm text-neutral-400">Guided morning & evening remembrance</p>
        </div>

        {/* Morning/Evening Toggle */}
        <div className="flex gap-2 mb-6 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
          <button
            onClick={() => switchType('morning')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeType === 'morning'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            <Sun className="w-4 h-4" />
            Morning
          </button>
          <button
            onClick={() => switchType('evening')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeType === 'evening'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            <Moon className="w-4 h-4" />
            Evening
          </button>
        </div>

        {/* Streak Display */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                {state.adhkarStreak?.current || 0}
              </p>
              <p className="text-xs text-neutral-400">Day Streak</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                {state.adhkarStreak?.longest || 0}
              </p>
              <p className="text-xs text-neutral-400">Best Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Session Progress Bar */}
      <div className="px-5 max-w-lg mx-auto w-full mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Session Progress
          </span>
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
            {Math.round(sessionProgress)}%
          </span>
        </div>
        <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              activeType === 'morning' ? 'bg-amber-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${sessionProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-neutral-400">
            {currentIndex + 1} of {adhkars.length} adhkar
          </span>
          <span className="text-xs text-neutral-400">
            ~{stats.totalDhikr} total dhikr
          </span>
        </div>
      </div>

      {/* Completion Animation */}
      {showComplete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 pointer-events-none">
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse-soft">
              <Check className="w-12 h-12 text-white" />
            </div>
            <p className="text-xl font-medium text-white">Masha'Allah!</p>
            <p className="text-neutral-200">Session Complete</p>
          </div>
        </div>
      )}

      {/* Main Adhkar Card */}
      {currentAdhkar && (
        <div className="flex-1 flex flex-col px-5 max-w-lg mx-auto w-full">
          <div
            ref={cardRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="flex-1"
          >
            <Card className="p-6 relative h-full flex flex-col">
              {/* Progress indicator for this adhkar */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <Info className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleAudio}
                  className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  {isPlaying ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Counter badge */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isCurrentComplete
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : activeType === 'morning'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  {isCurrentComplete ? (
                    <>
                      <Check className="w-3 h-3 inline mr-1" />
                      Complete
                    </>
                  ) : (
                    `${getProgress(currentAdhkar.id)} / ${currentAdhkar.count}`
                  )}
                </span>
              </div>

              {/* Info Panel */}
              {showInfo && (
                <div className="mb-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl animate-fade-in">
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-2">
                    <span className="font-medium">Source:</span> {currentAdhkar.source}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {currentAdhkar.benefit}
                  </p>
                </div>
              )}

              {/* Arabic Text */}
              <div
                onClick={handleTap}
                className={`flex-1 flex flex-col justify-center cursor-pointer active:scale-[0.99] transition-transform ${
                  isCurrentComplete ? 'opacity-50' : ''
                }`}
              >
                <p
                  className="text-2xl leading-relaxed text-neutral-800 dark:text-neutral-100 font-arabic text-center mb-6"
                  dir="rtl"
                >
                  {currentAdhkar.arabic}
                </p>

                {/* Transliteration */}
                <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-4 italic">
                  {currentAdhkar.transliteration}
                </p>

                {/* Translation */}
                <p className="text-sm text-neutral-600 dark:text-neutral-300 text-center leading-relaxed">
                  {currentAdhkar.translation}
                </p>
              </div>

              {/* Tap instruction */}
              {!isCurrentComplete && (
                <p className="text-center text-xs text-neutral-400 mt-4">
                  Tap anywhere to count
                </p>
              )}
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between py-4">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentIndex === 0
                  ? 'text-neutral-300 dark:text-neutral-600'
                  : 'text-neutral-600 dark:text-neutral-300 active:bg-neutral-100 dark:active:bg-neutral-800'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Previous</span>
            </button>

            {/* Dot indicators */}
            <div className="flex gap-1">
              {adhkars.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, idx) => {
                const actualIdx = Math.max(0, currentIndex - 2) + idx;
                const isComplete = getProgress(adhkars[actualIdx]?.id) >= adhkars[actualIdx]?.count;
                return (
                  <div
                    key={actualIdx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      actualIdx === currentIndex
                        ? activeType === 'morning'
                          ? 'bg-amber-500 w-4'
                          : 'bg-indigo-500 w-4'
                        : isComplete
                        ? 'bg-emerald-400'
                        : 'bg-neutral-300 dark:bg-neutral-600'
                    }`}
                  />
                );
              })}
            </div>

            <button
              onClick={goNext}
              disabled={currentIndex === adhkars.length - 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentIndex === adhkars.length - 1
                  ? 'text-neutral-300 dark:text-neutral-600'
                  : 'text-neutral-600 dark:text-neutral-300 active:bg-neutral-100 dark:active:bg-neutral-800'
              }`}
            >
              <span className="text-sm">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Today's History */}
      {state.adhkarHistory?.length > 0 && (
        <div className="px-5 max-w-lg mx-auto w-full mt-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-3">
              Recent Completions
            </h3>
            <div className="flex gap-2 flex-wrap">
              {state.adhkarHistory.slice(-7).map((entry, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                    entry.type === 'morning'
                      ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                      : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  {entry.type === 'morning' ? (
                    <Sun className="w-3 h-3" />
                  ) : (
                    <Moon className="w-3 h-3" />
                  )}
                  {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
