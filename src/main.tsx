import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Self-hosted fonts (latin + latin-ext for Lithuanian diacritics), the same
// three families the original seimosidejucentras.lt loads:
// Montserrat for text, TikTok Sans for the desktop menu, Open Sans for the
// mobile slide-out menu.
import '@fontsource-variable/montserrat/index.css'
import '@fontsource-variable/tiktok-sans/index.css'
import '@fontsource-variable/open-sans/index.css'

import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/home.css'
import './styles/pages.css'

import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
