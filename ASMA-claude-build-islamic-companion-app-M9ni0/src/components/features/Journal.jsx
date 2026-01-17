import React, { useState } from 'react';
import { ChevronLeft, Plus, Trash2, BookOpen, X } from 'lucide-react';
import { Card, Button, Input, Modal } from '../ui';
import { useApp } from '../../context/AppContext';

const prompts = [
  'What am I grateful for today?',
  'A moment I felt close to Allah...',
  'Something I learned about my faith...',
  'A dua I want to make...',
  'How I grew closer to Allah this week...',
  'A struggle I want to release...',
];

export function Journal({ onBack }) {
  const { state, dispatch } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [content, setContent] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');

  const handleSave = () => {
    if (!content.trim()) return;
    dispatch({
      type: 'ADD_JOURNAL_ENTRY',
      payload: {
        content: content.trim(),
        prompt: selectedPrompt || null,
      },
    });
    setContent('');
    setSelectedPrompt('');
    setShowNew(false);
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_JOURNAL_ENTRY', payload: id });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24">
      {/* New Entry Modal */}
      <Modal
        isOpen={showNew}
        onClose={() => {
          setShowNew(false);
          setContent('');
          setSelectedPrompt('');
        }}
        title="New Reflection"
        subtitle="What's on your heart?"
        icon={BookOpen}
      >
        <div className="p-5">
          {/* Prompts */}
          <div className="mb-4">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
              Or start with a prompt
            </p>
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPrompt(prompt)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                    selectedPrompt === prompt
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Prompt Display */}
          {selectedPrompt && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl mb-4">
              <p className="text-sm text-emerald-700 dark:text-emerald-300 italic">
                {selectedPrompt}
              </p>
            </div>
          )}

          {/* Text Area */}
          <Input
            multiline
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts..."
          />

          <Button onClick={handleSave} className="w-full mt-4" disabled={!content.trim()}>
            Save Reflection
          </Button>
        </div>
      </Modal>

      {/* Header */}
      <div className="p-5 pt-12 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-400 active:text-neutral-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
        </div>

        <Card className="p-5 mb-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-violet-50 dark:bg-violet-900/50 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-neutral-800 dark:text-neutral-100">
                Reflection Journal
              </h1>
              <p className="text-sm text-neutral-400">Your private space</p>
            </div>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
            Record your thoughts, gratitude, and spiritual reflections. Everything stays on your
            device.
          </p>
        </Card>

        {/* New Entry Button */}
        <Button onClick={() => setShowNew(true)} className="w-full mb-6" icon={Plus}>
          New Reflection
        </Button>

        {/* Entries List */}
        {state.journal.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-500 dark:text-neutral-400">No reflections yet.</p>
            <p className="text-neutral-400 dark:text-neutral-500 text-sm mt-1">
              Start writing to see your entries here.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {state.journal.map((entry) => (
              <Card key={entry.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs text-neutral-400">{formatDate(entry.date)}</p>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1 text-neutral-300 dark:text-neutral-600 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {entry.prompt && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 italic mb-2">
                    {entry.prompt}
                  </p>
                )}
                <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
                  {entry.content}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
