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
  Moon,
} from 'lucide-react';
import { Button } from '../ui';
import { IslamicPattern } from './IslamicPattern';

const interests = [
  { id: 'adhkar', label: 'Daily Adhkar', icon: Sun, bg: 'bg-amber-100 dark:bg-amber-900/30', fg: 'text-amber-600 dark:text-amber-400' },
  { id: 'quran', label: 'Quran Study', icon: BookOpen, bg: 'bg-teal-100 dark:bg-teal-900/30', fg: 'text-teal-600 dark:text-teal-400' },
  { id: 'duas', label: 'Learn Duas', icon: Heart, bg: 'bg-rose-100 dark:bg-rose-900/30', fg: 'text-rose-500 dark:text-rose-400' },
  { id: 'knowledge', label: 'Islamic Knowledge', icon: Sparkles, bg: 'bg-violet-100 dark:bg-violet-900/30', fg: 'text-violet-600 dark:text-violet-400' },
  { id: 'mindfulness', label: 'Spiritual Growth', icon: Target, bg: 'bg-emerald-100 dark:bg-emerald-900/30', fg: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'community', label: 'Sahabiyat Stories', icon: Feather, bg: 'bg-orange-100 dark:bg-orange-900/30', fg: 'text-orange-600 dark:text-orange-400' },
];

function CrescentMoon({ className = '' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="currentColor">
      <path d="M28 4a20 20 0 1 0 0 40 20 20 0 0 1 0-40z" opacity="0.15" />
      <path d="M30 6a18 18 0 1 0 0 36c-6 0-11.5-3-14.8-7.8A18 18 0 0 1 30 6z" />
    </svg>
  );
}

function StepDots({ current, total }) {
  return (
    <div className="flex justify-center gap-2.5 mt-10">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-500 ${
            i === current
              ? 'w-8 bg-white shadow-md shadow-white/30'
              : i < current
              ? 'w-2 bg-white/50'
              : 'w-2 bg-white/20'
          }`}
        />
      ))}
    </div>
  );
}

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

  // Step 0: Welcome - Warm sunset gradient with crescent moon
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-rose-400 to-fuchsia-500 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <IslamicPattern opacity={0.06} />

        {/* Warm ambient particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: `rgba(255,255,255,${0.15 + Math.random() * 0.25})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-sm animate-fade-in relative">
          <div className="text-center">
            {/* Warm glowing icon with crescent */}
            <div className="relative w-32 h-32 mx-auto mb-10">
              <div className="absolute inset-0 rounded-full bg-white/10 animate-breathe" />
              <div className="absolute inset-2 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <CrescentMoon className="w-14 h-14 text-amber-100" />
              </div>
              {/* Decorative stars */}
              <div className="absolute -top-2 -right-1 w-3 h-3 text-amber-200 animate-float" style={{ animationDelay: '0.5s' }}>
                <Sparkles className="w-3 h-3" />
              </div>
              <div className="absolute top-2 -left-3 w-2 h-2 text-white/50 animate-float" style={{ animationDelay: '1.5s' }}>
                <Sparkles className="w-2 h-2" />
              </div>
            </div>

            <h1 className="text-5xl font-light text-white mb-3 tracking-tight">
              Asma
            </h1>
            <p className="text-3xl text-white/70 mb-4 font-arabic leading-relaxed">أسماء</p>
            <p className="text-white/80 leading-relaxed mb-14 text-lg max-w-xs mx-auto">
              Your safe, warm companion on the journey to understanding your faith.
            </p>
          </div>

          <button
            onClick={() => setStep(1)}
            className="w-full py-4.5 bg-white text-rose-600 rounded-2xl font-semibold text-lg active:scale-[0.98] transition-all shadow-xl shadow-black/10"
          >
            Begin Your Journey
          </button>

          <StepDots current={0} total={4} />
        </div>
      </div>
    );
  }

  // Step 1: Name - Warm cream background
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-fuchsia-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-md shadow-rose-200/30">
              <User className="w-9 h-9 text-rose-500 dark:text-rose-400" />
            </div>
            <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-100 mb-2">
              What should we call you?
            </h2>
            <p className="text-stone-500 dark:text-stone-400">
              This helps personalize your experience
            </p>
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full px-6 py-4.5 warm-card text-stone-800 dark:text-stone-100 text-center text-lg placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-500 transition-all mb-8"
            autoFocus
          />

          <Button
            onClick={() => setStep(2)}
            variant="warm"
            className="w-full"
            size="lg"
          >
            {name.trim() ? `Welcome, ${name.trim()}` : 'Continue'}
          </Button>

          <button
            onClick={() => setStep(2)}
            className="w-full text-center text-sm text-stone-400 mt-5 py-2"
          >
            Skip for now
          </button>

          <StepDots current={1} total={4} />
        </div>
      </div>
    );
  }

  // Step 2: Interests
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-fuchsia-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-100 mb-2">
              What speaks to your heart?
            </h2>
            <p className="text-stone-500 dark:text-stone-400">
              Choose all that interest you
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-10">
            {interests.map((interest, i) => {
              const Icon = interest.icon;
              const selected = selectedInterests.includes(interest.id);
              return (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all animate-slide-up ${
                    selected
                      ? 'border-rose-300 bg-rose-50/80 dark:bg-rose-900/20 dark:border-rose-600 shadow-md shadow-rose-200/30'
                      : 'border-transparent warm-card active:scale-[0.97]'
                  }`}
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className={`w-10 h-10 ${interest.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${interest.fg}`} />
                  </div>
                  <p className={`text-sm font-semibold ${
                    selected ? 'text-rose-700 dark:text-rose-300' : 'text-stone-700 dark:text-stone-300'
                  }`}>
                    {interest.label}
                  </p>
                  {selected && (
                    <CheckCircle className="w-4 h-4 text-rose-500 mt-1.5" />
                  )}
                </button>
              );
            })}
          </div>

          <Button onClick={() => setStep(3)} variant="warm" className="w-full" size="lg">
            Continue
          </Button>

          <StepDots current={2} total={4} />
        </div>
      </div>
    );
  }

  // Step 3: Promises
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-fuchsia-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <Moon className="w-8 h-8 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-100 mb-1">
            Our Promise to You
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            Built with love and authenticity
          </p>
        </div>

        <div className="space-y-3 mb-10">
          {[
            { icon: CheckCircle, text: 'All hadith verified for authenticity', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
            { icon: BookOpen, text: 'Female scholars cited throughout', color: 'text-violet-500', bg: 'bg-violet-100 dark:bg-violet-900/30' },
            { icon: Sparkles, text: 'AI-powered guidance with real sources', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
            { icon: Lock, text: 'Your questions remain completely private', color: 'text-sky-500', bg: 'bg-sky-100 dark:bg-sky-900/30' },
            { icon: Target, text: 'Track your spiritual growth journey', color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/30' },
            { icon: Compass, text: 'Qibla direction and prayer times', color: 'text-teal-500', bg: 'bg-teal-100 dark:bg-teal-900/30' },
          ].map((point, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 warm-card animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`w-10 h-10 ${point.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <point.icon className={`w-5 h-5 ${point.color}`} />
              </div>
              <p className="text-stone-600 dark:text-stone-300 text-sm font-medium">{point.text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleComplete}
          className="w-full py-4 bg-gradient-to-r from-orange-400 via-rose-500 to-fuchsia-500 text-white rounded-2xl font-semibold text-lg active:scale-[0.98] transition-all shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2"
        >
          Start Exploring
          <ArrowRight className="w-5 h-5" />
        </button>

        <StepDots current={3} total={4} />
      </div>
    </div>
  );
}
