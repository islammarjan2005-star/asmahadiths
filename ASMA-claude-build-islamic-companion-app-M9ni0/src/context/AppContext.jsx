import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks';
import { ACHIEVEMENTS } from '../data/spiritualJourney';

const AppContext = createContext(null);

const initialState = {
  // Onboarding
  onboardingComplete: false,

  // Personalization
  userName: '',
  userInterests: [],

  // Theme
  darkMode: false,

  // Saved content
  savedHadith: [],
  savedVerses: [],
  savedDuas: [],

  // Journal entries
  journal: [],

  // Dhikr counter
  dhikrCount: 0,
  dhikrGoal: 33,
  dhikrHistory: [],

  // Smart Adhkar System
  adhkarProgress: {
    morning: {},
    evening: {},
  },
  adhkarStreak: {
    current: 0,
    longest: 0,
    lastCompletedDate: null,
  },
  adhkarHistory: [],

  // Dua Coach
  savedCoachDuas: [],
  duaJourney: [],

  // Spiritual Journey (NEW)
  spiritualXP: 0,
  achievements: [],

  // Daily Challenges (NEW)
  completedChallenges: [],

  // Mood Tracking (NEW)
  moodHistory: [],

  // Settings
  notifications: true,
  hapticFeedback: true,
  fontSize: 'medium',

  // Content tracking
  contentViews: [],

  // Ramadan
  ramadanMode: false,
  ramadanFasting: [],

  // Kids mode
  kidsMode: false,
  kidsProgress: { trivia: 0, stickers: 0, streak: 0 },

  // Study plans
  studyPlans: {},

  // Quran bookmarks
  quranBookmarks: {},

  // Notification settings
  notificationSettings: {
    prayer: true,
    adhkar: true,
    challenges: true,
  },
};

// Achievement checking logic
function checkAchievements(state) {
  const newAchievements = [];

  const checks = {
    first_dhikr: () => (state.dhikrHistory || []).length > 0,
    streak_3: () => (state.adhkarStreak?.current || 0) >= 3,
    streak_7: () => (state.adhkarStreak?.current || 0) >= 7,
    streak_30: () => (state.adhkarStreak?.current || 0) >= 30,
    hadiths_10: () => (state.savedHadith || []).length >= 10,
    hadiths_40: () => (state.savedHadith || []).length >= 40,
    duas_20: () => (state.savedDuas || []).length + (state.savedCoachDuas || []).length >= 20,
    journal_5: () => (state.journal || []).length >= 5,
    journal_30: () => (state.journal || []).length >= 30,
    dhikr_1000: () => {
      const total = (state.dhikrHistory || []).reduce((sum, h) => sum + (h.count || 0), 0);
      return total >= 1000;
    },
    all_morning: () =>
      (state.adhkarHistory || []).some((h) => h.type === 'morning' && h.completed),
    all_evening: () =>
      (state.adhkarHistory || []).some((h) => h.type === 'evening' && h.completed),
    challenge_7: () => (state.completedChallenges || []).length >= 7,
    mood_check_7: () => {
      const uniqueDays = new Set(
        (state.moodHistory || []).map((m) => new Date(m.date).toDateString())
      );
      return uniqueDays.size >= 7;
    },
  };

  for (const [id, check] of Object.entries(checks)) {
    if (!(state.achievements || []).includes(id) && check()) {
      newAchievements.push(id);
    }
  }

  return newAchievements;
}

