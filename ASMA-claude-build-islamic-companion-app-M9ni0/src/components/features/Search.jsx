import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, X, BookOpen, Heart, Book, Users } from 'lucide-react';
import { Card, Input } from '../ui';
import { hadithDatabase, quranicVerses, duasDatabase, sahabiyatDatabase } from '../../data';

export function Search({ onSelectHadith, onSelectVerse, onSelectDua, onSelectStory, onClose }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return { hadith: [], verses: [], duas: [], stories: [] };

    const q = query.toLowerCase();

    return {
      hadith: hadithDatabase.filter(
        (h) =>
          h.text.toLowerCase().includes(q) ||
          h.topic.toLowerCase().includes(q) ||
          h.source.toLowerCase().includes(q) ||
          h.doesMean.toLowerCase().includes(q)
      ),
      verses: quranicVerses.filter(
        (v) =>
          v.translation.toLowerCase().includes(q) ||
          v.theme.toLowerCase().includes(q) ||
          v.reference.toLowerCase().includes(q) ||
          v.tafsir.toLowerCase().includes(q)
      ),
      duas: duasDatabase.filter(
        (d) =>
          d.translation.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.benefit.toLowerCase().includes(q)
      ),
      stories: sahabiyatDatabase.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.story.toLowerCase().includes(q)
      ),
    };
  }, [query]);

  const totalResults =
    results.hadith.length +
    results.verses.length +
    results.duas.length +
    results.stories.length;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24">
      <div className="p-5 pt-12 max-w-lg mx-auto">
        {/* Search Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hadith, verses, duas..."
              className="pl-12"
              autoFocus
            />
          </div>
          <button
            onClick={onClose}
            className="p-3 text-neutral-400 active:text-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        {query.trim() && (
          <div>
            <p className="text-sm text-neutral-400 mb-4">
              {totalResults} result{totalResults !== 1 ? 's' : ''} found
            </p>

            {/* Hadith Results */}
            {results.hadith.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    Hadith ({results.hadith.length})
                  </p>
                </div>
                <div className="space-y-2">
                  {results.hadith.slice(0, 5).map((h) => (
                    <Card
                      key={h.id}
                      className="p-4"
                      onClick={() => onSelectHadith(h)}
                    >
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
                        "{h.text}"
                      </p>
                      <p className="text-xs text-neutral-400 mt-2">{h.source}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Verse Results */}
            {results.verses.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Book className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    Quranic Verses ({results.verses.length})
                  </p>
                </div>
                <div className="space-y-2">
                  {results.verses.slice(0, 5).map((v) => (
                    <Card
                      key={v.id}
                      className="p-4"
                      onClick={() => onSelectVerse(v)}
                    >
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
                        "{v.translation}"
                      </p>
                      <p className="text-xs text-neutral-400 mt-2">{v.reference}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Dua Results */}
            {results.duas.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    Duas ({results.duas.length})
                  </p>
                </div>
                <div className="space-y-2">
                  {results.duas.slice(0, 5).map((d) => (
                    <Card
                      key={d.id}
                      className="p-4"
                      onClick={() => onSelectDua(d)}
                    >
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
                        "{d.translation}"
                      </p>
                      <p className="text-xs text-neutral-400 mt-2">{d.source}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Story Results */}
            {results.stories.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    Sahabiyat ({results.stories.length})
                  </p>
                </div>
                <div className="space-y-2">
                  {results.stories.slice(0, 5).map((s) => (
                    <Card
                      key={s.id}
                      className="p-4"
                      onClick={() => onSelectStory(s)}
                    >
                      <p className="font-medium text-neutral-700 dark:text-neutral-200 text-sm">
                        {s.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {s.title}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {totalResults === 0 && (
              <Card className="p-8 text-center">
                <SearchIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-500 dark:text-neutral-400">No results found.</p>
                <p className="text-neutral-400 dark:text-neutral-500 text-sm mt-1">
                  Try different keywords.
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Empty State */}
        {!query.trim() && (
          <Card className="p-8 text-center">
            <SearchIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-500 dark:text-neutral-400">Search across all content</p>
            <p className="text-neutral-400 dark:text-neutral-500 text-sm mt-1">
              Hadith, Quranic verses, duas, and more
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
