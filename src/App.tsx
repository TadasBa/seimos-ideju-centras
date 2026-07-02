import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { DayCenterPage } from './pages/DayCenterPage'
import { HousingPage } from './pages/HousingPage'
import { SupervisionPage } from './pages/SupervisionPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { PressPage } from './pages/PressPage'
import { SupportPage } from './pages/SupportPage'
import { GpmPage } from './pages/GpmPage'
import { ReportsPage } from './pages/ReportsPage'
import { ContactsPage } from './pages/ContactsPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="apie-mus" element={<AboutPage />} />
        <Route path="vaiku-dienos-centras" element={<DayCenterPage />} />
        <Route path="apsaugotas-bustas" element={<HousingPage />} />
        <Route path="supervizija" element={<SupervisionPage />} />
        {/* Old WordPress slug, kept so existing links don't break */}
        <Route path="supervizija-profesiniu-santykiu-konsultavimas" element={<SupervisionPage />} />
        <Route path="projektai" element={<ProjectsPage />} />
        <Route path="spaudoje" element={<PressPage />} />
        <Route path="parama" element={<SupportPage />} />
        <Route path="skirti-1-2-gpm" element={<GpmPage />} />
        <Route path="ataskaitos-dokumentai" element={<ReportsPage />} />
        <Route path="kontaktai" element={<ContactsPage />} />
        <Route path="privatumo-politika" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
