import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Heart,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { IslamicPattern, LatticeFrame } from './IslamicPattern';

function StepDots({ current, total }) {
  return (
    <div className="flex justify-center gap-2 mt-10">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? 'w-6 h-1.5 bg-gold-400'
              : i < current
              ? 'w-1.5 h-1.5 bg-sanctuary-400'
              : 'w-1.5 h-1.5 bg-cream-400 dark:bg-night-50'
          }`}
        />
      ))}
    </div>
  );
}

const intentCards = [
  {
    id: 'practice',
    icon: BookOpen,
    title: 'Deepen my practice',
    subtitle: 'Daily adhkar, Quran study, and spiritual habits',
    interests: ['adhkar', 'quran', 'mindfulness'],
  },
  {
    id: 'peace',
    icon: Heart,
    title: 'Find peace & comfort',
    subtitle: 'Duas, mood guidance, and gentle reminders',
    interests: ['duas', 'mindfulness'],
  },
  {
    id: 'learn',
    icon: Sparkles,
    title: 'Learn & grow',
    subtitle: 'Islamic knowledge, Sahabiyat stories, and more',
    interests: ['knowledge', 'community', 'quran'],
  },
];

export function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showBismillah, setShowBismillah] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showJourney, setShowJourney] = useState(false);

  // Staggered reveals for welcome screen
  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setShowSubtitle(true), 400);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Staggered reveals for Bismillah step
  useEffect(() => {
    if (step === 3) {
      setShowBismillah(false);
      setShowTranslation(false);
      setShowJourney(false);
      const t1 = setTimeout(() => setShowBismillah(true), 200);
      const t2 = setTimeout(() => setShowTranslation(true), 800);
      const t3 = setTimeout(() => setShowJourney(true), 1400);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [step]);

  const handleComplete = () => {
    const interests = selectedIntent
      ? intentCards.find((c) => c.id === selectedIntent)?.interests || []
      : [];
    onComplete({ name: name.trim(), interests });
  };

  // Step 0: Cinematic Welcome
  if (step === 0) {
    return (
      <div className="min-h-screen bg-sanctuary-800 flex flex-col items-center justify-center px-8 relative overflow-hidden">
        <IslamicPattern opacity={0.03} color="text-cream-200" />

        {/* Subtle golden glow behind calligraphy */}
        <div className="absolute w-48 h-48 bg-gold-400/10 rounded-full blur-3xl" />

        <div className="w-full max-w-sm relative text-center">
          {/* Arabic calligraphy name */}
          <h1 className="text-7xl font-arabic text-cream-100/90 mb-4 animate-gentle-reveal">
            أسماء
          </h1>

          {/* English name */}
          <p className="text-2xl font-light text-cream-200/70 mb-3 animate-gentle-reveal" style={{ animationDelay: '150ms' }}>
            Asma
          </p>

          {/* Subtitle with delayed reveal */}
          <p
            className={`text-cream-200/50 leading-relaxed mb-16 max-w-xs mx-auto transition-all duration-700 ${
              showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            Your companion in faith
          </p>

          <button
            onClick={() => setStep(1)}
            className="w-full py-3.5 bg-cream-100 text-sanctuary-800 rounded-xl font-medium active:bg-cream-200 transition-all duration-200 animate-gentle-reveal"
            style={{ animationDelay: '300ms' }}
          >
            Begin your journey
          </button>

          <StepDots current={0} total={4} />
        </div>
      </div>
    );
  }

  // Step 1: "What brings you here?" (Intent selection)
  if (step === 1) {
    return (
      <div className="min-h-screen bg-cream-100 dark:bg-night-300 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm animate-gentle-reveal">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-text-primary dark:text-cream-200 mb-1">
              What brings you here?
            </h2>
            <p className="text-text-secondary dark:text-cream-400 text-sm">
              Choose what resonates most
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {intentCards.map((card, i) => {
              const Icon = card.icon;
              const selected = selectedIntent === card.id;
              return (
                <button
                  key={card.id}
                  onClick={() => setSelectedIntent(card.id)}
                  className={`w-full p-5 rounded-2xl text-left transition-all duration-200 animate-slide-up ${
                    selected
                      ? 'bg-sanctuary-50 dark:bg-sanctuary-900/30 border-2 border-sanctuary-500 dark:border-sanctuary-400'
                      : 'bg-cream-50 dark:bg-night-100 border-2 border-cream-300 dark:border-night-50'
                  }`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      selected
                        ? 'bg-sanctuary-100 dark:bg-sanctuary-800/50'
                        : 'bg-cream-200 dark:bg-night-50'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        selected
                          ? 'text-sanctuary-600 dark:text-sanctuary-400'
                          : 'text-text-tertiary dark:text-cream-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`font-medium mb-0.5 ${
                        selected
                          ? 'text-sanctuary-700 dark:text-sanctuary-300'
                          : 'text-text-primary dark:text-cream-200'
                      }`}>
                        {card.title}
                      </p>
                      <p className={`text-sm ${
                        selected
                          ? 'text-sanctuary-600/70 dark:text-sanctuary-400/70'
                          : 'text-text-secondary dark:text-cream-400'
                      }`}>
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setStep(2)}
            className={`w-full py-3.5 rounded-xl font-medium transition-all duration-200 ${
              selectedIntent
                ? 'bg-sanctuary-600 text-white active:bg-sanctuary-700'
                : 'bg-cream-300 dark:bg-night-50 text-text-tertiary'
            }`}
          >
            Continue
          </button>

          <StepDots current={1} total={4} />
        </div>
      </div>
    );
  }

  // Step 2: Name Input with Islamic lattice frame
  if (step === 2) {
    return (
      <div className="min-h-screen bg-cream-100 dark:bg-night-300 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm animate-gentle-reveal">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-text-primary dark:text-cream-200 mb-1">
              What should we call you?
            </h2>
            <p className="text-text-secondary dark:text-cream-400 text-sm">
              This helps personalize your experience
            </p>
          </div>

          <LatticeFrame className="mb-8">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-4 py-3.5 bg-cream-50 dark:bg-night-200 border border-cream-300 dark:border-night-50 rounded-xl text-text-primary dark:text-cream-200 text-center placeholder-text-tertiary focus:outline-none focus:border-sanctuary-400 focus:ring-2 focus:ring-sanctuary-400/20 transition-all duration-200"
              autoFocus
            />
          </LatticeFrame>

          <button
            onClick={() => setStep(3)}
            className="w-full py-3.5 bg-sanctuary-600 text-white rounded-xl font-medium active:bg-sanctuary-700 transition-all duration-200"
          >
            {name.trim() ? `Continue as ${name.trim()}` : 'Continue'}
          </button>

          <button
            onClick={() => setStep(3)}
            className="w-full text-center text-sm text-text-tertiary mt-4 py-2"
          >
            Skip
          </button>

          <StepDots current={2} total={4} />
        </div>
      </div>
    );
  }

  // Step 3: Bismillah Moment
  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-300 flex flex-col items-center justify-center px-8">
      <div className="w-full max-w-sm text-center">
        {/* Bismillah calligraphy */}
        <div className={`transition-all duration-1000 ${showBismillah ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <p className="text-4xl font-arabic text-sanctuary-700 dark:text-sanctuary-400 leading-relaxed mb-6">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>

        {/* English translation */}
        <div className={`transition-all duration-700 ${showTranslation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <p className="text-text-secondary dark:text-cream-300 text-sm leading-relaxed mb-2">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
        </div>

        {/* Journey message */}
        <div className={`transition-all duration-700 mb-16 ${showJourney ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <p className="text-gold-500 dark:text-gold-400 text-sm mt-6">
            Your journey with ASMA begins now
          </p>
        </div>

        {/* Begin button - appears with journey text */}
        <div className={`transition-all duration-500 ${showJourney ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={handleComplete}
            className="w-full py-3.5 bg-sanctuary-600 text-white rounded-xl font-medium active:bg-sanctuary-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Begin
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <StepDots current={3} total={4} />
      </div>
    </div>
  );
}
