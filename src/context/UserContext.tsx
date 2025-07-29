import React, { createContext, useState, ReactNode, useContext, useCallback } from 'react';
import { UserData } from '../types';

// A default mock user that is always "logged in".
const defaultUser: UserData = {
  _id: 'defaultuser01',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  role: 'Student',
  university: 'University of Knowledge',
  events: [
      { id: 1, title: 'Submit History Essay', type: 'Assignment', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { id: 2, title: 'Biology Mid-term Exam', type: 'Exam', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  ],
  pomodoroTasks: [
      { id: 1, text: 'Read Chapter 4', completed: true },
      { id: 2, text: 'Outline Essay Structure', completed: false },
  ],
  pomodoroSettings: { focus: 25, shortBreak: 5, longBreak: 15, themeColor: '#4f46e5' },
  communityStatus: 'active',
  appStatus: 'active',
  communityBanExpires: null,
  appBanExpires: null,
  requiresAdminReview: false,
};


interface UserContextType {
  user: UserData | null;
  updateUserData: (data: Partial<Pick<UserData, 'events' | 'pomodoroTasks' | 'pomodoroSettings'>>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(defaultUser);

  // This function now only updates the local state for the session.
  const updateUserData = useCallback((dataToUpdate: Partial<Pick<UserData, 'events' | 'pomodoroTasks' | 'pomodoroSettings'>>) => {
      setUser(currentUser => {
          if (!currentUser) return null;
          const updatedUser = { ...currentUser, ...dataToUpdate };
          return updatedUser;
      });
  }, []);

  const value = { user, updateUserData };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};