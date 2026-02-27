import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  Search,
  Book,
  Play,
  Pause,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { Card } from '../ui';
import { useApp } from '../../context/AppContext';
import { fetchChapters, fetchVerses, getAudioUrl } from '../../utils/quranApi';

const READING_MODES = ['arabic', 'translation', 'word-by-word'];

export function QuranBrowser({ onBack }) {
  const { state, dispatch } = useApp();
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [versesLoading, setVersesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [readingMode, setReadingMode] = useState('translation');
  const [playingVerse, setPlayingVerse] = useState(null);
  const [audioRef] = useState(() => typeof Audio !== 'undefined' ? new Audio() : null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);
  const [expandedWord, setExpandedWord] = useState(null);

  // Load chapters
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchChapters();
        if (!cancelled) {
          setChapters(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError('Unable to load Quran data. Check your connection.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Load verses for selected chapter
  const loadVerses = useCallback(async (chapterId, pageNum = 1) => {
    try {
      setVersesLoading(true);
      const data = await fetchVerses(chapterId, pageNum);
      if (pageNum === 1) {
        setVerses(data.verses);
      } else {
        setVerses(prev => [...prev, ...data.verses]);
      }
      setHasMore(data.pagination?.current_page < data.pagination?.total_pages);
      setPage(pageNum);
    } catch {
      setError('Unable to load verses.');
    } finally {
      setVersesLoading(false);
    }
  }, []);

  const handleSelectChapter = (chapter) => {
    setSelectedChapter(chapter);
    setVerses([]);
    setPage(1);
    loadVerses(chapter.id, 1);
    dispatch({
      type: 'SET_QURAN_BOOKMARK',
      payload: { surahId: chapter.id, verseId: 1 },
    });
  };

  const handlePlayVerse = (verse) => {
    if (!audioRef) return;
    if (playingVerse === verse.verseKey) {
      audioRef.pause();
      setPlayingVerse(null);
      return;
    }
    const url = getAudioUrl(verse.verseKey);
    audioRef.src = url;
    audioRef.play().catch(() => {});
    setPlayingVerse(verse.verseKey);
    audioRef.onended = () => setPlayingVerse(null);
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.src = '';
      }
    };
  }, [audioRef]);

  const filteredChapters = searchQuery
    ? chapters.filter(
        (c) =>
          c.nameSimple.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.nameTranslated.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.id.toString() === searchQuery
      )
    : chapters;

  const bookmarks = state.quranBookmarks || {};
  const lastRead = bookmarks.lastRead;

  // Surah detail view
  if (selectedChapter) {
    return (
      <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
        <div className="bg-sanctuary-700 dark:bg-sanctuary-900 pt-14 pb-6 px-6">
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => { setSelectedChapter(null); setVerses([]); }}
              className="flex items-center gap-2 text-cream-200/60 mb-4 active:text-cream-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">All Surahs</span>
            </button>
            <div className="text-center">
              <p className="font-arabic text-3xl text-cream-100 mb-1">{selectedChapter.nameArabic}</p>
              <p className="text-cream-200/70 text-sm">
                {selectedChapter.nameSimple} — {selectedChapter.nameTranslated}
              </p>
              <p className="text-cream-200/40 text-xs mt-1">
                {selectedChapter.versesCount} verses · {selectedChapter.revelationType}
              </p>
            </div>

            {/* Reading mode toggle */}
            <div className="flex justify-center mt-4 gap-2">
              {READING_MODES.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setReadingMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    readingMode === mode
                      ? 'bg-gold-400 text-white'
                      : 'bg-cream-100/10 text-cream-200/60'
                  }`}
                >
                  {mode === 'word-by-word' ? 'Word' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 max-w-lg mx-auto mt-4 space-y-3">
          {/* Bismillah (except for Surah 9) */}
          {selectedChapter.id !== 9 && (
            <p className="bismillah-ornament text-2xl py-4">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          )}

          {verses.map((verse) => (
            <Card key={verse.verseKey} className="p-4">
              {/* Verse number & controls */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 bg-sanctuary-50 dark:bg-sanctuary-900/30 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-sanctuary-600 dark:text-sanctuary-400">
                    {verse.verseNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayVerse(verse)}
                    className="w-8 h-8 rounded-full bg-gold-50 dark:bg-gold-900/20 flex items-center justify-center"
                  >
                    {playingVerse === verse.verseKey ? (
                      <Pause className="w-3.5 h-3.5 text-gold-600" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-gold-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Arabic text */}
              {(readingMode === 'arabic' || readingMode === 'translation') && (
                <p className="arabic-verse text-2xl text-text-primary dark:text-cream-200 mb-3">
                  {verse.textUthmani}
                </p>
              )}

              {/* Word-by-word mode */}
              {readingMode === 'word-by-word' && verse.words && (
                <div className="flex flex-wrap gap-2 justify-end mb-3" dir="rtl">
                  {verse.words.map((word, i) => (
                    <button
                      key={i}
                      onClick={() => setExpandedWord(expandedWord === `${verse.verseKey}-${i}` ? null : `${verse.verseKey}-${i}`)}
                      className={`relative px-2 py-1 rounded-lg transition-colors ${
                        expandedWord === `${verse.verseKey}-${i}`
                          ? 'bg-gold-100 dark:bg-gold-900/30'
                          : 'hover:bg-cream-200 dark:hover:bg-night-100'
                      }`}
                    >
                      <p className="font-arabic text-xl text-text-primary dark:text-cream-200">
                        {word.text}
                      </p>
                      {expandedWord === `${verse.verseKey}-${i}` && word.translation && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-sanctuary-700 text-white text-xs rounded-lg whitespace-nowrap z-10 animate-fade-in">
                          {word.translation}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Translation */}
              {(readingMode === 'translation' || readingMode === 'word-by-word') && verse.translation && (
                <p
                  className="text-sm text-text-secondary dark:text-cream-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: verse.translation }}
                />
              )}
            </Card>
          ))}

          {/* Load more */}
          {hasMore && (
            <button
              onClick={() => loadVerses(selectedChapter.id, page + 1)}
              disabled={versesLoading}
              className="w-full py-3 text-center text-sm text-sanctuary-600 dark:text-sanctuary-400 font-medium"
            >
              {versesLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                'Load more verses'
              )}
            </button>
          )}

          {versesLoading && verses.length === 0 && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton h-32 rounded-xl" />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Surah list view
  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
      <div className="bg-sanctuary-700 dark:bg-sanctuary-900 pt-14 pb-6 px-6">
        <div className="max-w-lg mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-cream-200/60 mb-4 active:text-cream-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-6 h-6 text-gold-400" />
            <h1 className="text-2xl font-semibold text-cream-100">Quran</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-200/40" />
            <input
              type="text"
              placeholder="Search surahs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-cream-100/10 rounded-xl text-sm text-cream-100 placeholder-cream-200/40 border-none focus:ring-1 focus:ring-gold-400/30 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto mt-4 space-y-2">
        {/* Continue Reading */}
        {lastRead && (
          <Card
            className="p-4 mb-3 card-interactive"
            variant="gold"
            onClick={() => {
              const ch = chapters.find(c => c.id === lastRead.surahId);
              if (ch) handleSelectChapter(ch);
            }}
          >
            <div className="flex items-center gap-3">
              <BookmarkCheck className="w-5 h-5 text-gold-500" />
              <div>
                <p className="text-xs text-gold-600 dark:text-gold-400 font-medium">Continue Reading</p>
                <p className="text-sm font-semibold text-text-primary dark:text-cream-200">
                  {chapters.find(c => c.id === lastRead.surahId)?.nameSimple || `Surah ${lastRead.surahId}`}
                </p>
              </div>
            </div>
          </Card>
        )}

        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-600/10 rounded-xl text-sm text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
        ) : (
          filteredChapters.map((chapter) => (
            <Card
              key={chapter.id}
              className="p-4 card-interactive"
              onClick={() => handleSelectChapter(chapter)}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-sanctuary-50 dark:bg-sanctuary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-sanctuary-600 dark:text-sanctuary-400">
                    {chapter.id}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary dark:text-cream-200">
                    {chapter.nameSimple}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {chapter.nameTranslated} · {chapter.versesCount} verses
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-arabic text-lg text-text-primary dark:text-cream-200">
                    {chapter.nameArabic}
                  </p>
                  <p className="text-xs text-text-tertiary capitalize">
                    {chapter.revelationType}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
