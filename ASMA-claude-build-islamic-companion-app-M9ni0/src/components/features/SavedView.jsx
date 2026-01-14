import React, { useState } from 'react';
import { ChevronLeft, Bookmark, BookOpen, Heart, Book } from 'lucide-react';
import { Card, Badge } from '../ui';
import { useApp } from '../../context/AppContext';
import { hadithDatabase, quranicVerses, duasDatabase } from '../../data';

export function SavedView({ onBack, onSelectHadith }) {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('hadith');

  const savedHadithItems = hadithDatabase.filter((h) => state.savedHadith.includes(h.id));
  const savedVerseItems = quranicVerses.filter((v) => state.savedVerses.includes(v.id));
  const savedDuaItems = duasDatabase.filter((d) => state.savedDuas.includes(d.id));

  const tabs = [
    { id: 'hadith', name: 'Hadith', count: savedHadithItems.length, icon: BookOpen },
    { id: 'verses', name: 'Verses', count: savedVerseItems.length, icon: Book },
    { id: 'duas', name: 'Duas', count: savedDuaItems.length, icon: Heart },
  ];

  const totalSaved =
    savedHadithItems.length + savedVerseItems.length + savedDuaItems.length;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24">
      <div className="p-5 pt-12 max-w-lg mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 mb-6 active:text-neutral-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <Card className="p-5 mb-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/50 rounded-xl flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-neutral-800 dark:text-neutral-100">
                Saved
              </h1>
              <p className="text-sm text-neutral-400">{totalSaved} items saved</p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-neutral-800 dark:bg-emerald-600 text-white'
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.count}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'hadith' && (
          <div className="space-y-3">
            {savedHadithItems.length === 0 ? (
              <Card className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-500 dark:text-neutral-400">No saved hadith yet.</p>
              </Card>
            ) : (
              savedHadithItems.map((h) => (
                <Card key={h.id} className="p-4" onClick={() => onSelectHadith(h)}>
                  <Badge
                    variant={h.authenticity === 'Sahih' ? 'emerald' : 'amber'}
                    className="mb-2"
                  >
                    {h.authenticity}
                  </Badge>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 italic">
                    "{h.text}"
                  </p>
                  <p className="text-xs text-neutral-400 mt-2">{h.source}</p>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'verses' && (
          <div className="space-y-3">
            {savedVerseItems.length === 0 ? (
              <Card className="p-8 text-center">
                <Book className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-500 dark:text-neutral-400">No saved verses yet.</p>
              </Card>
            ) : (
              savedVerseItems.map((v) => (
                <Card key={v.id} className="p-4">
                  <Badge variant="rose" className="mb-2">
                    {v.theme}
                  </Badge>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 italic">
                    "{v.translation}"
                  </p>
                  <p className="text-xs text-neutral-400 mt-2">{v.reference}</p>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'duas' && (
          <div className="space-y-3">
            {savedDuaItems.length === 0 ? (
              <Card className="p-8 text-center">
                <Heart className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-500 dark:text-neutral-400">No saved duas yet.</p>
              </Card>
            ) : (
              savedDuaItems.map((d) => (
                <Card key={d.id} className="p-4">
                  <Badge variant="blue" className="mb-2">
                    {d.time}
                  </Badge>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 italic">
                    "{d.translation}"
                  </p>
                  <p className="text-xs text-neutral-400 mt-2">{d.source}</p>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
