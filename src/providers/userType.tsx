'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePrivy } from '@privy-io/react-auth';
import UserTypeModal from '@/components/ui/UserTypeModal';
import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast'; // Optional: if you want to add toast notifications for errors

export type UserType = 'normal' | 'developer' | null;

interface UserTypeContextProps {
  userType: UserType;
  setUserType: (type: UserType) => void;
  isLoading: boolean;
  showUserTypeModal: boolean;
}

const UserTypeContext = createContext<UserTypeContextProps | undefined>(undefined);

export function UserTypeProvider({ children }: { children: ReactNode }) {
  const [userTypeValue, setUserTypeValue] = useState<UserType>(null);
  const [isStorageLoading, setIsStorageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const { authenticated, ready, user } = usePrivy();
  const router = useRouter();

  // Load user type from localStorage on mount
  useEffect(() => {
    const loadUserType = () => {
      try {
        const savedType = localStorage.getItem('userType') as UserType;
        if (savedType) {
          setUserTypeValue(savedType);
        }
      } catch (error) {
        console.error("Error loading user type from localStorage:", error);
      } finally {
        setIsStorageLoading(false);
      }
    };

    // Only load after component is ready
    if (ready) {
      loadUserType();
    }
  }, [ready]);

  // Handle authentication state changes and user type modal
  useEffect(() => {
    if (!ready || isStorageLoading) return;

    // If user just authenticated and we haven't checked their auth state yet
    if (authenticated && !hasCheckedAuth) {
      setHasCheckedAuth(true);
      
      // Check if user has a saved user type
      const savedType = localStorage.getItem('userType') as UserType;
      
      // If no saved type, show the modal with optimized timing for mobile
      if (!savedType) {
        setIsNavigating(true);
        // Reduced delay for mobile responsiveness
        const showModalTimer = setTimeout(() => {
          setIsNavigating(false);
          setShowModal(true);
        }, 600); // Reduced from 1200ms
        
        return () => clearTimeout(showModalTimer);
      } else {
        setUserTypeValue(savedType);
        // Minimal delay for smooth transition
        const resetNavigationTimer = setTimeout(() => {
          setIsNavigating(false);
        }, 200); // Reduced from 500ms
        
        return () => clearTimeout(resetNavigationTimer);
      }
    }

    // If user disconnected, reset everything
    if (!authenticated && hasCheckedAuth) {
      setHasCheckedAuth(false);
      setUserTypeValue(null);
      setShowModal(false);
      setIsNavigating(false);
      try {
        localStorage.removeItem('userType');
      } catch (error) {
        console.error("Error removing user type from localStorage:", error);
      }
    }
  }, [authenticated, ready, hasCheckedAuth, isStorageLoading]);

  // Function to handle user type selection with optimized mobile navigation
  const handleUserTypeSelection = (type: UserType) => {
    updateUserType(type);
    setShowModal(false);
    setIsNavigating(true);
    
    // Optimized navigation timing for mobile
    const navigateTimer = setTimeout(() => {
      if (type === 'developer') {
        router.push('/developer-dashboard');
      } else {
        router.push('/dashboard');
      }
      
      // Quick reset for mobile
      const resetTimer = setTimeout(() => {
        setIsNavigating(false);
      }, 100); // Greatly reduced from 500ms
      
      return () => clearTimeout(resetTimer);
    }, 150); // Reduced from 300ms
    
    return () => clearTimeout(navigateTimer);
  };

  // Function to update user type
  const updateUserType = (type: UserType) => {
    try {
      if (type) {
        localStorage.setItem('userType', type);
      } else {
        localStorage.removeItem('userType');
      }
      setUserTypeValue(type);
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
        setUserType: updateUserType,
        isLoading: isStorageLoading || !ready || isNavigating,
        showUserTypeModal: showModal,
      }}
    >
      {children}
      
      {/* User Type Selection Modal */}
      <UserTypeModal
        isOpen={showModal}
        onSelectUserType={handleUserTypeSelection}
      />
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