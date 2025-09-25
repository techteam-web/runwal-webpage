// hooks/useBackButtonOverride.js - SIMPLE SMOOTH TRANSITION
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useBackButtonOverride = () => {
  const navigate = useNavigate();

  // ✅ SIMPLE SMOOTH TRANSITION FUNCTION
  const createSmoothTransition = () => {
    // Get current page element
    const currentPage = document.querySelector('main, .page-container, [data-page], body > div:first-child');
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%);
      backdrop-filter: blur(8px);
      z-index: 999999;
      opacity: 0;
      transition: opacity 0.3s ease-out;
    `;
    document.body.appendChild(overlay);

    // ✅ ANIMATE IN
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      if (currentPage) {
        currentPage.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        currentPage.style.transform = 'translateX(-10px)';
        currentPage.style.opacity = '0.8';
      }
    });

    return { overlay, currentPage };
  };

  // ✅ CLEANUP TRANSITION
  const cleanupTransition = (overlay, currentPage) => {
    if (overlay && overlay.parentNode) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 300);
    }
    
    if (currentPage) {
      currentPage.style.transition = '';
      currentPage.style.transform = '';
      currentPage.style.opacity = '';
    }
  };

  useEffect(() => {
    const cameFromRoot = sessionStorage.getItem('cameFromRoot');
    
    if (cameFromRoot === 'true') {
      console.log('✅ Setting up smooth back button override');
      
      const currentUrl = window.location.href;
      window.history.replaceState({ ...window.history.state, preventBack: true }, '', currentUrl);
      window.history.pushState({ preventBack: true }, '', currentUrl);
      
      const handlePopState = (event) => {
        console.log('🔄 Back button pressed - starting smooth transition');
        
        // ✅ START SMOOTH TRANSITION
        const { overlay, currentPage } = createSmoothTransition();
        
        setTimeout(() => {
          sessionStorage.removeItem('cameFromRoot');
          sessionStorage.setItem('wasBackButtonNavigation', 'true');
          console.log('🏠 Navigating to /home smoothly');
          
          navigate('/home', { replace: true });
          
          // ✅ CLEANUP AFTER NAVIGATION
          setTimeout(() => {
            cleanupTransition(overlay, currentPage);
          }, 100);
          
        }, 250); // Wait for transition animation
        
        setTimeout(() => {
          window.history.pushState({ preventBack: true }, '', window.location.href);
        }, 400);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        console.log('🧹 Cleaning up smooth back button override');
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [navigate]);
};
