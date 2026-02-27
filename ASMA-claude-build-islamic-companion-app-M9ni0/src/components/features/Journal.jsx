import React, { useState } from 'react';
import { Plus, Trash2, BookOpen, X } from 'lucide-react';
import { Card, Button, Input, Modal, ScreenHeader } from '../ui';
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
    <div className="min-h-screen bg-cream-100 dark:bg-night-200 pb-24">
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
            <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">
              Or start with a prompt
            </p>
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPrompt(prompt)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                    selectedPrompt === prompt
                      ? 'bg-sanctuary-50 text-sanctuary-600 dark:bg-sanctuary-900/50 dark:text-sanctuary-300'
                      : 'bg-cream-200 dark:bg-night-100 text-text-secondary dark:text-cream-300'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Prompt Display */}
          {selectedPrompt && (
            <div className="p-3 bg-sanctuary-50 dark:bg-sanctuary-900/30 rounded-xl mb-4">
              <p className="text-sm text-sanctuary-700 dark:text-sanctuary-300 italic">
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
      <ScreenHeader title="Reflection Journal" subtitle="Your private space" onBack={onBack} />
      <div className="px-5 max-w-lg mx-auto">
        <Card className="p-5 mb-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-sanctuary-50 dark:bg-sanctuary-900/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-sanctuary-500" />
            </div>
            <div>
              <p className="text-sm text-text-tertiary">Record your thoughts, gratitude, and spiritual reflections.</p>
            </div>
          </div>
        </Card>

        {/* New Entry Button */}
        <Button onClick={() => setShowNew(true)} className="w-full mb-6" icon={Plus}>
          New Reflection
        </Button>

        {/* Entries List */}
        {state.journal.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-cream-300 dark:text-night-50 mx-auto mb-4" />
            <p className="text-text-tertiary dark:text-text-tertiary">No reflections yet.</p>
            <p className="text-text-tertiary dark:text-text-tertiary text-sm mt-1">
              Start writing to see your entries here.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {state.journal.map((entry) => (
              <Card key={entry.id}>
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs text-text-tertiary">{formatDate(entry.date)}</p>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1 text-cream-300 dark:text-night-50 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {entry.prompt && (
                  <p className="text-xs text-sanctuary-600 dark:text-sanctuary-400 italic mb-2">
                    {entry.prompt}
                  </p>
                )}
                <p className="text-text-secondary dark:text-cream-300 text-sm leading-relaxed whitespace-pre-line">
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
