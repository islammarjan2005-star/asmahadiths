import React, { useRef } from 'react';
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
  Type,
  Download,
  Upload,
  FileText,
  Baby,
} from 'lucide-react';
import { Card } from '../ui';
import { useApp } from '../../context/AppContext';

const fontSizes = [
  { value: 'small', label: 'Small', preview: 'Aa' },
  { value: 'medium', label: 'Medium', preview: 'Aa' },
  { value: 'large', label: 'Large', preview: 'Aa' },
  { value: 'xlarge', label: 'X-Large', preview: 'Aa' },
];

export function Settings({ onBack }) {
  const { state, dispatch } = useApp();
  const fileInputRef = useRef(null);

  const handleClearData = () => {
    if (window.confirm('This will clear all your saved content and journal entries. Continue?')) {
      localStorage.removeItem('asma-app-state');
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asma-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJournal = () => {
    const entries = state.journal || [];
    if (entries.length === 0) return;
    const markdown = entries.map(e => {
      const date = new Date(e.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      return `## ${date}\n\n${e.prompt ? `> ${e.prompt}\n\n` : ''}${e.content}\n`;
    }).join('\n---\n\n');
    const blob = new Blob([`# My ASMA Journal\n\n${markdown}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asma-journal-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (window.confirm('This will replace your current data with the backup. Continue?')) {
          dispatch({ type: 'LOAD_STATE', payload: imported });
        }
      } catch {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
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

            {/* Font Size */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Type className="w-5 h-5 text-text-tertiary" />
                <span className="text-text-primary dark:text-cream-200">Text Size</span>
              </div>
              <div className="flex gap-2">
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => dispatch({ type: 'SET_FONT_SIZE', payload: size.value })}
                    className={`flex-1 py-2 rounded-lg text-center transition-colors ${
                      (state.fontSize || 'medium') === size.value
                        ? 'bg-sanctuary-600 text-white'
                        : 'bg-cream-200 dark:bg-night-100 text-text-secondary dark:text-cream-300'
                    }`}
                  >
                    <span className={`font-medium ${
                      size.value === 'small' ? 'text-xs' :
                      size.value === 'medium' ? 'text-sm' :
                      size.value === 'large' ? 'text-base' : 'text-lg'
                    }`}>
                      {size.preview}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Experience */}
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
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Baby className="w-5 h-5 text-text-tertiary dark:text-text-tertiary" />
                <div>
                  <span className="text-text-primary dark:text-cream-200">Kids Mode</span>
                  <p className="text-xs text-text-tertiary">Simplified content for children</p>
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_KIDS_MODE' })}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  state.kidsMode ? 'bg-sanctuary-600' : 'bg-cream-300 dark:bg-night-100'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    state.kidsMode ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </Card>
        </div>

        {/* Data & Backup */}
        <div className="mb-6">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-3">
            Data & Backup
          </p>
          <Card className="divide-y divide-cream-300 dark:divide-night-50">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-5 h-5 text-text-tertiary dark:text-text-tertiary" />
                <span className="text-text-primary dark:text-cream-200">Your Data</span>
              </div>
              <p className="text-sm text-text-tertiary dark:text-text-tertiary ml-8">
                All data is stored locally on your device. Nothing is sent to any server.
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="p-4 flex items-center gap-3 w-full text-left active:bg-cream-200 dark:active:bg-night-100 transition-colors"
            >
              <Download className="w-5 h-5 text-sanctuary-500" />
              <div>
                <span className="text-text-primary dark:text-cream-200">Export Backup</span>
                <p className="text-xs text-text-tertiary">Save all data as JSON</p>
              </div>
            </button>
            <button
              onClick={handleExportJournal}
              className="p-4 flex items-center gap-3 w-full text-left active:bg-cream-200 dark:active:bg-night-100 transition-colors"
            >
              <FileText className="w-5 h-5 text-lavender-400" />
              <div>
                <span className="text-text-primary dark:text-cream-200">Export Journal</span>
                <p className="text-xs text-text-tertiary">Download as Markdown</p>
              </div>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-4 flex items-center gap-3 w-full text-left active:bg-cream-200 dark:active:bg-night-100 transition-colors"
            >
              <Upload className="w-5 h-5 text-gold-500" />
              <div>
                <span className="text-text-primary dark:text-cream-200">Import Backup</span>
                <p className="text-xs text-text-tertiary">Restore from JSON file</p>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
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
          <p className="text-sm text-text-tertiary mb-3">Version 3.0.0</p>
          <p className="text-xs text-text-tertiary dark:text-text-tertiary leading-relaxed">
            Built with love for Muslim women seeking understanding, clarity, and connection with
            their faith.
          </p>
        </Card>
      </div>
    </div>
  );
}
