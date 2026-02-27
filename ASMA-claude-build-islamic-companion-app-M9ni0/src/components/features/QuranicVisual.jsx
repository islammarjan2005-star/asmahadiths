import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Loader2,
  Link2,
  Palette,
  PenLine,
  X,
} from 'lucide-react';
import { Card, ScreenHeader, Badge } from '../ui';
import { useApp } from '../../context/AppContext';
import { quranicVerses, verseCategories } from '../../data';
import { searchQuran, getAudioUrl } from '../../utils/quranApi';
import { generateVerseInsight, analyzeRootWord, findRelatedVerses, generateArtDescription } from '../../utils/quranVisualApi';
import { IslamicArtGenerator } from './IslamicArtGenerator';

// Featured verses for the explorer landing
const FEATURED_IDS = [1, 5, 13, 25, 40, 55, 70];

// Extract a verse-key style reference from our data format (e.g. "Surah Al-Baqarah (2:255)" -> "2:255")
function extractVerseKey(reference) {
  const match = reference.match(/\((\d+:\d+(?:-\d+)?)\)/);
  return match ? match[1] : reference;
}

export function QuranicVisual({ onBack }) {
  const { state, dispatch } = useApp();
  const [view, setView] = useState('explorer'); // explorer, detail, collection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [apiSearchResults, setApiSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [collectionTab, setCollectionTab] = useState('saved'); // saved, notes

  // Verse detail states
  const [insightData, setInsightData] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [relatedVerses, setRelatedVerses] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [artDescription, setArtDescription] = useState(null);
  const [rootWordData, setRootWordData] = useState(null);
  const [rootWordLoading, setRootWordLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [playingAudio, setPlayingAudio] = useState(false);
  const [audioRef] = useState(() => typeof Audio !== 'undefined' ? new Audio() : null);

  const isDark = state.darkMode;

  // Filter curated verses
  const filteredVerses = useMemo(() => {
    let verses = quranicVerses;
    if (activeCategory) {
      verses = verses.filter(v => v.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      verses = verses.filter(v =>
        v.translation.toLowerCase().includes(q) ||
        v.theme.toLowerCase().includes(q) ||
        v.reference.toLowerCase().includes(q) ||
        v.arabic.includes(searchQuery)
      );
    }
    return verses;
  }, [activeCategory, searchQuery]);

  const featuredVerses = useMemo(() =>
    quranicVerses.filter(v => FEATURED_IDS.includes(v.id)),
  []);

  // API search (debounced)
  useEffect(() => {
    if (searchQuery.length < 3) {
      setApiSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchQuran(searchQuery);
        setApiSearchResults(results.slice(0, 10));
      } catch {
        setApiSearchResults([]);
      }
      setSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Select a verse for detail view
  const handleSelectVerse = useCallback((verse) => {
    setSelectedVerse(verse);
    setView('detail');
    setShowInsight(false);
    setInsightData(null);
    setRelatedVerses([]);
    setArtDescription(null);
    setRootWordData(null);
    setSelectedWord(null);
    // Load existing note
    const ref = extractVerseKey(verse.reference);
    setNoteText(state.visualNotes?.[ref] || '');
    // Load art description
    loadArtDescription(verse);
  }, [state.visualNotes]);

  const loadArtDescription = async (verse) => {
    const result = await generateArtDescription(verse.translation, verse.reference);
    setArtDescription(result.description);
  };

  // Load AI insight
  const loadInsight = async () => {
    if (insightData || insightLoading || !selectedVerse) return;
    setInsightLoading(true);
    const result = await generateVerseInsight(
      selectedVerse.arabic,
      selectedVerse.translation,
      selectedVerse.reference,
    );
    setInsightData(result);
    setInsightLoading(false);
  };

  // Load related verses
  const loadRelated = async () => {
    if (relatedVerses.length > 0 || relatedLoading || !selectedVerse) return;
    setRelatedLoading(true);
    const result = await findRelatedVerses(
      selectedVerse.arabic,
      selectedVerse.translation,
      selectedVerse.reference,
    );
    setRelatedVerses(result);
    setRelatedLoading(false);
  };

  // Handle Arabic word tap
  const handleWordTap = async (word) => {
    if (selectedWord === word) {
      setSelectedWord(null);
      setRootWordData(null);
      return;
    }
    setSelectedWord(word);
    setRootWordLoading(true);
    const result = await analyzeRootWord(word, selectedVerse.reference);
    setRootWordData(result);
    setRootWordLoading(false);
  };

  // Audio
  const toggleAudio = () => {
    if (!audioRef || !selectedVerse) return;
    if (playingAudio) {
      audioRef.pause();
      setPlayingAudio(false);
      return;
    }
    const key = extractVerseKey(selectedVerse.reference);
    const url = getAudioUrl(key);
    audioRef.src = url;
    audioRef.play().catch(() => {});
    setPlayingAudio(true);
    audioRef.onended = () => setPlayingAudio(false);
  };

  useEffect(() => {
    return () => {
      if (audioRef) { audioRef.pause(); audioRef.src = ''; }
    };
  }, [audioRef]);

  // Save note
  const saveNote = () => {
    if (!selectedVerse) return;
    const ref = extractVerseKey(selectedVerse.reference);
    dispatch({ type: 'SET_VISUAL_NOTE', payload: { reference: ref, note: noteText } });
  };

  // Toggle saved
  const toggleSaved = () => {
    if (!selectedVerse) return;
    const ref = extractVerseKey(selectedVerse.reference);
    dispatch({ type: 'TOGGLE_SAVED_VISUAL', payload: ref });
  };

  const isSaved = selectedVerse
    ? (state.savedVisuals || []).some(v => v.reference === extractVerseKey(selectedVerse.reference))
    : false;

  // Expand insight when toggled
  useEffect(() => {
    if (showInsight) {
      loadInsight();
      loadRelated();
    }
  }, [showInsight]);

  // =========================================
  // EXPLORER VIEW
  // =========================================
  const renderExplorer = () => (
    <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
      <ScreenHeader
        title="Quran Visual"
        subtitle="Explore verses through art & insight"
        onBack={onBack}
      />

      <div className="px-5 max-w-lg mx-auto">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search by theme, surah, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cream-200 dark:bg-night-200 rounded-xl text-sm text-text-primary dark:text-cream-200 placeholder-text-tertiary border-none focus:ring-1 focus:ring-sanctuary-500/30 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory(null); }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-text-tertiary" />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              !activeCategory
                ? 'bg-sanctuary-600 text-white'
                : 'bg-cream-200 dark:bg-night-100 text-text-tertiary'
            }`}
          >
            All
          </button>
          {verseCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-sanctuary-600 text-white'
                  : 'bg-cream-200 dark:bg-night-100 text-text-tertiary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Collection link */}
        {(state.savedVisuals?.length > 0 || Object.keys(state.visualNotes || {}).length > 0) && !searchQuery && (
          <button
            onClick={() => setView('collection')}
            className="w-full mb-5"
          >
            <Card variant="subtle">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-sanctuary-500" />
                  <span className="text-sm font-medium text-text-primary dark:text-cream-200">My Collection</span>
                </div>
                <div className="flex items-center gap-1 text-text-tertiary">
                  <span className="text-xs">{state.savedVisuals?.length || 0} saved</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          </button>
        )}

        {/* Featured (only when no search/category) */}
        {!searchQuery && !activeCategory && (
          <div className="mb-6">
            <p className="text-label text-text-tertiary mb-3">Featured Verses</p>
            <div className="space-y-3">
              {featuredVerses.map(verse => (
                <Card key={verse.id} onClick={() => handleSelectVerse(verse)}>
                  <div className="flex gap-3">
                    <div className="w-16 h-16 flex-shrink-0">
                      <IslamicArtGenerator
                        seed={extractVerseKey(verse.reference)}
                        size={120}
                        dark={isDark}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-arabic text-base text-text-primary dark:text-cream-200 leading-relaxed line-clamp-1 text-right" dir="rtl">
                        {verse.arabic}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1 line-clamp-1">{verse.translation}</p>
                      <p className="text-xs text-sanctuary-600 dark:text-sanctuary-400 mt-1">{verse.reference}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Verse results */}
        {(searchQuery || activeCategory) && (
          <div className="mb-6">
            <p className="text-label text-text-tertiary mb-3">
              {filteredVerses.length} verse{filteredVerses.length !== 1 ? 's' : ''} found
            </p>
            <div className="space-y-2">
              {filteredVerses.map(verse => (
                <Card key={verse.id} onClick={() => handleSelectVerse(verse)}>
                  <p className="font-arabic text-base text-text-primary dark:text-cream-200 leading-relaxed text-right mb-1" dir="rtl">
                    {verse.arabic.slice(0, 80)}{verse.arabic.length > 80 ? '...' : ''}
                  </p>
                  <p className="text-xs text-text-tertiary line-clamp-2">{verse.translation}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-sanctuary-600 dark:text-sanctuary-400">{verse.reference}</p>
                    <Badge>{verse.theme}</Badge>
                  </div>
                </Card>
              ))}
              {filteredVerses.length === 0 && !searching && (
                <p className="text-center text-text-tertiary text-sm py-8">No matching verses found</p>
              )}
            </div>
          </div>
        )}

        {/* API Search Results */}
        {searching && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-sanctuary-500" />
          </div>
        )}
        {apiSearchResults.length > 0 && searchQuery && (
          <div className="mb-6">
            <p className="text-label text-text-tertiary mb-3">From Full Quran</p>
            <div className="space-y-2">
              {apiSearchResults.map((result, i) => (
                <Card key={i} variant="subtle" onClick={() => {
                  // Create a verse-like object from API result
                  handleSelectVerse({
                    id: `api-${i}`,
                    arabic: result.text || '',
                    translation: result.translations?.[0]?.text || '',
                    reference: `Quran (${result.verse_key || ''})`,
                    theme: '',
                    tafsir: '',
                    reflection: '',
                    category: '',
                  });
                }}>
                  <p className="text-xs text-sanctuary-600 dark:text-sanctuary-400 mb-1">{result.verse_key}</p>
                  <p className="text-xs text-text-secondary dark:text-cream-300 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: result.translations?.[0]?.text || result.text || '' }}
                  />
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Browse all (no search/category) */}
        {!searchQuery && !activeCategory && (
          <div>
            <p className="text-label text-text-tertiary mb-3">All Verses</p>
            <div className="space-y-2">
              {quranicVerses.slice(0, 20).map(verse => (
                <Card key={verse.id} variant="subtle" onClick={() => handleSelectVerse(verse)}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary dark:text-cream-200">{verse.theme}</p>
                      <p className="text-xs text-text-tertiary">{verse.reference}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-cream-400" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // =========================================
  // VERSE DETAIL VIEW
  // =========================================
  const renderDetail = () => {
    if (!selectedVerse) return null;
    const verseKey = extractVerseKey(selectedVerse.reference);
    const arabicWords = selectedVerse.arabic.split(/\s+/).filter(Boolean);

    return (
      <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
        <ScreenHeader
          title={selectedVerse.reference}
          subtitle={selectedVerse.theme || undefined}
          onBack={() => { setView('explorer'); setSelectedVerse(null); }}
        />

        <div className="px-5 max-w-lg mx-auto space-y-4">
          {/* Arabic text — tappable words */}
          <Card>
            <div className="flex flex-wrap gap-1.5 justify-end" dir="rtl">
              {arabicWords.map((word, i) => (
                <button
                  key={i}
                  onClick={() => handleWordTap(word)}
                  className={`px-1.5 py-0.5 rounded-lg transition-colors font-arabic text-xl leading-loose ${
                    selectedWord === word
                      ? 'bg-sanctuary-100 dark:bg-sanctuary-900/30'
                      : 'active:bg-cream-200 dark:active:bg-night-100'
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>

            {/* Root word tooltip */}
            {selectedWord && (
              <div className="mt-3 pt-3 border-t border-cream-300 dark:border-night-50 animate-fade-in">
                {rootWordLoading ? (
                  <div className="flex items-center gap-2 text-text-tertiary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs">Analyzing root word...</span>
                  </div>
                ) : rootWordData?.root ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-arabic text-lg text-sanctuary-600 dark:text-sanctuary-400">{rootWordData.root}</span>
                      <span className="text-xs text-text-tertiary">— {rootWordData.meaning}</span>
                    </div>
                    {rootWordData.relatedWords?.length > 0 && (
                      <div className="space-y-1">
                        {rootWordData.relatedWords.slice(0, 4).map((rw, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className="font-arabic text-sm text-text-primary dark:text-cream-200">{rw.word}</span>
                            <span className="text-text-tertiary">{rw.meaning}</span>
                            <span className="text-text-tertiary opacity-50">{rw.reference}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-text-tertiary">Tap a word to explore its root meaning</p>
                )}
              </div>
            )}
          </Card>

          {/* Translation */}
          <Card variant="subtle">
            <p className="text-sm text-text-secondary dark:text-cream-300 leading-relaxed italic">
              "{selectedVerse.translation}"
            </p>
          </Card>

          {/* Actions row */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cream-200 dark:bg-night-100 text-text-secondary dark:text-cream-300 text-xs font-medium transition-colors active:bg-cream-300"
            >
              {playingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {playingAudio ? 'Pause' : 'Listen'}
            </button>
            <button
              onClick={toggleSaved}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cream-200 dark:bg-night-100 text-text-secondary dark:text-cream-300 text-xs font-medium transition-colors active:bg-cream-300"
            >
              {isSaved
                ? <BookmarkCheck className="w-3.5 h-3.5 text-sanctuary-500" />
                : <Bookmark className="w-3.5 h-3.5" />
              }
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>

          {/* Islamic Art */}
          <Card padding={false}>
            <IslamicArtGenerator
              seed={verseKey}
              size={400}
              dark={isDark}
            />
            {artDescription && (
              <div className="p-3">
                <p className="text-xs text-text-tertiary italic text-center">{artDescription}</p>
              </div>
            )}
          </Card>

          {/* AI Insight (collapsible) */}
          <Card>
            <button
              onClick={() => setShowInsight(!showInsight)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sanctuary-500" />
                <span className="text-sm font-medium text-text-primary dark:text-cream-200">AI Insight</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-text-tertiary transition-transform ${showInsight ? 'rotate-90' : ''}`} />
            </button>

            {showInsight && (
              <div className="mt-3 pt-3 border-t border-cream-300 dark:border-night-50 animate-fade-in">
                {insightLoading ? (
                  <div className="flex items-center gap-2 text-text-tertiary py-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Generating scholarly insight...</span>
                  </div>
                ) : insightData?.insight ? (
                  <p className="text-sm text-text-secondary dark:text-cream-300 leading-relaxed whitespace-pre-line">
                    {insightData.insight}
                  </p>
                ) : (
                  <div>
                    {/* Fallback to existing tafsir/reflection */}
                    {selectedVerse.tafsir && (
                      <div className="mb-3">
                        <p className="text-xs text-text-tertiary uppercase tracking-wide mb-1 font-medium">Understanding</p>
                        <p className="text-sm text-text-secondary dark:text-cream-300 leading-relaxed">{selectedVerse.tafsir}</p>
                      </div>
                    )}
                    {selectedVerse.reflection && (
                      <div>
                        <p className="text-xs text-text-tertiary uppercase tracking-wide mb-1 font-medium">Reflection</p>
                        <p className="text-sm text-text-secondary dark:text-cream-300 leading-relaxed italic">{selectedVerse.reflection}</p>
                      </div>
                    )}
                    {!selectedVerse.tafsir && !selectedVerse.reflection && (
                      <p className="text-xs text-text-tertiary">Set your Anthropic API key in settings to enable AI insights.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Thematic Threads */}
          {showInsight && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="w-4 h-4 text-sanctuary-500" />
                <p className="text-sm font-medium text-text-primary dark:text-cream-200">Related Verses</p>
              </div>
              {relatedLoading ? (
                <div className="flex items-center gap-2 text-text-tertiary py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Finding connections...</span>
                </div>
              ) : relatedVerses.length > 0 ? (
                <div className="space-y-2">
                  {relatedVerses.map((rv, i) => {
                    // Check if we have this verse in curated data
                    const curatedMatch = quranicVerses.find(v =>
                      v.reference.includes(rv.reference)
                    );
                    return (
                      <Card
                        key={i}
                        variant="subtle"
                        onClick={curatedMatch ? () => handleSelectVerse(curatedMatch) : undefined}
                      >
                        <p className="text-xs text-sanctuary-600 dark:text-sanctuary-400 mb-1">{rv.reference}</p>
                        {rv.arabic && (
                          <p className="font-arabic text-sm text-text-primary dark:text-cream-200 text-right mb-1" dir="rtl">
                            {rv.arabic.slice(0, 60)}...
                          </p>
                        )}
                        <p className="text-xs text-text-tertiary">{rv.connection}</p>
                      </Card>
                    );
                  })}
                </div>
              ) : !relatedLoading && (
                <Card variant="subtle">
                  <p className="text-xs text-text-tertiary text-center">
                    {localStorage.getItem('anthropic_api_key') ? 'No related verses found.' : 'Set your API key for related verse suggestions.'}
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* Personal Reflection */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <PenLine className="w-4 h-4 text-sanctuary-500" />
              <span className="text-sm font-medium text-text-primary dark:text-cream-200">My Reflection</span>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onBlur={saveNote}
              placeholder="Write your personal reflection on this verse..."
              className="w-full p-3 bg-cream-100 dark:bg-night-200 rounded-xl text-sm text-text-primary dark:text-cream-200 placeholder-text-tertiary border-none focus:ring-1 focus:ring-sanctuary-500/30 outline-none resize-none min-h-[80px]"
              rows={3}
            />
          </Card>
        </div>
      </div>
    );
  };

  // =========================================
  // COLLECTION VIEW
  // =========================================
  const renderCollection = () => (
    <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
      <ScreenHeader
        title="My Collection"
        subtitle={`${state.savedVisuals?.length || 0} saved · ${Object.keys(state.visualNotes || {}).filter(k => state.visualNotes[k]).length} notes`}
        onBack={() => setView('explorer')}
      />

      <div className="px-5 max-w-lg mx-auto">
        {/* Tab toggle */}
        <div className="flex gap-2 mb-5 bg-cream-200 dark:bg-night-100 p-1 rounded-xl">
          <button
            onClick={() => setCollectionTab('saved')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              collectionTab === 'saved'
                ? 'bg-sanctuary-600 text-white'
                : 'text-text-tertiary'
            }`}
          >
            Saved
          </button>
          <button
            onClick={() => setCollectionTab('notes')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              collectionTab === 'notes'
                ? 'bg-sanctuary-600 text-white'
                : 'text-text-tertiary'
            }`}
          >
            Notes
          </button>
        </div>

        {collectionTab === 'saved' && (
          <div>
            {(state.savedVisuals || []).length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-8 h-8 text-cream-400 mx-auto mb-2" />
                <p className="text-text-tertiary text-sm">No saved verses yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {state.savedVisuals.map((sv) => {
                  const verse = quranicVerses.find(v =>
                    extractVerseKey(v.reference) === sv.reference
                  );
                  return (
                    <button
                      key={sv.reference}
                      onClick={() => {
                        if (verse) handleSelectVerse(verse);
                      }}
                      className="text-left"
                    >
                      <Card padding={false}>
                        <IslamicArtGenerator
                          seed={sv.reference}
                          size={200}
                          dark={isDark}
                        />
                        <div className="p-2">
                          <p className="text-xs font-medium text-text-primary dark:text-cream-200 truncate">
                            {verse?.theme || sv.reference}
                          </p>
                          <p className="text-xs text-text-tertiary">{sv.reference}</p>
                        </div>
                      </Card>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {collectionTab === 'notes' && (
          <div className="space-y-2">
            {Object.entries(state.visualNotes || {})
              .filter(([, note]) => note)
              .map(([ref, note]) => {
                const verse = quranicVerses.find(v =>
                  extractVerseKey(v.reference) === ref
                );
                return (
                  <Card
                    key={ref}
                    onClick={() => {
                      if (verse) handleSelectVerse(verse);
                    }}
                  >
                    <p className="text-xs text-sanctuary-600 dark:text-sanctuary-400 mb-1">
                      {verse?.reference || ref}
                    </p>
                    <p className="text-sm text-text-secondary dark:text-cream-300 line-clamp-3">
                      {note}
                    </p>
                  </Card>
                );
              })}
            {Object.values(state.visualNotes || {}).filter(Boolean).length === 0 && (
              <div className="text-center py-12">
                <PenLine className="w-8 h-8 text-cream-400 mx-auto mb-2" />
                <p className="text-text-tertiary text-sm">No reflections written yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // =========================================
  // RENDER
  // =========================================
  if (view === 'detail') return renderDetail();
  if (view === 'collection') return renderCollection();
  return renderExplorer();
}
