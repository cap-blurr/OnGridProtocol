import { useUserType } from "@/providers/userType";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

/**
 * Hook to redirect users based on connection and account type status
 * @param options Configuration options for the redirect
 */
export function useAuthRedirect(options: {
  ifNotConnected?: string;
  ifConnectedWithoutType?: string;
  ifNormalUser?: string;
  ifDeveloper?: string;
  onlyNormalUser?: boolean;
  onlyDeveloper?: boolean;
}) {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { userType, isLoading } = useUserType();

  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) return;
    
    // Not connected, redirect if specified
    if (!isConnected && options.ifNotConnected) {
      router.push(options.ifNotConnected);
      return;
    }

    // Connected but no user type selected
    if (isConnected && !userType && options.ifConnectedWithoutType) {
      router.push(options.ifConnectedWithoutType);
      return;
    }

    // User type specific redirects
    if (isConnected && userType) {
      if (userType === 'normal') {
        if (options.onlyDeveloper) {
          router.push('/dashboard'); // Redirect normal users away from developer-only pages
          return;
        }
        if (options.ifNormalUser) {
          router.push(options.ifNormalUser);
          return;
        }
      }

      if (userType === 'developer') {
        if (options.onlyNormalUser) {
          router.push('/developer-dashboard'); // Redirect developers away from normal-user-only pages
          return;
        }
        if (options.ifDeveloper) {
          router.push(options.ifDeveloper);
          return;
        }
      }
    }
  }, [isConnected, userType, isLoading, options, router]);
}

/**
 * Check if a user is authorized to view a page
 */
export function useAuthorized({
  requireAuth = true,
  onlyNormalUser = false,
  onlyDeveloper = false,
}: {
  requireAuth?: boolean;
  onlyNormalUser?: boolean;
  onlyDeveloper?: boolean;
}): boolean {
  const { isConnected } = useAccount();
  const { userType, isLoading } = useUserType();

  // Still loading auth state
  if (isLoading) return false;
  
  // No auth required
  if (!requireAuth) return true;
  
  // Auth required but not connected
  if (!isConnected) return false;
  
  // Connected but no type selected
  if (!userType) return false;
  
  // Specific user type requirements
  if (onlyNormalUser && userType !== 'normal') return false;
  if (onlyDeveloper && userType !== 'developer') return false;
  
  // All checks passed
  return true;
} 