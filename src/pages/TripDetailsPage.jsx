import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTripForPayment } from '../services/tripBuilder'
import { useAuth } from '../context/AuthContext'
import ReviewForm from '../components/reviews/ReviewForm'

const SERVICE_LABELS = { guide: 'Гид', equipment: 'Снаряжение', transfer: 'Трансфер', housing: 'Жильё' }
const SERVICE_ICONS = {
  guide: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  equipment: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /></svg>,
  transfer: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
  housing: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
}

const statusLabels = { draft: 'Черновик', pending: 'Ожидает оплаты', confirmed: 'Подтверждено', completed: 'Завершено' }
const statusColors = { draft: '#8E8E93', pending: '#FF9500', confirmed: '#34C759', completed: '#8E8E93' }

// Мок-данные для dev-режима (без Supabase)
const DEMO_TRIPS = {
  'demo-1': {
    id: 'demo-1',
    status: 'confirmed',
    date_start: '2026-03-15',
    persons_count: 1,
    total_price: 15000,
    routes: {
      title: 'Бутаковский водопад',
      images_json: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'],
      difficulty: 'medium',
      distance_km: 14,
      elevation_m: 3050,
    },
    trip_items: [
      { service_type: 'guide', unit_price: 15000, quantity: 1, total_price: 15000 },
    ],
  },
  'demo-2': {
    id: 'demo-2',
    status: 'pending',
    date_start: '2026-03-22',
    persons_count: 1,
    total_price: 20000,
    routes: {
      title: 'Пик Фурманова',
      images_json: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'],
      difficulty: 'hard',
      distance_km: 18,
      elevation_m: 3050,
    },
    trip_items: [
      { service_type: 'guide', unit_price: 20000, quantity: 1, total_price: 20000 },
    ],
  },
  'demo-3': {
    id: 'demo-3',
    status: 'completed',
    route_id: '10000000-0000-0000-0000-000000000001',
    date_start: '2026-02-05',
    persons_count: 1,
    total_price: 15000,
    routes: {
      title: 'Большое Алматинское озеро',
      images_json: ['https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80'],
      difficulty: 'easy',
      distance_km: 10,
      elevation_m: 2511,
    },
    trip_items: [
      { service_type: 'guide', unit_price: 15000, quantity: 1, total_price: 15000 },
    ],
  },
}

export default function TripDetailsPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReview, setShowReview] = useState(false)
  const [reviewSent, setReviewSent] = useState(false)

  useEffect(() => {
    if (DEMO_TRIPS[tripId]) {
      setTrip(DEMO_TRIPS[tripId])
      setLoading(false)
      return
    }
    getTripForPayment(tripId)
      .then(data => setTrip(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [tripId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--color-text-secondary)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!trip) return null

  const routeImage = (trip.routes?.images_json || [])[0]
  const items = trip.trip_items || []
  const dateStr = trip.date_start
    ? new Date(trip.date_start).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-bg)' }}>

      {/* Шапка */}
      <div className="flex-shrink-0 px-5 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-bg-secondary)' }}>
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer flex-shrink-0"
          style={{ background: 'var(--color-bg-secondary)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2.5">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="text-[17px] font-bold truncate" style={{ color: 'var(--color-text)' }}>Детали поездки</h1>
          <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>{trip.routes?.title}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

        {/* Фото маршрута */}
        {routeImage && (
          <div className="rounded-2xl overflow-hidden relative h-44" style={{ boxShadow: 'var(--shadow-card)' }}>
            <img src={routeImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ background: statusColors[trip.status] }}>
                {statusLabels[trip.status]}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white font-bold text-lg">{trip.routes?.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                  <span className="text-white/80 text-xs">{dateStr}</span>
                </div>
                {trip.persons_count > 0 && (
                  <div className="flex items-center gap-1">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    <span className="text-white/80 text-xs">{trip.persons_count} чел.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Информация о маршруте */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Маршрут</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2"><path d="m8 3 4 8 5-5 5 15H2L8 3z" /></svg>
              <span className="text-sm" style={{ color: 'var(--color-text)' }}>{trip.routes?.title}</span>
            </div>
          </div>
          {(trip.routes?.distance_km || trip.routes?.elevation_m) && (
            <div className="flex items-center gap-4 mt-2">
              {trip.routes?.distance_km && (
                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{trip.routes.distance_km} км</span>
              )}
              {trip.routes?.elevation_m && (
                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{trip.routes.elevation_m} м</span>
              )}
            </div>
          )}
        </div>

        {/* Состав поездки */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Состав поездки</p>
          {items.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Нет добавленных услуг</p>
          ) : (
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>
                    {SERVICE_ICONS[item.service_type] || null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      {SERVICE_LABELS[item.service_type] || item.service_type}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>× {item.quantity}</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                    {(item.total_price || item.unit_price * item.quantity).toLocaleString()} тг
                  </span>
                </div>
              ))}
              <div className="pt-3 mt-1" style={{ borderTop: '1px solid var(--color-bg-secondary)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold" style={{ color: 'var(--color-text)' }}>Итого</span>
                  <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                    {(trip.total_price || 0).toLocaleString()} тг
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Инфо о статусе */}
        {trip.status === 'confirmed' && (
          <div className="flex items-start gap-2 px-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Бронирование подтверждено. Приятного путешествия!
            </p>
          </div>
        )}
        {trip.status === 'pending' && (
          <div className="flex items-start gap-2 px-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Ожидает оплаты. После оплаты продавцы подтвердят бронь в течение 24 часов.
            </p>
          </div>
        )}

        {/* Форма отзыва для завершённых поездок */}
        {trip.status === 'completed' && showReview && !reviewSent && (
          <ReviewForm
            userId={user?.id}
            tripId={trip.id}
            reviewableType="route"
            reviewableId={trip.route_id}
            onSubmitted={() => { setReviewSent(true); setShowReview(false) }}
            onCancel={() => setShowReview(false)}
          />
        )}

      </div>

      {/* Футер */}
      <div className="flex-shrink-0 px-5 pb-24 pt-4"
        style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--color-bg-secondary)' }}>
        {trip.status === 'pending' && (
          <button
            onClick={() => navigate(`/payment/${trip.id}`)}
            className="w-full py-4 rounded-2xl text-base font-bold border-none cursor-pointer active:scale-[0.98] transition-transform"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
          >
            Оплатить {(trip.total_price || 0).toLocaleString()} тг
          </button>
        )}
        {trip.status === 'confirmed' && (
          <button
            disabled
            className="w-full py-4 rounded-2xl text-base font-bold border-none"
            style={{ background: '#E8F5E9', color: '#34C759' }}
          >
            ✓ Поездка подтверждена
          </button>
        )}
        {trip.status === 'completed' && !reviewSent && (
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full py-4 rounded-2xl text-base font-bold border-none cursor-pointer active:scale-[0.98] transition-transform"
            style={{ background: showReview ? 'var(--color-bg-secondary)' : '#34C759', color: showReview ? 'var(--color-text-secondary)' : '#fff' }}
          >
            {showReview ? 'Скрыть' : 'Оставить отзыв'}
          </button>
        )}
        {trip.status === 'completed' && reviewSent && (
          <button disabled
            className="w-full py-4 rounded-2xl text-base font-bold border-none"
            style={{ background: '#E8F5E9', color: '#34C759' }}>
            Отзыв отправлен
          </button>
        )}
      </div>

    </div>
  )
}
