'use client';

import React from 'react';

export type UserType = 'normal' | 'developer' | null;

// Create a simpler context
const UserTypeContext = React.createContext<{
  userType: UserType;
  setUserType: (type: UserType) => void;
  switchUserType: () => void;
  isLoading: boolean;
}>({
  userType: null,
  setUserType: () => {},
  switchUserType: () => {},
  isLoading: true,
});

// Export the hook
export const useUserType = () => React.useContext(UserTypeContext);

// Simple Provider component
export function UserTypeProvider(props: { children: React.ReactNode }) {
  const [userType, setUserTypeState] = React.useState<UserType>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedType = localStorage.getItem('userType');
        if (storedType === 'normal' || storedType === 'developer') {
          setUserTypeState(storedType as UserType);
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  function setUserType(type: UserType) {
    setUserTypeState(type);
    if (type) {
      try {
        localStorage.setItem('userType', type);
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    } else {
      try {
        localStorage.removeItem('userType');
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    }
  }

  function switchUserType() {
    const newType = userType === 'normal' ? 'developer' : 'normal';
    setUserType(newType);
  }

  return React.createElement(
    UserTypeContext.Provider,
    { 
      value: {
        userType,
        setUserType,
        switchUserType,
        isLoading
      }
    },
    props.children
  );
}