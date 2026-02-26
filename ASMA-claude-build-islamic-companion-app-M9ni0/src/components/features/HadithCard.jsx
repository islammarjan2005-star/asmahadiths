import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  AlertCircle,
  Volume2,
  Share2,
  Pause,
  ChevronDown,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { Card, Badge, Button } from '../ui';
import { useApp } from '../../context/AppContext';

export function HadithCard({ hadith, onExplain }) {
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const { state, dispatch } = useApp();

  const isSaved = state.savedHadith.includes(hadith.id);

  const handleSave = () => {
    dispatch({ type: 'TOGGLE_SAVED_HADITH', payload: hadith.id });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Hadith from Asma',
        text: `"${hadith.text}"\n\n— ${hadith.source}`,
      });
    } catch (err) {
      // Share API not available, copy to clipboard
      navigator.clipboard.writeText(`"${hadith.text}"\n\n— ${hadith.source}`);
    }
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Badge
            variant={hadith.authenticity === 'Sahih' ? 'emerald' : 'amber'}
            icon={CheckCircle}
          >
            {hadith.authenticity}
          </Badge>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPlaying(!playing)}
              className={`p-2 rounded-lg transition-colors ${
                playing
                  ? 'bg-sanctuary-50 dark:bg-sanctuary-900/50 text-sanctuary-600 dark:text-sanctuary-400'
                  : 'text-text-tertiary active:bg-cream-200 dark:active:bg-night-100'
              }`}
            >
              {playing ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg transition-colors ${
                isSaved
                  ? 'bg-sanctuary-50 dark:bg-sanctuary-900/50 text-sanctuary-600 dark:text-sanctuary-400'
                  : 'text-text-tertiary active:bg-cream-200 dark:active:bg-night-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-text-tertiary active:bg-cream-200 dark:active:bg-night-100 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Arabic text */}
        <div className="mb-4 py-4 border-y border-cream-300 dark:border-night-50">
          <p
            className="text-xl text-text-primary dark:text-cream-200 leading-loose text-right font-arabic"
            dir="rtl"
          >
            {hadith.arabic}
          </p>
        </div>

        {/* Translation */}
        <p className="text-text-secondary dark:text-cream-300 leading-relaxed mb-4 italic">
          "{hadith.text}"
        </p>

        {/* Source */}
        <div className="flex items-center gap-2 text-sm text-text-tertiary dark:text-text-tertiary">
          <BookOpen className="w-4 h-4" />
          <span>{hadith.source}</span>
          <span>·</span>
          <span>{hadith.narrator}</span>
        </div>
      </div>

      {/* Expandable section */}
      <div className="border-t border-cream-300 dark:border-night-50">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-5 py-3 flex items-center justify-between text-text-tertiary dark:text-text-tertiary active:bg-cream-200 dark:active:bg-night-100 transition-colors"
        >
          <span className="text-sm font-medium">Context & Understanding</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expanded && (
          <div className="px-5 pb-5 space-y-4 animate-fade-in">
            {/* Historical Context */}
            <div className="p-4 bg-cream-200 dark:bg-night-300 rounded-xl">
              <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">
                Historical Context
              </p>
              <p className="text-text-secondary dark:text-cream-300 text-sm leading-relaxed">
                {hadith.context}
              </p>
            </div>

            {/* What This Means */}
            <div className="p-4 bg-sanctuary-50 dark:bg-sanctuary-900/30 rounded-xl">
              <p className="text-xs font-medium text-sanctuary-700 dark:text-sanctuary-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> What This Means
              </p>
              <p className="text-text-secondary dark:text-cream-300 text-sm leading-relaxed">
                {hadith.doesMean}
              </p>
            </div>

            {/* What This Does Not Mean */}
            <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> What This Does Not Mean
              </p>
              <p className="text-text-secondary dark:text-cream-300 text-sm leading-relaxed">
                {hadith.doesNotMean}
              </p>
            </div>

            {/* Scholarly Perspective */}
            <div className="p-4 bg-lavender-50 dark:bg-lavender-900/30 rounded-xl">
              <p className="text-xs font-medium text-lavender-700 dark:text-lavender-400 uppercase tracking-wide mb-2">
                Scholarly Perspective
              </p>
              <p className="text-text-secondary dark:text-cream-300 text-sm leading-relaxed">
                {hadith.scholarly}
              </p>
            </div>

            {/* Explain Button */}
            <Button
              onClick={() => onExplain(hadith)}
              className="w-full"
              icon={Sparkles}
            >
              Explain Gently
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
