// hooks/useBackButtonOverride.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useBackButtonOverride = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const cameFromRoot = sessionStorage.getItem('cameFromRoot');
    
    if (cameFromRoot === 'true') {
      console.log('✅ Setting up back button override');
      
      const currentUrl = window.location.href;
      window.history.replaceState({ ...window.history.state, preventBack: true }, '', currentUrl);
      window.history.pushState({ preventBack: true }, '', currentUrl);
      
      const handlePopState = (event) => {
        console.log('🔄 Back button event detected!');
        
        sessionStorage.removeItem('cameFromRoot');
        
        // ✅ NEW: Set flag to indicate this is back button navigation
        sessionStorage.setItem('wasBackButtonNavigation', 'true');
        console.log('🏠 Redirecting to /home via back button');
        
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 10);
        
        setTimeout(() => {
          window.history.pushState({ preventBack: true }, '', window.location.href);
        }, 20);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [navigate]);
};
