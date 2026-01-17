import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Heart,
  Users,
  BookOpen,
  Sparkles,
  Activity,
  Briefcase,
  Home,
  CloudRain,
  Shield,
  RefreshCcw,
  Compass,
  Moon,
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Search,
  X,
  Clock,
  Book,
  MessageCircle,
} from 'lucide-react';
import { Card, Button, Badge } from '../ui';
import { useApp } from '../../context/AppContext';
import { lifeCategories, situationalDuas, findDuasByKeyword, getDuasByCategory } from '../../data';

const iconMap = {
  Heart,
  Users,
  BookOpen,
  Sparkles,
  Activity,
  Briefcase,
  Home,
  CloudRain,
  Shield,
  RefreshCcw,
  Compass,
  Moon,
};

const colorClasses = {
  rose: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
  pink: 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  violet: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  cyan: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
  slate: 'bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400',
  indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  teal: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
};

export function DuaCoach({ onBack }) {
  const { state, dispatch } = useApp();
  const [view, setView] = useState('home'); // home, search, category, detail
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDua, setSelectedDua] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = findDuasByKeyword(query);
      setSearchResults(results);
      setView('search');
    } else if (query.length === 0) {
      setSearchResults([]);
      setView('home');
    }
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setView('category');
  };

  // Handle dua selection
  const handleDuaSelect = (dua) => {
    setSelectedDua(dua);
    setView('detail');

    // Add to journey
    dispatch({
      type: 'ADD_DUA_JOURNEY',
      payload: {
        concern: selectedCategory?.name || 'Search',
        duaId: dua.id,
      },
    });
  };

  // Toggle saved
  const toggleSaved = (duaId) => {
    dispatch({ type: 'TOGGLE_SAVED_COACH_DUA', payload: duaId });
  };

  const isSaved = (duaId) => state.savedCoachDuas?.includes(duaId);

  // Text-to-speech
  const toggleAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else if (selectedDua) {
      const utterance = new SpeechSynthesisUtterance(selectedDua.arabic);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.7;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Get category color
  const getCategoryColor = (categoryId) => {
    const cat = lifeCategories.find((c) => c.id === categoryId);
    return cat ? colorClasses[cat.color] : colorClasses.slate;
  };

  // Render home view
  const renderHome = () => (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="What's on your heart? (e.g., anxious, marriage, exams)"
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-700 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setView('home');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <X className="w-4 h-4 text-neutral-400" />
            </button>
          )}
        </div>
      </div>

      {/* Quick suggestion pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['anxious', 'exam tomorrow', 'looking for spouse', 'feeling sad'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSearch(suggestion)}
            className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-4">
        What do you need a dua for?
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {lifeCategories.map((category) => {
          const Icon = iconMap[category.icon] || Heart;
          return (
            <Card
              key={category.id}
              className="p-4"
              onClick={() => handleCategorySelect(category)}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorClasses[category.color]}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-neutral-700 dark:text-neutral-200 text-sm">
                {category.name}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">{category.description}</p>
            </Card>
          );
        })}
      </div>

      {/* Recent Journey */}
      {state.duaJourney?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-4">
            Your Dua Journey
          </h2>
          <Card className="p-4">
            <div className="space-y-3">
              {state.duaJourney.slice(0, 3).map((entry) => {
                const dua = situationalDuas.find((d) => d.id === entry.duaId);
                if (!dua) return null;
                return (
                  <button
                    key={entry.id}
                    onClick={() => handleDuaSelect(dua)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Book className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate">
                        {dua.title}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">{entry.concern}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </>
  );

  // Render search results
  const renderSearchResults = () => (
    <>
      <button
        onClick={() => {
          setSearchQuery('');
          setSearchResults([]);
          setView('home');
        }}
        className="flex items-center gap-2 text-neutral-400 mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Back to categories</span>
      </button>

      <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-2">
        Duas for "{searchQuery}"
      </h2>
      <p className="text-sm text-neutral-400 mb-6">
        {searchResults.length} matching duas found
      </p>

      {searchResults.length > 0 ? (
        <div className="space-y-3">
          {searchResults.map((dua) => (
            <Card key={dua.id} className="p-4" onClick={() => handleDuaSelect(dua)}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getCategoryColor(dua.category)}`}>
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-700 dark:text-neutral-200 text-sm mb-1">
                    {dua.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                    {dua.translation}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="default">{dua.source}</Badge>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-300 flex-shrink-0" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            No duas found for "{searchQuery}". Try different words like "anxiety", "marriage", or "guidance".
          </p>
        </Card>
      )}
    </>
  );

  // Render category view
  const renderCategoryView = () => {
    const categoryDuas = getDuasByCategory(selectedCategory?.id);
    const Icon = iconMap[selectedCategory?.icon] || Heart;

    return (
      <>
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-neutral-400 mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back to categories</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[selectedCategory?.color]}`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">
              {selectedCategory?.name}
            </h2>
            <p className="text-sm text-neutral-400">{categoryDuas.length} duas available</p>
          </div>
        </div>

        <div className="space-y-3">
          {categoryDuas.map((dua) => (
            <Card key={dua.id} className="p-4" onClick={() => handleDuaSelect(dua)}>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-700 dark:text-neutral-200 text-sm mb-1">
                    {dua.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-2">
                    {dua.translation}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{dua.source}</Badge>
                    {isSaved(dua.id) && (
                      <Badge variant="emerald">Saved</Badge>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-300 flex-shrink-0 mt-1" />
              </div>
            </Card>
          ))}
        </div>
      </>
    );
  };

  // Render dua detail view
  const renderDuaDetail = () => {
    if (!selectedDua) return null;

    const category = lifeCategories.find((c) => c.id === selectedDua.category);
    const Icon = iconMap[category?.icon] || Heart;

    return (
      <>
        <button
          onClick={() => setView(selectedCategory ? 'category' : 'home')}
          className="flex items-center gap-2 text-neutral-400 mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <Card className="p-5 mb-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[category?.color || 'slate']}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-medium text-neutral-800 dark:text-neutral-100">
                  {selectedDua.title}
                </h2>
                <p className="text-xs text-neutral-400">{category?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAudio}
                className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                onClick={() => toggleSaved(selectedDua.id)}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                {isSaved(selectedDua.id) ? (
                  <BookmarkCheck className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Bookmark className="w-5 h-5 text-neutral-400" />
                )}
              </button>
            </div>
          </div>

          {/* Arabic */}
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 mb-4">
            <p
              className="text-xl leading-loose text-neutral-800 dark:text-neutral-100 font-arabic text-center"
              dir="rtl"
            >
              {selectedDua.arabic}
            </p>
          </div>

          {/* Transliteration */}
          <p className="text-sm text-neutral-500 dark:text-neutral-400 italic text-center mb-4">
            {selectedDua.transliteration}
          </p>

          {/* Translation */}
          <div className="border-l-4 border-emerald-500 pl-4 mb-4">
            <p className="text-neutral-700 dark:text-neutral-200 leading-relaxed">
              {selectedDua.translation}
            </p>
          </div>

          {/* Source */}
          <div className="flex items-center gap-2 mb-4">
            <Book className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {selectedDua.source}
            </span>
          </div>
        </Card>

        {/* Context & Background */}
        <Card className="p-5 mb-4">
          <h3 className="font-medium text-neutral-800 dark:text-neutral-100 mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            Context & Background
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {selectedDua.context}
          </p>
        </Card>

        {/* Tafsir / Deep Understanding */}
        <Card className="p-5 mb-4">
          <button
            onClick={() => setShowTafsir(!showTafsir)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="font-medium text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              Deep Understanding
            </h3>
            <ChevronRight
              className={`w-5 h-5 text-neutral-400 transition-transform ${showTafsir ? 'rotate-90' : ''}`}
            />
          </button>
          {showTafsir && (
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mt-3 animate-fade-in">
              {selectedDua.tafsir}
            </p>
          )}
        </Card>

        {/* When & How */}
        <Card className="p-5">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                When to Read
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {selectedDua.whenToRead}
              </p>
            </div>
            <div className="border-t border-neutral-100 dark:border-neutral-700 pt-4">
              <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                <BookOpen className="w-3 h-3" />
                How to Read
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {selectedDua.howToRead}
              </p>
            </div>
          </div>
        </Card>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24">
      <div className="p-5 pt-12 max-w-lg mx-auto">
        {/* Main Header */}
        {view === 'home' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-neutral-400 active:text-neutral-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Back</span>
              </button>
            </div>

            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-medium text-neutral-800 dark:text-neutral-100 mb-2">
                Dua Coach
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Find the perfect dua for what you're going through
              </p>
            </div>
          </>
        )}

        {/* Content */}
        {view === 'home' && renderHome()}
        {view === 'search' && renderSearchResults()}
        {view === 'category' && renderCategoryView()}
        {view === 'detail' && renderDuaDetail()}
      </div>
    </div>
  );
}