function appReducer(state, action) {
  let newState;

  switch (action.type) {
    case 'COMPLETE_ONBOARDING':
      newState = {
        ...state,
        onboardingComplete: true,
        userName: action.payload?.name || state.userName,
        userInterests: action.payload?.interests || state.userInterests,
      };
      break;

    case 'TOGGLE_DARK_MODE':
      newState = { ...state, darkMode: !state.darkMode };
      break;

    case 'SET_DARK_MODE':
      newState = { ...state, darkMode: action.payload };
      break;

    case 'TOGGLE_SAVED_HADITH':
      newState = {
        ...state,
        savedHadith: state.savedHadith.includes(action.payload)
          ? state.savedHadith.filter((id) => id !== action.payload)
          : [...state.savedHadith, action.payload],
      };
      break;

    case 'TOGGLE_SAVED_VERSE':
      newState = {
        ...state,
        savedVerses: state.savedVerses.includes(action.payload)
          ? state.savedVerses.filter((id) => id !== action.payload)
          : [...state.savedVerses, action.payload],
      };
      break;

    case 'TOGGLE_SAVED_DUA':
      newState = {
        ...state,
        savedDuas: state.savedDuas.includes(action.payload)
          ? state.savedDuas.filter((id) => id !== action.payload)
          : [...state.savedDuas, action.payload],
      };
      break;

    case 'ADD_JOURNAL_ENTRY':
      newState = {
        ...state,
        journal: [
          {
            id: Date.now(),
            date: new Date().toISOString(),
            ...action.payload,
          },
          ...state.journal,
        ],
      };
      break;

    case 'DELETE_JOURNAL_ENTRY':
      newState = {
        ...state,
        journal: state.journal.filter((entry) => entry.id !== action.payload),
      };
      break;

    case 'INCREMENT_DHIKR': {
      const newCount = state.dhikrCount + 1;
      const completedSet = newCount >= state.dhikrGoal;
      newState = {
        ...state,
        dhikrCount: completedSet ? 0 : newCount,
        dhikrHistory: completedSet
          ? [
              ...state.dhikrHistory,
              { date: new Date().toISOString(), count: state.dhikrGoal },
            ]
          : state.dhikrHistory,
      };
      break;
    }

    case 'RESET_DHIKR':
      newState = { ...state, dhikrCount: 0 };
      break;

    case 'SET_DHIKR_GOAL':
      newState = { ...state, dhikrGoal: action.payload };
      break;

    case 'TOGGLE_NOTIFICATIONS':
      newState = { ...state, notifications: !state.notifications };
      break;

    case 'TOGGLE_HAPTIC':
      newState = { ...state, hapticFeedback: !state.hapticFeedback };
      break;

    case 'LOAD_STATE':
      newState = { ...state, ...action.payload };
      break;

    // Smart Adhkar System Actions
    case 'UPDATE_ADHKAR_PROGRESS': {
      const { type, dhikrId, count } = action.payload;
      newState = {
        ...state,
        adhkarProgress: {
          ...state.adhkarProgress,
          [type]: {
            ...state.adhkarProgress[type],
            [dhikrId]: count,
          },
        },
      };
      break;
    }

    case 'COMPLETE_ADHKAR_SESSION': {
      const { type } = action.payload;
      const today = new Date().toDateString();
      const lastDate = state.adhkarStreak.lastCompletedDate;
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      let newStreak = state.adhkarStreak.current;
      if (lastDate === yesterday || lastDate === today) {
        newStreak = lastDate === today ? newStreak : newStreak + 1;
      } else if (lastDate !== today) {
        newStreak = 1;
      }

      newState = {
        ...state,
        adhkarProgress: {
          ...state.adhkarProgress,
          [type]: {},
        },
        adhkarStreak: {
          current: newStreak,
          longest: Math.max(state.adhkarStreak.longest, newStreak),
          lastCompletedDate: today,
        },
        adhkarHistory: [
          ...state.adhkarHistory,
          { date: new Date().toISOString(), type, completed: true },
        ],
      };
      break;
    }

    case 'RESET_ADHKAR_PROGRESS': {
      const { type } = action.payload;
      newState = {
        ...state,
        adhkarProgress: {
          ...state.adhkarProgress,
          [type]: {},
        },
      };
      break;
    }

    // Dua Coach Actions
    case 'TOGGLE_SAVED_COACH_DUA':
      newState = {
        ...state,
        savedCoachDuas: state.savedCoachDuas.includes(action.payload)
          ? state.savedCoachDuas.filter((id) => id !== action.payload)
          : [...state.savedCoachDuas, action.payload],
      };
      break;

    case 'ADD_DUA_JOURNEY': {
      newState = {
        ...state,
        duaJourney: [
          {
            id: Date.now(),
            date: new Date().toISOString(),
            ...action.payload,
          },
          ...state.duaJourney,
        ],
      };
      break;
    }

    case 'UPDATE_DUA_JOURNEY_NOTES': {
      newState = {
        ...state,
        duaJourney: state.duaJourney.map((entry) =>
          entry.id === action.payload.id
            ? { ...entry, notes: action.payload.notes }
            : entry
        ),
      };
      break;
    }

    // === NEW: Spiritual Journey Actions ===
    case 'ADD_XP': {
      const { amount } = action.payload;
      newState = {
        ...state,
        spiritualXP: (state.spiritualXP || 0) + amount,
      };
      break;
    }

    case 'UNLOCK_ACHIEVEMENT': {
      const achievementId = action.payload;
      if ((state.achievements || []).includes(achievementId)) {
        return state;
      }
      const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
      newState = {
        ...state,
        achievements: [...(state.achievements || []), achievementId],
        spiritualXP: (state.spiritualXP || 0) + (achievement?.xp || 0),
      };
      break;
    }

    // === NEW: Daily Challenges ===
    case 'COMPLETE_CHALLENGE': {
      const { id, date } = action.payload;
      const alreadyDone = (state.completedChallenges || []).some(
        (c) => c.id === id && new Date(c.date).toDateString() === new Date(date).toDateString()
      );
      if (alreadyDone) return state;
      newState = {
        ...state,
        completedChallenges: [
          ...(state.completedChallenges || []),
          { id, date },
        ],
      };
      break;
    }

    // === NEW: Mood Tracking ===
    case 'LOG_MOOD': {
      newState = {
        ...state,
        moodHistory: [action.payload, ...(state.moodHistory || [])].slice(0, 100),
      };
      break;
    }

    // === Font Size ===
    case 'SET_FONT_SIZE':
      newState = { ...state, fontSize: action.payload };
      break;

    // === Content Tracking ===
    case 'ADD_CONTENT_VIEW': {
      const views = state.contentViews || [];
      newState = {
        ...state,
        contentViews: [
          { type: action.payload.type, id: action.payload.id, date: new Date().toISOString() },
          ...views,
        ].slice(0, 200),
      };
      break;
    }

    // === Ramadan ===
    case 'TOGGLE_RAMADAN_MODE':
      newState = { ...state, ramadanMode: !state.ramadanMode };
      break;

    case 'TOGGLE_FASTING_DAY': {
      const dateStr = action.payload;
      const fasting = state.ramadanFasting || [];
      newState = {
        ...state,
        ramadanFasting: fasting.includes(dateStr)
          ? fasting.filter(d => d !== dateStr)
          : [...fasting, dateStr],
      };
      break;
    }

    // === Kids Mode ===
    case 'TOGGLE_KIDS_MODE':
      newState = { ...state, kidsMode: !state.kidsMode };
      break;

    case 'UPDATE_KIDS_PROGRESS':
      newState = {
        ...state,
        kidsProgress: { ...(state.kidsProgress || {}), ...action.payload },
      };
      break;

    // === Study Plans ===
    case 'START_STUDY_PLAN': {
      const { planId } = action.payload;
      newState = {
        ...state,
        studyPlans: {
          ...(state.studyPlans || {}),
          [planId]: { startDate: new Date().toISOString(), completedDays: [], active: true },
        },
      };
      break;
    }

    case 'COMPLETE_STUDY_DAY': {
      const { planId, day } = action.payload;
      const plan = (state.studyPlans || {})[planId];
      if (!plan) return state;
      newState = {
        ...state,
        studyPlans: {
          ...state.studyPlans,
          [planId]: {
            ...plan,
            completedDays: [...new Set([...plan.completedDays, day])],
          },
        },
      };
      break;
    }

    // === Quran Bookmarks ===
    case 'SET_QURAN_BOOKMARK': {
      const { surahId, verseId } = action.payload;
      newState = {
        ...state,
        quranBookmarks: {
          ...(state.quranBookmarks || {}),
          [surahId]: verseId,
          lastRead: { surahId, verseId, date: new Date().toISOString() },
        },
      };
      break;
    }

    // === Notification Settings ===
    case 'UPDATE_NOTIFICATION_SETTINGS':
      newState = {
        ...state,
        notificationSettings: {
          ...(state.notificationSettings || {}),
          ...action.payload,
        },
      };
      break;

    default:
      return state;
  }

  // After every state change, check for new achievements
  const newAchievements = checkAchievements(newState);
  if (newAchievements.length > 0) {
    let xpGain = 0;
    for (const id of newAchievements) {
      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      if (achievement) xpGain += achievement.xp;
    }
    newState = {
      ...newState,
      achievements: [...(newState.achievements || []), ...newAchievements],
      spiritualXP: (newState.spiritualXP || 0) + xpGain,
    };
  }

  return newState;
}

export function AppProvider({ children }) {
  const [persistedState, setPersistedState] = useLocalStorage('asma-app-state', initialState);

  // Merge persisted state with initialState to handle new fields
  const mergedInitial = { ...initialState, ...persistedState };
  const [state, dispatch] = useReducer(appReducer, mergedInitial);

  // Persist state changes
  useEffect(() => {
    setPersistedState(state);
  }, [state, setPersistedState]);

  // Apply dark mode class
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Apply font size
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', state.fontSize || 'medium');
  }, [state.fontSize]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
