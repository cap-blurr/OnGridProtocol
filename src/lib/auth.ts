import { redirect } from 'next/navigation';
import { UserType } from '@/providers/userType';

/**
 * Redirects the user based on their account type and authentication status
 */
export function redirectBasedOnUserType(
  isConnected: boolean, 
  userType: UserType, 
  currentPath: string
) {
  // Not connected - redirect to landing page unless already there
  if (!isConnected && currentPath !== '/') {
    redirect('/');
    return;
  }

  // Connected but no user type selected - they need to select a type
  // (UserTypeModal will handle this case, no redirect needed)
  if (isConnected && !userType) {
    return;
  }

  // User type selected - redirect to appropriate dashboard if not already there
  if (isConnected && userType) {
    const isOnDeveloperDashboard = currentPath.startsWith('/developer-dashboard');
    const isOnNormalDashboard = currentPath.startsWith('/dashboard');

    if (userType === 'developer' && !isOnDeveloperDashboard) {
      redirect('/developer-dashboard');
      return;
    }

    if (userType === 'normal' && !isOnNormalDashboard) {
      redirect('/dashboard');
      return;
    }
  }
}

/**
 * Checks if the user is authorized to access a specific page
 */
export function isAuthorized(
  isConnected: boolean, 
  userType: UserType, 
  requiredUserType: UserType | null = null
): boolean {
  // Not connected - not authorized for any protected routes
  if (!isConnected) {
    return false;
  }

  // Connected but no specific type required - authorized
  if (requiredUserType === null) {
    return true;
  }

  // Connected and type matches required type - authorized
  return userType === requiredUserType;
} 