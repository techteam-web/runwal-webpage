import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Map from "./pages/Map/Map";
import Inventory from "./pages/Inventory/Inventory";
import Home from "./pages/Home/Home";
import Views from "./pages/Views/Views";
import { Routes, Route } from "react-router-dom";
import { AudioProvider } from './pages/Home/Component/AudioContext.jsx'
import Page from './pages/Home/Page.jsx'
import Iso from './pages/Iso/Iso.jsx'


// Force scroll position to top on load/refresh and disable browser restoration
if (typeof window !== 'undefined') {
  try {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto'
    }
  } catch {
    // ignore
  }

  const resetToTop = () => {
    // Run twice to defeat bfcache/layout timing
    window.scrollTo(0, 0)
    if (document && document.documentElement) document.documentElement.scrollTop = 0
    if (document && document.body) document.body.scrollTop = 0
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
      if (document && document.documentElement) document.documentElement.scrollTop = 0
      if (document && document.body) document.body.scrollTop = 0
    })
  }

  // Initial load
  if (document.readyState === 'complete') {
    resetToTop()
  } else {
    window.addEventListener('load', resetToTop, { once: true })
  }

  // Back-forward cache restore
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) resetToTop()
  })
}

// Wrapper component that forces fresh mount of Views
function ViewsWrapper() {
  const location = useLocation();
  const [mountKey, setMountKey] = useState(0);
  
  // Generate new key every time we navigate to Views
  useEffect(() => {
    setMountKey(prev => prev + 1);
  }, [location.pathname]);
  
  return <Views key={`views-${mountKey}`} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <AudioProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Page />} />
      <Route path="/map" element={<Map />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/views" element={<Views />} />
      <Route path="/iso" element={<Iso />} />
    </Routes>
    </AudioProvider>
  </BrowserRouter>
  </StrictMode>
)
