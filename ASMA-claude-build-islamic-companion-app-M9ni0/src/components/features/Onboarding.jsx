import React, { useState } from 'react';
import {
  Feather,
  CheckCircle,
  BookOpen,
  Lock,
  Sparkles,
  Heart,
  Sun,
  Target,
  Compass,
  ArrowRight,
  User,
} from 'lucide-react';
import { Button } from '../ui';
import { IslamicPattern } from './IslamicPattern';

const interests = [
  { id: 'adhkar', label: 'Daily Adhkar', icon: Sun, color: 'amber' },
  { id: 'quran', label: 'Quran Study', icon: BookOpen, color: 'teal' },
  { id: 'duas', label: 'Learn Duas', icon: Heart, color: 'rose' },
  { id: 'knowledge', label: 'Islamic Knowledge', icon: Sparkles, color: 'violet' },
  { id: 'mindfulness', label: 'Spiritual Growth', icon: Target, color: 'emerald' },
  { id: 'community', label: 'Sahabiyat Stories', icon: Feather, color: 'purple' },
];

export function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    onComplete({ name: name.trim(), interests: selectedInterests });
  };

  // Step 0: Welcome - Beautiful pink gradient
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-rose-400 to-fuchsia-500 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <IslamicPattern opacity={0.08} />

        {/* Floating sparkle particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-sm animate-fade-in relative">
          <div className="text-center">
            {/* Glowing circle with icon */}
            <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-pink-500/20 animate-breathe">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                <Feather className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-light text-white mb-2 tracking-tight">
              Asma
            </h1>
            <p className="text-2xl text-pink-100 mb-3 font-arabic">أسماء</p>
            <p className="text-pink-100 leading-relaxed mb-12 text-lg">
              A safe space to understand your faith with clarity and compassion.
            </p>
          </div>

          <button
            onClick={() => setStep(1)}
            className="w-full py-4 bg-white/90 backdrop-blur-sm text-rose-600 rounded-2xl font-semibold text-lg active:bg-white transition-all shadow-lg shadow-black/10"
          >
            Begin Your Journey
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-8 bg-white'
                    : 'w-1.5 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Name
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-white dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <User className="w-8 h-8 text-rose-500 dark:text-rose-400" />
            </div>
            <h2 className="text-2xl font-light text-neutral-800 dark:text-neutral-100 mb-2 tracking-tight">
              What should we call you?
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              This helps personalize your experience
            </p>
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full px-5 py-4 bg-white dark:bg-neutral-800 border-2 border-rose-200 dark:border-neutral-700 rounded-2xl text-neutral-800 dark:text-neutral-100 text-center text-lg placeholder-neutral-400 focus:outline-none focus:border-rose-400 transition-colors mb-8"
            autoFocus
          />

          <Button
            onClick={() => setStep(2)}
            variant="rose"
            className="w-full py-4 text-lg"
          >
            {name.trim() ? `Welcome, ${name.trim()}` : 'Continue'}
          </Button>

          <button
            onClick={() => setStep(2)}
            className="w-full text-center text-sm text-neutral-400 mt-4 py-2"
          >
            Skip for now
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-8 bg-rose-500'
                    : i < step
                    ? 'w-1.5 bg-rose-400'
                    : 'w-1.5 bg-neutral-300 dark:bg-neutral-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Interests
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-white dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-neutral-800 dark:text-neutral-100 mb-2 tracking-tight">
              What interests you?
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              Select all that speak to your heart
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {interests.map((interest, i) => {
              const Icon = interest.icon;
              const selected = selectedInterests.includes(interest.id);
              return (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all animate-slide-up ${
                    selected
                      ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <Icon
                    className={`w-6 h-6 mb-2 ${
                      selected
                        ? 'text-rose-500 dark:text-rose-400'
                        : 'text-neutral-400'
                    }`}
                  />
                  <p
                    className={`text-sm font-medium ${
                      selected
                        ? 'text-rose-700 dark:text-rose-300'
                        : 'text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    {interest.label}
                  </p>
                  {selected && (
                    <CheckCircle className="w-4 h-4 text-rose-500 mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          <Button
            onClick={() => setStep(3)}
            variant="rose"
            className="w-full py-4 text-lg"
          >
            Continue
          </Button>

          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-8 bg-rose-500'
                    : i < step
                    ? 'w-1.5 bg-rose-400'
                    : 'w-1.5 bg-neutral-300 dark:bg-neutral-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Promises
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-white dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm animate-fade-in">
        <h2 className="text-2xl font-light text-neutral-800 dark:text-neutral-100 mb-8 text-center tracking-tight">
          Our Promise to You
        </h2>
        <div className="space-y-3 mb-12">
          {[
            { icon: CheckCircle, text: 'All hadith verified for authenticity', color: 'text-rose-500' },
            { icon: BookOpen, text: 'Female scholars cited throughout', color: 'text-violet-500' },
            { icon: Sparkles, text: 'AI-powered guidance with real sources', color: 'text-amber-500' },
            { icon: Lock, text: 'Your questions remain completely private', color: 'text-sky-500' },
            { icon: Target, text: 'Track your spiritual growth with XP & levels', color: 'text-pink-500' },
            { icon: Compass, text: 'Qibla direction and prayer times', color: 'text-teal-500' },
          ].map((point, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 bg-white/70 dark:bg-neutral-800 backdrop-blur-sm rounded-xl border border-rose-100 dark:border-neutral-700 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <point.icon className={`w-5 h-5 ${point.color} flex-shrink-0 mt-0.5`} />
              <p className="text-neutral-600 dark:text-neutral-300 text-sm">{point.text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleComplete}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-semibold text-lg active:opacity-90 transition-opacity shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
        >
          Start Exploring
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-8 bg-rose-500'
                  : i < step
                  ? 'w-1.5 bg-rose-400'
                  : 'w-1.5 bg-neutral-300 dark:bg-neutral-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
