'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserType = 'normal' | 'developer' | null;

interface UserTypeContextProps {
  userType: UserType;
  setUserType: (type: UserType) => void;
  isLoading: boolean;
}

const UserTypeContext = createContext<UserTypeContextProps | undefined>(undefined);

export function UserTypeProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user type from localStorage if available
    const loadUserType = () => {
      try {
        const savedType = localStorage.getItem('userType') as UserType;
        if (savedType) {
          setUserType(savedType);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading user type:", error);
        setIsLoading(false);
      }
    };

    loadUserType();
  }, []);

  const handleSetUserType = (type: UserType) => {
    setUserType(type);
    try {
      if (type) {
        localStorage.setItem('userType', type);
      } else {
        localStorage.removeItem('userType');
      }
    } catch (error) {
      console.error("Error saving user type:", error);
    }
  };

  return (
    <UserTypeContext.Provider
      value={{
        userType,
        setUserType: handleSetUserType,
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