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
  SpiritualJourney,
  MoodGuidance,
  QiblaCompass,
  DailyChallenges,
  RamadanMode,
  QuranBrowser,
  NamesOfAllah,
  StudyPlans,
  KidsMode,
  Analytics,
  QuranicVisual,
} from './components/features';
import { usePrayerTimes } from './hooks';
import { PageTransition } from './components/ui/PageTransition';

function AppContent() {
  const { state, dispatch } = useApp();
  const [view, setView] = useState('home');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [explainHadith, setExplainHadith] = useState(null);
  const { hijriData } = usePrayerTimes();

  // Handle onboarding
  if (!state.onboardingComplete) {
    return (
      <Onboarding
        onComplete={(data) =>
          dispatch({ type: 'COMPLETE_ONBOARDING', payload: data })
        }
      />
    );
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
            onAskSafely={() => setView('ask')}
            onCultureVsIslam={() => setView('culture')}
            onSmartAdhkar={() => setView('adhkar')}
            onDuaCoach={() => setView('coach')}
            onMood={() => setView('mood')}
            onQibla={() => setView('qibla')}
            onChallenges={() => setView('challenges')}
            onJournal={() => setView('journal')}
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
        return (
          <QuranView
            onBack={() => setView('home')}
            onBrowseQuran={() => setView('quran-browser')}
          />
        );

      case 'quran-browser':
        return <QuranBrowser onBack={() => setView('quran')} />;

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

      case 'journey':
        return (
          <SpiritualJourney
            onBack={() => setView('home')}
            onAnalytics={() => setView('analytics')}
          />
        );

      case 'mood':
        return (
          <MoodGuidance
            onBack={() => setView('home')}
            onDhikr={() => {
              setView('dhikr');
              setActiveTab('dhikr');
            }}
            onAdhkar={() => setView('adhkar')}
            onJournal={() => setView('journal')}
          />
        );

      case 'qibla':
        return <QiblaCompass onBack={() => setView('home')} />;

      case 'challenges':
        return (
          <DailyChallenges
            onBack={() => setView('home')}
            onNavigate={(target) => {
              if (target === 'dhikr') {
                setView('dhikr');
                setActiveTab('dhikr');
              } else {
                setView(target);
              }
            }}
          />
        );

      case 'names':
        return <NamesOfAllah onBack={() => setView('home')} />;

      case 'ramadan':
        return <RamadanMode onBack={() => setView('home')} hijriData={hijriData} />;

      case 'study-plans':
        return <StudyPlans onBack={() => setView('home')} />;

      case 'kids':
        return <KidsMode onBack={() => setView('home')} />;

      case 'analytics':
        return <Analytics onBack={() => setView('home')} />;

      case 'quran-visual':
        return <QuranicVisual onBack={() => setView('home')} />;

      case 'search':
        return (
          <Search
            onClose={() => {
              setView('home');
              setActiveTab('home');
            }}
            onSelectHadith={(h) => setExplainHadith(h)}
            onSelectVerse={() => setView('quran')}
            onSelectDua={() => setView('duas')}
            onSelectStory={() => setView('sahabiyat')}
            onSelectTopic={(topic) => {
              setSelectedTopic(topic);
              setView('topic');
            }}
            onQuran={() => setView('quran')}
            onDuas={() => setView('duas')}
            onSahabiyat={() => setView('sahabiyat')}
            onJourney={() => setView('journey')}
            onNamesOfAllah={() => setView('names')}
            onQuranBrowser={() => setView('quran-browser')}
            onStudyPlans={() => setView('study-plans')}
            onKidsMode={() => setView('kids')}
            onAnalytics={() => setView('analytics')}
            onRamadan={() => setView('ramadan')}
            onJournal={() => setView('journal')}
            onQuranVisual={() => setView('quran-visual')}
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
      <PageTransition viewKey={view}>
        {renderContent()}
      </PageTransition>

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
