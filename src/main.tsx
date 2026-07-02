import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Self-hosted fonts (latin + latin-ext for Lithuanian diacritics)
import '@fontsource-variable/bricolage-grotesque/index.css'
import '@fontsource-variable/inter/index.css'

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
