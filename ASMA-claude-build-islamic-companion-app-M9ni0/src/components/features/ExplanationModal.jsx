import React, { useState, useEffect } from 'react';
import { Sparkles, Info } from 'lucide-react';
import { Modal } from '../ui';
import { callClaude, fallbackExplanations, genericFallback } from '../../utils/api';

export function ExplanationModal({ hadith, onClose }) {
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    const fetchExplanation = async () => {
      try {
        const prompt = `Please explain this hadith to a Muslim woman seeking understanding:

Arabic: ${hadith.arabic}
Translation: "${hadith.text}"
Source: ${hadith.source}
Narrator: ${hadith.narrator}

Provide a warm, accessible explanation that:
1. Gives brief historical context
2. Explains what this means for her life today
3. Clarifies any common misunderstandings
4. Connects to her lived experience as a woman

Keep it conversational and supportive, like an older sister explaining over tea.`;

        const response = await callClaude([{ role: 'user', content: prompt }]);
        setExplanation(response);
      } catch (err) {
        console.error('Explanation error:', err);
        // Use fallback explanation
        setExplanation(
          fallbackExplanations[hadith.id] || genericFallback
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [hadith]);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Gentle Explanation"
      subtitle="Powered by AI with Islamic sources"
      icon={Sparkles}
    >
      <div className="p-5">
        {loading ? (
          <div className="flex flex-col items-center py-8">
            <div className="w-10 h-10 border-2 border-neutral-200 dark:border-neutral-600 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin mb-4" />
            <p className="text-neutral-400 dark:text-neutral-500 text-sm">
              Preparing a thoughtful response...
            </p>
          </div>
        ) : (
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
            {explanation}
          </p>
        )}
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-900/30 border-t border-amber-100 dark:border-amber-800">
        <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          This is educational context, not a fatwa. For personal rulings, consult a qualified
          scholar.
        </p>
      </div>
    </Modal>
  );
}
