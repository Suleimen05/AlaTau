import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import TabBar from './components/layout/TabBar'
import LandingPage from './pages/LandingPage'
import RoutesPage from './pages/RoutesPage'
import MarketplacePage from './pages/MarketplacePage'
import TripsPage from './pages/TripsPage'
import ChallengesPage from './pages/ChallengesPage'
import ProfilePage from './pages/ProfilePage'
import TripBuilderPage from './pages/TripBuilderPage'
import PaymentPage from './pages/PaymentPage'
import TripDetailsPage from './pages/TripDetailsPage'
import BookingHistoryPage from './pages/BookingHistoryPage'
import BookingDetailPage from './pages/BookingDetailPage'
import NotificationsPage from './pages/NotificationsPage'
import SellerDashboardPage from './pages/SellerDashboardPage'
import SettingsPage from './pages/SettingsPage'

const fullscreenRoutes = ['/trip-builder', '/payment', '/trip/', '/booking-history', '/booking/', '/notifications', '/seller', '/settings']

function AppShell() {
  const [showLanding, setShowLanding] = useState(true)
  const location = useLocation()

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} />
  }

  const isFullscreen = fullscreenRoutes.some(r => location.pathname.startsWith(r))

  return (
    <div className="h-full" style={{ background: 'var(--color-bg)' }}>
      {isFullscreen ? (
        <Routes>
          <Route path="/trip-builder/:routeId" element={<TripBuilderPage />} />
          <Route path="/payment/:tripId"       element={<PaymentPage />} />
          <Route path="/trip/:tripId"          element={<TripDetailsPage />} />
          <Route path="/booking-history"       element={<BookingHistoryPage />} />
          <Route path="/booking/:bookingId"    element={<BookingDetailPage />} />
          <Route path="/notifications"         element={<NotificationsPage />} />
          <Route path="/seller"                element={<SellerDashboardPage />} />
          <Route path="/settings"              element={<SettingsPage />} />
        </Routes>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto pb-20">
            <Routes>
              <Route path="/"            element={<RoutesPage />}      />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/trips"       element={<TripsPage />}       />
              <Route path="/challenges"  element={<ChallengesPage />}  />
              <Route path="/profile"     element={<ProfilePage />}     />
              <Route path="*"            element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <TabBar />
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppShell />
      </FavoritesProvider>
    </AuthProvider>
  )
}

export default App
