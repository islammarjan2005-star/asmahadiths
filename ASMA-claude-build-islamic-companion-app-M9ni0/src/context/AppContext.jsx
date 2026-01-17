import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks';

const AppContext = createContext(null);

const initialState = {
  // Onboarding
  onboardingComplete: false,

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
    morning: {}, // { dhikrId: completedCount }
    evening: {},
  },
  adhkarStreak: {
    current: 0,
    longest: 0,
    lastCompletedDate: null,
  },
  adhkarHistory: [], // [{ date, type: 'morning'|'evening', completed: true }]

  // Dua Coach
  savedCoachDuas: [], // saved situational duas
  duaJourney: [], // [{ date, concern, duaId, notes }]

  // Settings
  notifications: true,
  hapticFeedback: true,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingComplete: true };

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };

    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };

    case 'TOGGLE_SAVED_HADITH':
      return {
        ...state,
        savedHadith: state.savedHadith.includes(action.payload)
          ? state.savedHadith.filter((id) => id !== action.payload)
          : [...state.savedHadith, action.payload],
      };

    case 'TOGGLE_SAVED_VERSE':
      return {
        ...state,
        savedVerses: state.savedVerses.includes(action.payload)
          ? state.savedVerses.filter((id) => id !== action.payload)
          : [...state.savedVerses, action.payload],
      };

    case 'TOGGLE_SAVED_DUA':
      return {
        ...state,
        savedDuas: state.savedDuas.includes(action.payload)
          ? state.savedDuas.filter((id) => id !== action.payload)
          : [...state.savedDuas, action.payload],
      };

    case 'ADD_JOURNAL_ENTRY':
      return {
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

    case 'DELETE_JOURNAL_ENTRY':
      return {
        ...state,
        journal: state.journal.filter((entry) => entry.id !== action.payload),
      };

    case 'INCREMENT_DHIKR':
      const newCount = state.dhikrCount + 1;
      const completedSet = newCount >= state.dhikrGoal;
      return {
        ...state,
        dhikrCount: completedSet ? 0 : newCount,
        dhikrHistory: completedSet
          ? [
              ...state.dhikrHistory,
              { date: new Date().toISOString(), count: state.dhikrGoal },
            ]
          : state.dhikrHistory,
      };

    case 'RESET_DHIKR':
      return { ...state, dhikrCount: 0 };

    case 'SET_DHIKR_GOAL':
      return { ...state, dhikrGoal: action.payload };

    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notifications: !state.notifications };

    case 'TOGGLE_HAPTIC':
      return { ...state, hapticFeedback: !state.hapticFeedback };

    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    // Smart Adhkar System Actions
    case 'UPDATE_ADHKAR_PROGRESS': {
      const { type, dhikrId, count } = action.payload;
      return {
        ...state,
        adhkarProgress: {
          ...state.adhkarProgress,
          [type]: {
            ...state.adhkarProgress[type],
            [dhikrId]: count,
          },
        },
      };
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

      return {
        ...state,
        adhkarProgress: {
          ...state.adhkarProgress,
          [type]: {}, // Reset progress for next session
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
    }

    case 'RESET_ADHKAR_PROGRESS': {
      const { type } = action.payload;
      return {
        ...state,
        adhkarProgress: {
          ...state.adhkarProgress,
          [type]: {},
        },
      };
    }

    // Dua Coach Actions
    case 'TOGGLE_SAVED_COACH_DUA':
      return {
        ...state,
        savedCoachDuas: state.savedCoachDuas.includes(action.payload)
          ? state.savedCoachDuas.filter((id) => id !== action.payload)
          : [...state.savedCoachDuas, action.payload],
      };

    case 'ADD_DUA_JOURNEY': {
      return {
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
    }

    case 'UPDATE_DUA_JOURNEY_NOTES': {
      return {
        ...state,
        duaJourney: state.duaJourney.map((entry) =>
          entry.id === action.payload.id
            ? { ...entry, notes: action.payload.notes }
            : entry
        ),
      };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [persistedState, setPersistedState] = useLocalStorage('asma-app-state', initialState);
  const [state, dispatch] = useReducer(appReducer, persistedState);

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
