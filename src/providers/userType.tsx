'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import toast from 'react-hot-toast'; // Optional: if you want to add toast notifications for errors

export type UserType = 'normal' | 'developer' | null;

interface UserTypeContextProps {
  userType: UserType;
  setUserType: (type: UserType) => void;
  isLoading: boolean;
}

const UserTypeContext = createContext<UserTypeContextProps | undefined>(undefined);

export function UserTypeProvider({ children }: { children: ReactNode }) {
  const [userTypeValue, setUserTypeValue] = useState<UserType>(null); // Internal React state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user type from localStorage if available
    const loadUserType = () => {
      try {
        const savedType = localStorage.getItem('userType') as UserType;
        if (savedType) {
          setUserTypeValue(savedType); // Update internal React state
        }
        // If no savedType, userTypeValue remains null, which is correct.
      } catch (error) {
        console.error("Error loading user type from localStorage:", error);
        // toast.error("Failed to load account type preference."); // Optional
      } finally {
        setIsLoading(false); // Ensure loading is set to false regardless of success/failure
      }
    };

    loadUserType();
  }, []); // Runs once on mount

  // This is the function exposed via context for components to call
  const updateUserType = (type: UserType) => {
    try {
      if (type) {
        localStorage.setItem('userType', type);
      } else {
        // If type is null, remove it from localStorage
        localStorage.removeItem('userType');
      }
      setUserTypeValue(type); // Update internal React state only after successful localStorage operation
    } catch (error) {
      console.error("Error saving user type to localStorage:", error);
      // toast.error("Failed to save account type preference. Please try again."); // Optional
      // If localStorage fails, userTypeValue (React state) does NOT get updated to the new 'type'.
      // It will retain its value from the last successful set or load.
      // This means the UI will reflect the persisted state, not an optimistic unpersisted one.
    }
  };

  return (
    <UserTypeContext.Provider
      value={{
        userType: userTypeValue,
        setUserType: updateUserType, // Expose the robust updater
        isLoading,
      }}
    >
      {children}
    </UserTypeContext.Provider>
  );
}

export function useUserType() {
  const context = useContext(UserTypeContext);
  if (context === undefined) {
    throw new Error("useUserType must be used within a UserTypeProvider");
  }
  return context;
}