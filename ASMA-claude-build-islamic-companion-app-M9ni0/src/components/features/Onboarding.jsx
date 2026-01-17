import React, { useState } from 'react';
import { Feather, CheckCircle, Shield, BookOpen, Lock, Sparkles } from 'lucide-react';
import { Button } from '../ui';

const steps = [
  {
    title: 'Asma',
    subtitle: 'أسماء',
    description: 'A safe space to understand your faith with clarity and compassion.',
    icon: Feather,
  },
  {
    title: 'Our Promise',
    points: [
      { icon: CheckCircle, text: 'All hadith verified for authenticity' },
      { icon: BookOpen, text: 'Female scholars cited throughout' },
      { icon: Sparkles, text: 'AI-powered guidance with real sources' },
      { icon: Lock, text: 'Your questions remain private' },
    ],
  },
];

export function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm animate-fade-in">
        {step === 0 ? (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center">
              <Feather className="w-8 h-8 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl font-light text-neutral-800 dark:text-neutral-100 mb-2 tracking-tight">
              {currentStep.title}
            </h1>
            <p className="text-lg text-neutral-400 mb-4">{currentStep.subtitle}</p>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed mb-12">
              {currentStep.description}
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-light text-neutral-800 dark:text-neutral-100 mb-8 text-center tracking-tight">
              {currentStep.title}
            </h2>
            <div className="space-y-3 mb-12">
              {currentStep.points.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <point.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-neutral-600 dark:text-neutral-300">{point.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={() => (step === 0 ? setStep(1) : onComplete())}
          className="w-full"
        >
          {step === 0 ? 'Begin' : 'Continue'}
        </Button>

        <div className="flex justify-center gap-2 mt-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-8 bg-emerald-600'
                  : 'w-1.5 bg-neutral-300 dark:bg-neutral-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
