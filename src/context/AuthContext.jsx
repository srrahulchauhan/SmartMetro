import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USER, INITIAL_SAVED_PASSENGERS } from '../data/mockData';
import { loadStorage, saveStorage } from '../utils/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadStorage('metro_user', INITIAL_USER));
  const [savedPassengers, setSavedPassengers] = useState(() => loadStorage('metro_saved_passengers', INITIAL_SAVED_PASSENGERS));
  const [preferences, setPreferences] = useState(() => loadStorage('metro_user_prefs', {
    soundEffects: true,
    hapticFeedback: true,
    liveJourneyAlerts: true,
    defaultStationId: 'noida-electronic-city',
    language: 'English',
    locationAccess: 'Granted',
    autoRechargeNotification: true
  }));

  useEffect(() => {
    saveStorage('metro_user', user);
  }, [user]);

  useEffect(() => {
    saveStorage('metro_saved_passengers', savedPassengers);
  }, [savedPassengers]);

  useEffect(() => {
    saveStorage('metro_user_prefs', preferences);
  }, [preferences]);

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addSavedPassenger = (passenger) => {
    const newPassenger = {
      ...passenger,
      id: `p-${Date.now()}`
    };
    setSavedPassengers(prev => [...prev, newPassenger]);
    return newPassenger;
  };

  const removeSavedPassenger = (id) => {
    setSavedPassengers(prev => prev.filter(p => p.id !== id));
  };

  const updatePreferences = (updates) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      updateUser,
      savedPassengers,
      addSavedPassenger,
      removeSavedPassenger,
      preferences,
      updatePreferences
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
