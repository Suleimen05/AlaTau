import { useNavigate } from 'react-router-dom'

const DEMO_BOOKINGS = [
  {
    id: 1,
    type: 'guide',
    title: 'Айгерим Турсын',
    subtitle: 'Горный туризм',
    date: '2026-02-20',
    price: 15000,
    status: 'paid',
  },
  {
    id: 2,
    type: 'equipment',
    title: 'Треккинговые палки Black Diamond',
    subtitle: 'Снаряжение',
    date: '2026-02-18',
    price: 3500,
    status: 'paid',
  },
  {
    id: 3,
    type: 'transfer',
    title: 'Алматы → Большое Алматинское озеро',
    subtitle: 'Трансфер',
    date: '2026-02-25',
    price: 8000,
    status: 'pending',
  },
  {
    id: 4,
    type: 'housing',
    title: 'Горный приют «Эдельвейс»',
    subtitle: 'Жильё',
    date: '2026-01-10',
    price: 12000,
    status: 'cancelled',
  },
]

const TYPE_ICONS = {
  guide: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  equipment: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /></svg>,
  transfer: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
  housing: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
}

const STATUS_CONFIG = {
  paid:      { label: 'Оплачено', bg: '#E8F5E9', color: '#34C759' },
  pending:   { label: 'Ожидает',  bg: '#FFF3E0', color: '#FF9500' },
  cancelled: { label: 'Отменено', bg: '#F5F5F5',  color: '#999'    },
}

function BookingCard({ booking, onClick }) {
  const status = STATUS_CONFIG[booking.status]
  const dateStr = new Date(booking.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div onClick={onClick} className="rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>
          {TYPE_ICONS[booking.type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>{booking.title}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{booking.subtitle}</p>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ background: status.bg, color: status.color }}>
          {status.label}
        </span>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--color-bg-secondary)' }}>
        <div className="flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2">
            <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{dateStr}</span>
        </div>
        <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{booking.price.toLocaleString()} тг</span>
      </div>
    </div>
  )
}

export default function BookingHistoryPage() {
  const navigate = useNavigate()
  const bookings = DEMO_BOOKINGS

  const totalPaid = bookings
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.price, 0)

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
          <h1 className="text-[17px] font-bold truncate" style={{ color: 'var(--color-text)' }}>История бронирований</h1>
          <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>
            {bookings.length > 0 ? `${bookings.length} записей` : 'Пока пусто'}
          </p>
        </div>
      </div>

      {/* Контент */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

        {/* Сводка */}
        {bookings.length > 0 && (
          <div className="rounded-2xl p-4 relative overflow-hidden" style={{ background: 'var(--color-primary)' }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20" style={{ background: '#fff', transform: 'translate(30%, -30%)' }} />
            <p className="text-sm font-medium text-white/80">Потрачено всего</p>
            <p className="text-2xl font-bold text-white mt-1">{totalPaid.toLocaleString()} тг</p>
            <p className="text-xs text-white/60 mt-1">{bookings.filter(b => b.status === 'paid').length} оплаченных бронирований</p>
          </div>
        )}

        {/* Список */}
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.2" className="mb-4" style={{ opacity: 0.4 }}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <p className="text-base font-medium" style={{ color: 'var(--color-text)' }}>Нет бронирований</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Здесь появится история ваших аренд и покупок
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-20">
            {bookings.map(b => (
              <BookingCard key={b.id} booking={b} onClick={() => navigate(`/booking/${b.id}`, { state: { booking: b } })} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
