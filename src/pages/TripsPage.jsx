import { useState, useEffect } from 'react'
import PageHeader from '../components/layout/PageHeader'
import FilterTabs from '../components/ui/FilterTabs'
import TripCard from '../components/trips/TripCard'
import { useAuth } from '../context/AuthContext'
import { getTrips } from '../services/trips'

const filters = [
  { label: 'Все',          value: 'all'       },
  { label: 'Подтверждены', value: 'confirmed' },
  { label: 'Ожидают',      value: 'pending'   },
  { label: 'Завершены',    value: 'completed' },
]

export default function TripsPage() {
  const { user } = useAuth()
  const [filter,  setFilter]  = useState('all')
  const [trips,   setTrips]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      // Dev-режим: мок-поездки для просмотра в браузере
      setTrips([
        {
          id: 'demo-1',
          routeTitle: 'Бутаковский водопад',
          date: '15 марта 2026',
          status: 'confirmed',
          guide: 'Айгерим Турсын',
          services: ['Гид'],
          totalPrice: 15000,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
        },
        {
          id: 'demo-2',
          routeTitle: 'Пик Фурманова',
          date: '22 марта 2026',
          status: 'pending',
          guide: 'Нурлан Серкебаев',
          services: ['Гид'],
          totalPrice: 20000,
          image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
        },
        {
          id: 'demo-3',
          routeTitle: 'Большое Алматинское озеро',
          date: '5 февраля 2026',
          status: 'completed',
          guide: 'Айгерим Турсын',
          services: ['Гид'],
          totalPrice: 15000,
          image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400&q=80',
        },
      ])
      setLoading(false)
      return
    }
    setLoading(true)
    getTrips(user.id)
      .then(data => setTrips(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  const filtered = filter === 'all' ? trips : trips.filter(t => t.status === filter)

  return (
    <div>
      <PageHeader title="Мои поездки" subtitle="Управляй своими приключениями" />
      <FilterTabs tabs={filters} activeTab={filter} onTabChange={setFilter} />
      <div className="px-5 mt-5 space-y-4 pb-6">
        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-full border-2 mx-auto animate-spin"
              style={{ borderColor: 'var(--color-text-secondary)', borderTopColor: 'transparent' }} />
          </div>
        )}
        {!loading && filtered.map(trip => (
          <TripCard key={trip.id} trip={trip} />
        ))}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" className="mx-auto mb-3">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <p className="text-base font-medium" style={{ color: 'var(--color-text)' }}>Нет поездок</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Соберите первую поездку в Маршрутах</p>
          </div>
        )}
      </div>
    </div>
  )
}
