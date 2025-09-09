import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Force scroll position to top on load/refresh and disable browser restoration
if (typeof window !== 'undefined') {
  try {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
