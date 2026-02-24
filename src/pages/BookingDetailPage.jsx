import { useNavigate, useLocation } from 'react-router-dom'

const TYPE_LABELS = { guide: 'Гид', equipment: 'Снаряжение', transfer: 'Трансфер', housing: 'Жильё' }
const TYPE_ICONS = {
  guide: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  equipment: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /></svg>,
  transfer: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
  housing: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
}

const STATUS_CONFIG = {
  paid:      { label: 'Оплачено',  bg: '#E8F5E9', color: '#34C759' },
  pending:   { label: 'Ожидает оплаты', bg: '#FFF3E0', color: '#FF9500' },
  cancelled: { label: 'Отменено',  bg: '#F5F5F5',  color: '#999'    },
}

export default function BookingDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking = location.state?.booking

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center" style={{ background: 'var(--color-bg)' }}>
        <p className="text-base font-medium" style={{ color: 'var(--color-text)' }}>Бронирование не найдено</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm font-semibold border-none bg-transparent cursor-pointer" style={{ color: 'var(--color-primary)' }}>
          Назад
        </button>
      </div>
    )
  }

  const status = STATUS_CONFIG[booking.status]
  const dateStr = new Date(booking.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

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
          <h1 className="text-[17px] font-bold truncate" style={{ color: 'var(--color-text)' }}>Детали бронирования</h1>
          <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>{booking.title}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

        {/* Карточка услуги */}
        <div className="rounded-2xl overflow-hidden relative h-44" style={{ background: 'var(--color-primary)', boxShadow: 'var(--shadow-card)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: '#fff', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full opacity-10" style={{ background: '#fff', transform: 'translate(-30%, 30%)' }} />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: status.bg, color: status.color }}>
              {status.label}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                {TYPE_ICONS[booking.type]}
              </div>
              <div>
                <p className="text-white font-bold text-lg">{booking.title}</p>
                <p className="text-white/70 text-sm mt-0.5">{booking.subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Информация */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Информация</p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>
                {TYPE_ICONS[booking.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Тип услуги</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{TYPE_LABELS[booking.type]}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Дата</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{dateStr}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Стоимость</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{booking.price.toLocaleString()} тг</p>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--color-bg-secondary)' }}>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold" style={{ color: 'var(--color-text)' }}>Итого</span>
              <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                {booking.price.toLocaleString()} тг
              </span>
            </div>
          </div>
        </div>

        {/* Статус инфо */}
        {booking.status === 'paid' && (
          <div className="flex items-start gap-2 px-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Бронирование оплачено и подтверждено.
            </p>
          </div>
        )}
        {booking.status === 'pending' && (
          <div className="flex items-start gap-2 px-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Ожидает оплаты. После оплаты продавец подтвердит бронь в течение 24 часов.
            </p>
          </div>
        )}
        {booking.status === 'cancelled' && (
          <div className="flex items-start gap-2 px-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Бронирование было отменено.
            </p>
          </div>
        )}
      </div>

      {/* Футер */}
      <div className="flex-shrink-0 px-5 pb-24 pt-4"
        style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--color-bg-secondary)' }}>
        {booking.status === 'pending' && (
          <button
            onClick={() => navigate(`/payment/booking-${booking.id}`, {
              state: {
                marketplaceTrip: {
                  id: `booking-${booking.id}`,
                  status: 'pending',
                  date_start: booking.date,
                  persons_count: 1,
                  total_price: booking.price,
                  routes: { title: booking.title, images_json: [''] },
                  trip_items: [{ service_type: booking.type, unit_price: booking.price, quantity: 1, total_price: booking.price }],
                }
              }
            })}
            className="w-full py-4 rounded-2xl text-base font-bold border-none cursor-pointer active:scale-[0.98] transition-transform"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
          >
            Оплатить {booking.price.toLocaleString()} тг
          </button>
        )}
        {booking.status === 'paid' && (
          <button disabled className="w-full py-4 rounded-2xl text-base font-bold border-none"
            style={{ background: '#E8F5E9', color: '#34C759' }}>
            Оплачено
          </button>
        )}
        {booking.status === 'cancelled' && (
          <button disabled className="w-full py-4 rounded-2xl text-base font-bold border-none"
            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>
            Отменено
          </button>
        )}
      </div>
    </div>
  )
}
