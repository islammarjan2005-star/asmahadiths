import React, { useState, useMemo } from 'react';
import {
  Search as SearchIcon, Book, Heart, Users, BookOpen, Layers,
  GraduationCap, Baby, Moon, BarChart3, TrendingUp, Feather, Info,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card, Input } from '../ui';
import { hadithDatabase, quranicVerses, duasDatabase, sahabiyatDatabase, topics } from '../../data';

export function Search({
  onSelectHadith, onSelectVerse, onSelectDua, onSelectStory, onClose,
  onSelectTopic, onQuran, onDuas, onSahabiyat, onJourney,
  onNamesOfAllah, onQuranBrowser, onStudyPlans, onKidsMode,
  onAnalytics, onRamadan, onJournal,
}) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return { hadith: [], verses: [], duas: [], stories: [] };
    const q = query.toLowerCase();
    return {
      hadith: hadithDatabase.filter(
        (h) => h.text.toLowerCase().includes(q) || h.topic.toLowerCase().includes(q) || h.source.toLowerCase().includes(q) || h.doesMean.toLowerCase().includes(q)
      ),
      verses: quranicVerses.filter(
        (v) => v.translation.toLowerCase().includes(q) || v.theme.toLowerCase().includes(q) || v.reference.toLowerCase().includes(q) || v.tafsir.toLowerCase().includes(q)
      ),
      duas: duasDatabase.filter(
        (d) => d.translation.toLowerCase().includes(q) || d.category.toLowerCase().includes(q) || d.benefit.toLowerCase().includes(q)
      ),
      stories: sahabiyatDatabase.filter(
        (s) => s.name.toLowerCase().includes(q) || s.title.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q) || s.story.toLowerCase().includes(q)
      ),
    };
  }, [query]);

  const totalResults = results.hadith.length + results.verses.length + results.duas.length + results.stories.length;

  const exploreItems = [
    { icon: Book, label: 'Quran', action: onQuran },
    { icon: Heart, label: 'Duas', action: onDuas },
    { icon: Users, label: 'Sahabiyat', action: onSahabiyat },
    { icon: Layers, label: '99 Names', action: onNamesOfAllah },
    { icon: BookOpen, label: 'Full Quran', action: onQuranBrowser },
    { icon: GraduationCap, label: 'Study Plans', action: onStudyPlans },
    { icon: Baby, label: 'Kids Zone', action: onKidsMode },
    { icon: Moon, label: 'Ramadan', action: onRamadan },
    { icon: BarChart3, label: 'Analytics', action: onAnalytics },
    { icon: TrendingUp, label: 'Journey', action: onJourney },
    { icon: Feather, label: 'Journal', action: onJournal },
  ];

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
      <div className="p-5 pt-12 max-w-lg mx-auto">
        {/* Search Header */}
        <div className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hadith, verses, duas..."
              className="pl-12"
            />
          </div>
        </div>

        {/* Search Results */}
        {query.trim() ? (
          <div>
            <p className="text-caption text-text-tertiary mb-4">
              {totalResults} result{totalResults !== 1 ? 's' : ''}
            </p>

            {results.hadith.length > 0 && (
              <div className="mb-6">
                <p className="text-label text-text-tertiary mb-3">Hadith ({results.hadith.length})</p>
                <div className="space-y-2">
                  {results.hadith.slice(0, 5).map((h) => (
                    <Card key={h.id} variant="subtle" onClick={() => onSelectHadith(h)}>
                      <p className="text-sm text-text-secondary dark:text-cream-300 line-clamp-2">"{h.text}"</p>
                      <p className="text-xs text-text-tertiary mt-2">{h.source}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {results.verses.length > 0 && (
              <div className="mb-6">
                <p className="text-label text-text-tertiary mb-3">Verses ({results.verses.length})</p>
                <div className="space-y-2">
                  {results.verses.slice(0, 5).map((v) => (
                    <Card key={v.id} variant="subtle" onClick={() => onSelectVerse(v)}>
                      <p className="text-sm text-text-secondary dark:text-cream-300 line-clamp-2">"{v.translation}"</p>
                      <p className="text-xs text-text-tertiary mt-2">{v.reference}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {results.duas.length > 0 && (
              <div className="mb-6">
                <p className="text-label text-text-tertiary mb-3">Duas ({results.duas.length})</p>
                <div className="space-y-2">
                  {results.duas.slice(0, 5).map((d) => (
                    <Card key={d.id} variant="subtle" onClick={() => onSelectDua(d)}>
                      <p className="text-sm text-text-secondary dark:text-cream-300 line-clamp-2">"{d.translation}"</p>
                      <p className="text-xs text-text-tertiary mt-2">{d.source}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {results.stories.length > 0 && (
              <div className="mb-6">
                <p className="text-label text-text-tertiary mb-3">Sahabiyat ({results.stories.length})</p>
                <div className="space-y-2">
                  {results.stories.slice(0, 5).map((s) => (
                    <Card key={s.id} variant="subtle" onClick={() => onSelectStory(s)}>
                      <p className="font-medium text-text-primary dark:text-cream-200 text-sm">{s.name}</p>
                      <p className="text-xs text-text-tertiary">{s.title}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {totalResults === 0 && (
              <div className="text-center py-12">
                <SearchIcon className="w-10 h-10 text-cream-400 dark:text-night-50 mx-auto mb-3" />
                <p className="text-text-tertiary text-sm">No results found</p>
              </div>
            )}
          </div>
        ) : (
          /* Explore Hub — shown when not searching */
          <div className="space-y-6">
            <div>
              <p className="text-label text-text-tertiary mb-3">Explore</p>
              <div className="grid grid-cols-3 gap-4">
                {exploreItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Card key={item.label} variant="subtle" className="text-center" onClick={item.action}>
                      <div className="w-10 h-10 bg-sanctuary-50 dark:bg-sanctuary-900/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <ItemIcon className="w-5 h-5 text-sanctuary-500" />
                      </div>
                      <p className="text-caption text-text-primary dark:text-cream-300">{item.label}</p>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-label text-text-tertiary mb-3">Topics</p>
              <div className="space-y-2">
                {topics.map((topic) => {
                  const TopicIcon = Icons[topic.icon] || Icons.Circle;
                  const count = hadithDatabase.filter((h) => h.topic === topic.id).length;
                  return (
                    <Card key={topic.id} variant="subtle" onClick={() => onSelectTopic(topic)}>
                      <div className="flex items-center gap-3">
                        <TopicIcon className="w-5 h-5 text-sanctuary-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary dark:text-cream-200">{topic.name}</p>
                          <p className="text-xs text-text-tertiary truncate">{topic.description}</p>
                        </div>
                        <span className="text-xs text-text-tertiary">{count}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="flex items-start gap-2.5 px-1 py-2">
              <Info className="w-3.5 h-3.5 text-cream-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-text-tertiary leading-relaxed">
                Asma provides educational guidance with Islamic sources. Not a substitute for scholarly advice.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
