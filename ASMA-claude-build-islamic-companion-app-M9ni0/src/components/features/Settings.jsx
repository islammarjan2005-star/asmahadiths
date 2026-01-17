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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24">
      <div className="p-5 pt-12 max-w-lg mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 mb-8 active:text-neutral-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-2xl font-medium text-neutral-800 dark:text-neutral-100 mb-6">
          Settings
        </h1>

        {/* Appearance */}
        <div className="mb-6">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3">
            Appearance
          </p>
          <Card className="divide-y divide-neutral-100 dark:divide-neutral-700">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {state.darkMode ? (
                  <Moon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                ) : (
                  <Sun className="w-5 h-5 text-neutral-500" />
                )}
                <span className="text-neutral-700 dark:text-neutral-200">Dark Mode</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  state.darkMode ? 'bg-emerald-600' : 'bg-neutral-200 dark:bg-neutral-600'
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
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3">
            Experience
          </p>
          <Card className="divide-y divide-neutral-100 dark:divide-neutral-700">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                <span className="text-neutral-700 dark:text-neutral-200">Notifications</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_NOTIFICATIONS' })}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  state.notifications ? 'bg-emerald-600' : 'bg-neutral-200 dark:bg-neutral-600'
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
                <Vibrate className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                <span className="text-neutral-700 dark:text-neutral-200">Haptic Feedback</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_HAPTIC' })}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  state.hapticFeedback ? 'bg-emerald-600' : 'bg-neutral-200 dark:bg-neutral-600'
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
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3">
            Data & Privacy
          </p>
          <Card className="divide-y divide-neutral-100 dark:divide-neutral-700">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                <span className="text-neutral-700 dark:text-neutral-200">Your Data</span>
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 ml-8">
                All your saved content and journal entries are stored locally on your device. We
                don't collect or store any personal data.
              </p>
            </div>
            <button
              onClick={handleClearData}
              className="p-4 flex items-center gap-3 w-full text-left active:bg-neutral-50 dark:active:bg-neutral-700/50 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-rose-500" />
              <span className="text-rose-600 dark:text-rose-400">Clear All Data</span>
            </button>
          </Card>
        </div>

        {/* Resources */}
        <div className="mb-6">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3">
            Resources
          </p>
          <Card className="divide-y divide-neutral-100 dark:divide-neutral-700">
            <a
              href="https://seekersguidance.org"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 flex items-center justify-between active:bg-neutral-50 dark:active:bg-neutral-700/50 transition-colors"
            >
              <span className="text-neutral-700 dark:text-neutral-200">SeekersGuidance</span>
              <ExternalLink className="w-4 h-4 text-neutral-400" />
            </a>
            <a
              href="https://rabata.org"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 flex items-center justify-between active:bg-neutral-50 dark:active:bg-neutral-700/50 transition-colors"
            >
              <span className="text-neutral-700 dark:text-neutral-200">Rabata</span>
              <ExternalLink className="w-4 h-4 text-neutral-400" />
            </a>
            <a
              href="https://yaqeeninstitute.org"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 flex items-center justify-between active:bg-neutral-50 dark:active:bg-neutral-700/50 transition-colors"
            >
              <span className="text-neutral-700 dark:text-neutral-200">Yaqeen Institute</span>
              <ExternalLink className="w-4 h-4 text-neutral-400" />
            </a>
          </Card>
        </div>

        {/* About */}
        <Card className="p-5 text-center">
          <div className="w-12 h-12 mx-auto bg-emerald-50 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-3">
            <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-medium text-neutral-800 dark:text-neutral-100 mb-1">Asma</h3>
          <p className="text-sm text-neutral-400 mb-3">Version 1.0.0</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Built with love for Muslim women seeking understanding, clarity, and connection with
            their faith.
          </p>
        </Card>
      </div>
    </div>
  );
}
