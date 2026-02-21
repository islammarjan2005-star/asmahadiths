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
  { id: 'adhkar', label: 'Daily Adhkar', icon: Sun },
  { id: 'quran', label: 'Quran Study', icon: BookOpen },
  { id: 'duas', label: 'Learn Duas', icon: Heart },
  { id: 'knowledge', label: 'Islamic Knowledge', icon: Sparkles },
  { id: 'mindfulness', label: 'Spiritual Growth', icon: Target },
  { id: 'community', label: 'Sahabiyat Stories', icon: Feather },
];

function StepDots({ current, total }) {
  return (
    <div className="flex justify-center gap-2 mt-10">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? 'w-6 h-1.5 bg-emerald-600'
              : i < current
              ? 'w-1.5 h-1.5 bg-emerald-300'
              : 'w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600'
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

  // Step 0: Welcome
  if (step === 0) {
    return (
      <div className="min-h-screen bg-emerald-800 flex flex-col items-center justify-center px-8 relative overflow-hidden">
        <IslamicPattern opacity={0.04} />
        <div className="w-full max-w-sm animate-fade-in relative text-center">
          <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-white/10 flex items-center justify-center">
            <Feather className="w-7 h-7 text-emerald-200" />
          </div>

          <h1 className="text-4xl font-semibold text-white mb-2 tracking-tight">
            Asma
          </h1>
          <p className="text-xl text-emerald-200/80 mb-2 font-arabic">أسماء</p>
          <p className="text-emerald-100/60 leading-relaxed mb-16 max-w-xs mx-auto">
            Your companion for understanding faith with clarity, compassion, and authenticity.
          </p>

          <button
            onClick={() => setStep(1)}
            className="w-full py-3.5 bg-white text-emerald-800 rounded-xl font-medium active:bg-slate-50 transition-colors"
          >
            Get started
          </button>

          <StepDots current={0} total={4} />
        </div>
      </div>
    );
  }

  // Step 1: Name
  if (step === 1) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="text-center mb-10">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
              What should we call you?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              This helps personalize your experience
            </p>
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-center placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors mb-6"
            autoFocus
          />

          <Button onClick={() => setStep(2)} className="w-full" size="lg">
            {name.trim() ? `Continue as ${name.trim()}` : 'Continue'}
          </Button>

          <button
            onClick={() => setStep(2)}
            className="w-full text-center text-sm text-slate-400 mt-4 py-2"
          >
            Skip
          </button>

          <StepDots current={1} total={4} />
        </div>
      </div>
    );
  }

  // Step 2: Interests
  if (step === 2) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
              What interests you?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Select all that apply
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
                  className={`p-4 rounded-xl text-left transition-all animate-slide-up ${
                    selected
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-600 dark:border-emerald-500'
                      : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700'
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <Icon
                    className={`w-5 h-5 mb-2 ${
                      selected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'
                    }`}
                  />
                  <p className={`text-sm font-medium ${
                    selected ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'
                  }`}>
                    {interest.label}
                  </p>
                </button>
              );
            })}
          </div>

          <Button onClick={() => setStep(3)} className="w-full" size="lg">
            Continue
          </Button>

          <StepDots current={2} total={4} />
        </div>
      </div>
    );
  }

  // Step 3: Promises
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center px-8">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
            Our promise to you
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Built with care and authenticity
          </p>
        </div>

        <div className="space-y-2.5 mb-10">
          {[
            { icon: CheckCircle, text: 'All hadith verified for authenticity' },
            { icon: BookOpen, text: 'Female scholars cited throughout' },
            { icon: Sparkles, text: 'AI-powered guidance with real sources' },
            { icon: Lock, text: 'Your questions remain completely private' },
            { icon: Target, text: 'Track your spiritual growth' },
            { icon: Compass, text: 'Qibla direction and prayer times' },
          ].map((point, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50 animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <point.icon className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <p className="text-sm text-slate-600 dark:text-slate-300">{point.text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleComplete}
          className="w-full py-3.5 bg-emerald-700 text-white rounded-xl font-medium active:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
        >
          Start exploring
          <ArrowRight className="w-4 h-4" />
        </button>

        <StepDots current={3} total={4} />
      </div>
    </div>
  );
}
