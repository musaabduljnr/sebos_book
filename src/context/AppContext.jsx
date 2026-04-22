import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { seedDemoData } from '../db/database';

const AppContext = createContext(null);

const initialState = {
  isLoading: true,
  refreshKey: 0,
  toasts: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'REFRESH':
      return { ...state, refreshKey: state.refreshKey + 1 };
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, { id: Date.now(), ...action.payload }],
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    async function init() {
      // Automatic seeding removed to start from zero as requested.
      dispatch({ type: 'SET_LOADING', payload: false });
    }
    init();
  }, []);

  const triggerRefresh = useCallback(() => {
    dispatch({ type: 'REFRESH' });
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    dispatch({ type: 'ADD_TOAST', payload: { message, type } });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, 3000);
  }, []);

  const value = {
    ...state,
    triggerRefresh,
    showToast,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
