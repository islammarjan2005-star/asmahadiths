import React from 'react';
import {
  ChevronLeft,
  Moon,
  Sun,
  Bell,
  Vibrate,
  Trash2,
  Info,
  ExternalLink,
  Heart,
} from 'lucide-react';
import { Card, Button } from '../ui';
import { useApp } from '../../context/AppContext';

export function Settings({ onBack }) {
  const { state, dispatch } = useApp();

  const handleClearData = () => {
    if (window.confirm('This will clear all your saved content and journal entries. Continue?')) {
      localStorage.removeItem('asma-app-state');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-200 pb-24">
      <div className="p-5 pt-12 max-w-lg mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-tertiary mb-8 active:text-text-secondary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-2xl font-medium text-text-primary dark:text-cream-200 mb-6">
          Settings
        </h1>

        {/* Appearance */}
        <div className="mb-6">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-3">
            Appearance
          </p>
          <Card className="divide-y divide-cream-300 dark:divide-night-50">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {state.darkMode ? (
                  <Moon className="w-5 h-5 text-text-tertiary dark:text-text-tertiary" />
                ) : (
                  <Sun className="w-5 h-5 text-text-tertiary" />
                )}
                <span className="text-text-primary dark:text-cream-200">Dark Mode</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  state.darkMode ? 'bg-sanctuary-600' : 'bg-cream-300 dark:bg-night-100'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    state.darkMode ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </Card>
        </div>

        {/* Notifications & Haptics */}
        <div className="mb-6">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-3">
            Experience
          </p>
          <Card className="divide-y divide-cream-300 dark:divide-night-50">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-text-tertiary dark:text-text-tertiary" />
                <span className="text-text-primary dark:text-cream-200">Notifications</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_NOTIFICATIONS' })}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  state.notifications ? 'bg-sanctuary-600' : 'bg-cream-300 dark:bg-night-100'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    state.notifications ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Vibrate className="w-5 h-5 text-text-tertiary dark:text-text-tertiary" />
                <span className="text-text-primary dark:text-cream-200">Haptic Feedback</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_HAPTIC' })}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  state.hapticFeedback ? 'bg-sanctuary-600' : 'bg-cream-300 dark:bg-night-100'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    state.hapticFeedback ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </Card>
        </div>

        {/* Data */}
        <div className="mb-6">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-3">
            Data & Privacy
          </p>
          <Card className="divide-y divide-cream-300 dark:divide-night-50">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-5 h-5 text-text-tertiary dark:text-text-tertiary" />
                <span className="text-text-primary dark:text-cream-200">Your Data</span>
              </div>
              <p className="text-sm text-text-tertiary dark:text-text-tertiary ml-8">
                All your saved content and journal entries are stored locally on your device. We
                don't collect or store any personal data.
              </p>
            </div>
            <button
              onClick={handleClearData}
              className="p-4 flex items-center gap-3 w-full text-left active:bg-cream-200 dark:active:bg-night-100 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-rose-500" />
              <span className="text-rose-600 dark:text-rose-400">Clear All Data</span>
            </button>
          </Card>
        </div>

        {/* Resources */}
        <div className="mb-6">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-3">
            Resources
          </p>
          <Card className="divide-y divide-cream-300 dark:divide-night-50">
            <a
              href="https://seekersguidance.org"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 flex items-center justify-between active:bg-cream-200 dark:active:bg-night-100 transition-colors"
            >
              <span className="text-text-primary dark:text-cream-200">SeekersGuidance</span>
              <ExternalLink className="w-4 h-4 text-text-tertiary" />
            </a>
            <a
              href="https://rabata.org"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 flex items-center justify-between active:bg-cream-200 dark:active:bg-night-100 transition-colors"
            >
              <span className="text-text-primary dark:text-cream-200">Rabata</span>
              <ExternalLink className="w-4 h-4 text-text-tertiary" />
            </a>
            <a
              href="https://yaqeeninstitute.org"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 flex items-center justify-between active:bg-cream-200 dark:active:bg-night-100 transition-colors"
            >
              <span className="text-text-primary dark:text-cream-200">Yaqeen Institute</span>
              <ExternalLink className="w-4 h-4 text-text-tertiary" />
            </a>
          </Card>
        </div>

        {/* About */}
        <Card className="p-5 text-center">
          <div className="w-12 h-12 mx-auto bg-sanctuary-50 dark:bg-sanctuary-900/50 rounded-full flex items-center justify-center mb-3">
            <Heart className="w-6 h-6 text-sanctuary-600 dark:text-sanctuary-400" />
          </div>
          <h3 className="font-medium text-text-primary dark:text-cream-200 mb-1">Asma</h3>
          <p className="text-sm text-text-tertiary mb-3">Version 2.0.0</p>
          <p className="text-xs text-text-tertiary dark:text-text-tertiary leading-relaxed">
            Built with love for Muslim women seeking understanding, clarity, and connection with
            their faith.
          </p>
        </Card>
      </div>
    </div>
  );
}
