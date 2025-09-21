import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Ui from './pages/Ui.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Views from './Views.jsx'
import Home from '../Home/Home.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/views" element={<Views />} />
        
        
        
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
