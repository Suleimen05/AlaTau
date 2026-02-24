import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTripForPayment, payTrip } from '../services/tripBuilder'

const SERVICE_LABELS = { guide: 'Гид', equipment: 'Снаряжение', transfer: 'Трансфер', housing: 'Жильё' }

const DEMO_TRIPS = {
  'demo-2': {
    id: 'demo-2',
    status: 'pending',
    date_start: '2026-03-22',
    persons_count: 1,
    total_price: 20000,
    routes: {
      title: 'Пик Фурманова',
      images_json: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'],
    },
    trip_items: [
      { service_type: 'guide', unit_price: 20000, quantity: 1, total_price: 20000 },
    ],
  },
}

export default function PaymentPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const marketplaceTrip = location.state?.marketplaceTrip
  const isDemo = !!DEMO_TRIPS[tripId] || !!marketplaceTrip
  const isMarketplace = !!marketplaceTrip

  const [trip,    setTrip]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying,  setPaying]  = useState(false)
  const [paid,    setPaid]    = useState(false)

  useEffect(() => {
    if (marketplaceTrip) {
      setTrip(marketplaceTrip)
      setLoading(false)
      return
    }
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

  async function handlePay() {
    if (!trip) return
    setPaying(true)
    try {
      await new Promise(r => setTimeout(r, 2000))
      if (!isDemo) {
        await payTrip(tripId, user.id, trip.total_price)
      }
      setPaid(true)
      setTimeout(() => navigate(isMarketplace ? '/marketplace' : '/trips', { replace: true }), 1500)
    } catch (err) {
      console.error(err)
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--color-text-secondary)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  // ── Экран успешной оплаты ──────────────────────────────
  if (paid) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center"
        style={{ background: 'var(--color-bg)' }}>
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: '#E8F5E9' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Оплата прошла!</h1>
        <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
          {isMarketplace ? 'Услуга успешно забронирована' : 'Поездка добавлена в «Мои поездки»'}
        </p>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {isMarketplace ? 'Продавец получит уведомление и подтвердит бронь' : 'Продавцы получат уведомление и подтвердят бронь'}
        </p>
        <div className="mt-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#34C759' }} />
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {isMarketplace ? 'Переходим в маркетплейс...' : 'Переходим к поездкам...'}
          </span>
        </div>
      </div>
    )
  }

  // ── Экран оплаты ──────────────────────────────────────
  const routeImage = (trip?.routes?.images_json || [])[0]
  const items = trip?.trip_items || []

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
        <h1 className="text-[17px] font-bold" style={{ color: 'var(--color-text)' }}>Оплата</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

        {/* Карточка поездки */}
        <div className="rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          {routeImage && (
            <div className="relative h-40">
              <img src={routeImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-white font-bold text-base">{trip?.routes?.title}</p>
                <p className="text-white/70 text-xs mt-0.5">
                  {trip?.date_start
                    ? new Date(trip.date_start).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                    : ''}
                  {trip?.persons_count > 1 ? ` · ${trip.persons_count} чел.` : ''}
                </p>
              </div>
            </div>
          )}
          <div className="p-4" style={{ background: 'var(--color-card)' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Состав поездки</p>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {SERVICE_LABELS[item.service_type] || item.service_type}
                    {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                  </span>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    {(item.total_price || item.unit_price * item.quantity).toLocaleString()} тг
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-bg-secondary)' }}>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold" style={{ color: 'var(--color-text)' }}>Итого</span>
                <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {(trip?.total_price || 0).toLocaleString()} тг
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mock Kaspi Pay */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Способ оплаты</p>
          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'var(--color-bg-secondary)', border: '2px solid #E30613' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#E30613' }}>
              <span className="text-white font-black text-[11px] leading-none">kaspi</span>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Kaspi Pay</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Быстрая оплата через Kaspi</p>
            </div>
            <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: '#E30613' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Инфо */}
        <div className="flex items-start gap-2 px-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            После оплаты продавцы получат заявку и подтвердят бронирование в течение 24 часов.
          </p>
        </div>

      </div>

      {/* Кнопка оплаты */}
      <div className="flex-shrink-0 px-5 pb-8 pt-4"
        style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--color-bg-secondary)' }}>
        <button
          onClick={handlePay}
          disabled={paying}
          className="w-full py-4 rounded-2xl text-base font-bold border-none cursor-pointer active:scale-[0.98] transition-all"
          style={{ background: '#E30613', color: '#fff', opacity: paying ? 0.8 : 1 }}
        >
          {paying ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
              Обрабатываем...
            </span>
          ) : (
            `Оплатить ${(trip?.total_price || 0).toLocaleString()} тг`
          )}
        </button>
      </div>

    </div>
  )
}
