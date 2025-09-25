// hooks/useHomeReloadRedirect.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useHomeReloadRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ FIXED: Only redirect if it's an ACTUAL reload, not navigation
    const checkForReload = () => {
      const navigationEntries = window.performance.getEntriesByType('navigation');
      
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0];
        
        // Only redirect if it's a true reload AND not a back button navigation
        if (navEntry.type === 'reload') {
          // ✅ Check if we just came from back button (flag would be cleared)
          const wasBackButton = sessionStorage.getItem('wasBackButtonNavigation');
          
          if (wasBackButton === 'true') {
            // Clear the flag and don't redirect - this is a valid back button navigation
            sessionStorage.removeItem('wasBackButtonNavigation');
            console.log('✅ Back button navigation to /home - no redirect');
            return;
          }
          
          // This is a genuine reload - redirect to /
          console.log('🔄 /home page genuinely reloaded - redirecting to /');
          navigate('/', { replace: true });
        }
      } else {
        // Fallback for older browsers
        if (window.performance.navigation && window.performance.navigation.type === 1) {
          const wasBackButton = sessionStorage.getItem('wasBackButtonNavigation');
          
          if (wasBackButton === 'true') {
            sessionStorage.removeItem('wasBackButtonNavigation');
            console.log('✅ Back button navigation to /home (fallback) - no redirect');
            return;
          }
          
          console.log('🔄 /home page genuinely reloaded (fallback) - redirecting to /');
          navigate('/', { replace: true });
        }
      }
    };

    checkForReload();
  }, [navigate]);
};
