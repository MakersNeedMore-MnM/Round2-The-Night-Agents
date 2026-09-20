import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Patient, Encounter, UserRole } from '../types';
import { api } from '../services/api';

export type AppView = 
  | 'landing'
  | 'patient-kiosk'
  | 'physician-dashboard'
  | 'triage-center'
  | 'opd-admin'
  | 'ayush-intake'
  | 'privacy-center';

interface AppContextType {
  user: User;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  patient: Patient | null;
  setPatient: (patient: Patient | null) => void;
  encounter: Encounter | null;
  setEncounter: (encounter: Encounter | null) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  switchUserRole: (role: UserRole) => Promise<void>;
  isOffline: boolean;
  refreshUserData: () => Promise<void>;
}

const defaultUser: User = {
  id: 'usr_doc_1',
  email: 'doctor@chikitsabodha.demo',
  name: 'Dr. Arvind Sharma, MD',
  role: 'DOCTOR',
  department: 'General Medicine',
  avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hi');
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  useEffect(() => {
    // Listen for network status changes
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load of demo patient
    loadInitialData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadInitialData = async () => {
    try {
      const res = await api.getPatient('pat_ramesh_1');
      if (res.success) {
        setPatient(res.patient);
        setEncounter(res.encounter);
      }
    } catch (err) {
      console.warn('Initial data load from API caught error, using offline mock:', err);
    }
  };

  const switchUserRole = async (role: UserRole) => {
    try {
      const res = await api.switchRole(role);
      if (res.success) {
        setUser(res.user);
        if (role === 'DOCTOR') setCurrentView('physician-dashboard');
        else if (role === 'PATIENT') setCurrentView('patient-kiosk');
        else if (role === 'NURSE') setCurrentView('triage-center');
        else if (role === 'ADMIN' || role === 'SUPERADMIN') setCurrentView('opd-admin');
      }
    } catch (err) {
      console.warn('Role switch network issue, updating locally:', err);
      // Local fallback
      let newName = 'Dr. Arvind Sharma, MD';
      if (role === 'PATIENT') newName = 'Ramesh Kumar (52/M)';
      else if (role === 'ADMIN') newName = 'Rajesh Nair (OPD Admin)';
      else if (role === 'NURSE') newName = 'Sister Deepa Verma (Triage)';

      setUser({
        id: `usr_${role.toLowerCase()}`,
        email: `${role.toLowerCase()}@chikitsabodha.demo`,
        name: newName,
        role: role,
        department: role === 'DOCTOR' ? 'General Medicine' : 'OPD Care',
      });
      if (role === 'DOCTOR') setCurrentView('physician-dashboard');
      else if (role === 'PATIENT') setCurrentView('patient-kiosk');
      else if (role === 'NURSE') setCurrentView('triage-center');
      else if (role === 'ADMIN') setCurrentView('opd-admin');
    }
  };

  const refreshUserData = async () => {
    await loadInitialData();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentView,
        setCurrentView,
        patient,
        setPatient,
        encounter,
        setEncounter,
        selectedLanguage,
        setSelectedLanguage,
        switchUserRole,
        isOffline,
        refreshUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
