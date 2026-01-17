import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { BottomNav } from './components/layout';
import {
  Onboarding,
  HomeScreen,
  AskSafely,
  DhikrCounter,
  PrayerTimes,
  Journal,
  QuranView,
  DuasView,
  SahabiyatView,
  CultureVsIslam,
  TopicView,
  Settings,
  Search,
  SavedView,
  ExplanationModal,
  SmartAdhkar,
  DuaCoach,
} from './components/features';

function AppContent() {
  const { state, dispatch } = useApp();
  const [view, setView] = useState('home');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [explainHadith, setExplainHadith] = useState(null);

  // Handle onboarding
  if (!state.onboardingComplete) {
    return <Onboarding onComplete={() => dispatch({ type: 'COMPLETE_ONBOARDING' })} />;
  }

  // Handle tab navigation
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') setView('home');
    else if (tab === 'search') setView('search');
    else if (tab === 'dhikr') setView('dhikr');
    else if (tab === 'saved') setView('saved');
    else if (tab === 'settings') setView('settings');
  };

  // Render main content based on view
  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <HomeScreen
            onSelectTopic={(topic) => {
              setSelectedTopic(topic);
              setView('topic');
            }}
            onAskSafely={() => setView('ask')}
            onCultureVsIslam={() => setView('culture')}
            onQuran={() => setView('quran')}
            onDuas={() => setView('duas')}
            onSahabiyat={() => setView('sahabiyat')}
            onPrayerTimes={() => setView('prayer')}
            onSmartAdhkar={() => setView('adhkar')}
            onDuaCoach={() => setView('coach')}
          />
        );

      case 'topic':
        return (
          <TopicView
            topic={selectedTopic}
            onBack={() => {
              setView('home');
              setSelectedTopic(null);
            }}
            onExplain={setExplainHadith}
          />
        );

      case 'ask':
        return <AskSafely onBack={() => setView('home')} />;

      case 'culture':
        return <CultureVsIslam onBack={() => setView('home')} />;

      case 'quran':
        return <QuranView onBack={() => setView('home')} />;

      case 'duas':
        return <DuasView onBack={() => setView('home')} />;

      case 'sahabiyat':
        return <SahabiyatView onBack={() => setView('home')} />;

      case 'prayer':
        return <PrayerTimes onBack={() => setView('home')} />;

      case 'adhkar':
        return <SmartAdhkar onBack={() => setView('home')} />;

      case 'coach':
        return <DuaCoach onBack={() => setView('home')} />;

      case 'journal':
        return <Journal onBack={() => setView('home')} />;

      case 'search':
        return (
          <Search
            onClose={() => {
              setView('home');
              setActiveTab('home');
            }}
            onSelectHadith={(h) => {
              setExplainHadith(h);
            }}
            onSelectVerse={() => setView('quran')}
            onSelectDua={() => setView('duas')}
            onSelectStory={() => setView('sahabiyat')}
          />
        );

      case 'dhikr':
        return (
          <DhikrCounter
            onBack={() => {
              setView('home');
              setActiveTab('home');
            }}
          />
        );

      case 'saved':
        return (
          <SavedView
            onBack={() => {
              setView('home');
              setActiveTab('home');
            }}
            onSelectHadith={(h) => setExplainHadith(h)}
          />
        );

      case 'settings':
        return (
          <Settings
            onBack={() => {
              setView('home');
              setActiveTab('home');
            }}
          />
        );

      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {renderContent()}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Explanation Modal */}
      {explainHadith && (
        <ExplanationModal hadith={explainHadith} onClose={() => setExplainHadith(null)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
