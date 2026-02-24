import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FilterTabs from '../components/ui/FilterTabs'
import { getSellerProfile, getSellerStats, getSellerOrders, getSellerListings, updateOrderStatus } from '../services/seller'

const SERVICE_LABELS = { guide: 'Гид', equipment: 'Снаряжение', transfer: 'Трансфер', housing: 'Жильё' }
const STATUS_CONFIG = {
  pending:   { label: 'Ожидает',      bg: '#FFF3E0', color: '#FF9500' },
  confirmed: { label: 'Подтверждён',  bg: '#E8F5E9', color: '#34C759' },
  rejected:  { label: 'Отклонён',     bg: '#FFEBEE', color: '#FF3B30' },
  cancelled: { label: 'Отменён',      bg: '#F5F5F5',  color: '#999'   },
  completed: { label: 'Завершён',     bg: '#F5F5F5',  color: '#666'   },
}

const statusFilters = [
  { label: 'Все',          value: 'all'       },
  { label: 'Ожидают',      value: 'pending'   },
  { label: 'Подтверждены', value: 'confirmed' },
]

function StatCard({ label, value, color }) {
  return (
    <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
      <p className="text-xl font-bold" style={{ color: color || 'var(--color-text)' }}>{value}</p>
      <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
    </div>
  )
}

function OrderCard({ order, onConfirm, onReject }) {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
  const dateStr = order.dateStart
    ? new Date(order.dateStart).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    : '—'

  return (
    <div className="rounded-2xl p-4" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{order.serviceLabel}</span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: status.bg, color: status.color }}>{status.label}</span>
        </div>
        <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
          {(order.totalPrice || 0).toLocaleString()} тг
        </span>
      </div>
      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
        {order.clientName}{order.clientUsername ? ` (@${order.clientUsername})` : ''} · {dateStr}
        {order.personsCount > 1 ? ` · ${order.personsCount} чел.` : ''}
      </p>
      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{order.tripTitle}</p>

      {order.status === 'pending' && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => onConfirm(order.id)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold border-none cursor-pointer"
            style={{ background: '#34C759', color: '#fff' }}>
            Подтвердить
          </button>
          <button onClick={() => onReject(order.id)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold border-none cursor-pointer"
            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>
            Отклонить
          </button>
        </div>
      )}
    </div>
  )
}

function ListingItem({ listing }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--color-bg-secondary)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: listing.isActive ? '#E8F5E9' : '#F5F5F5', color: listing.isActive ? '#34C759' : '#999' }}>
        <span className="text-[10px] font-bold">{SERVICE_LABELS[listing.type]?.[0] || '?'}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{listing.name}</p>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {(listing.price || 0).toLocaleString()} тг/{listing.priceUnit} · {listing.rating > 0 ? `★ ${listing.rating}` : '—'}
        </p>
      </div>
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: listing.isActive ? '#34C759' : '#ccc' }} />
    </div>
  )
}

export default function SellerDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [seller,    setSeller]    = useState(null)
  const [stats,     setStats]     = useState({ pending: 0, totalOrders: 0, totalRevenue: 0 })
  const [orders,    setOrders]    = useState([])
  const [listings,  setListings]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [notSeller, setNotSeller] = useState(false)
  const [filter,    setFilter]    = useState('all')

  useEffect(() => {
    if (!user) { setLoading(false); return }
    getSellerProfile(user.id)
      .then(profile => {
        if (!profile) { setNotSeller(true); setLoading(false); return }
        setSeller(profile)
        return Promise.all([
          getSellerStats(profile.id),
          getSellerOrders(profile.id),
          getSellerListings(profile.id),
        ]).then(([st, ord, lst]) => {
          setStats(st)
          setOrders(ord)
          setListings(lst)
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  async function handleConfirm(orderId) {
    try {
      await updateOrderStatus(orderId, 'confirmed')
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'confirmed' } : o))
      setStats(prev => ({ ...prev, pending: Math.max(0, prev.pending - 1), totalOrders: prev.totalOrders + 1 }))
    } catch (err) { console.error(err) }
  }

  async function handleReject(orderId) {
    try {
      await updateOrderStatus(orderId, 'rejected')
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'rejected' } : o))
      setStats(prev => ({ ...prev, pending: Math.max(0, prev.pending - 1) }))
    } catch (err) { console.error(err) }
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--color-text-secondary)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  // Не авторизован
  if (!user) {
    return (
      <div className="flex flex-col h-full" style={{ background: 'var(--color-bg)' }}>
        <div className="flex-shrink-0 px-5 pt-4 pb-3 flex items-center gap-3"
          style={{ borderBottom: '1px solid var(--color-bg-secondary)' }}>
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer"
            style={{ background: 'var(--color-bg-secondary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-[17px] font-bold" style={{ color: 'var(--color-text)' }}>Кабинет продавца</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.2" className="mb-4" style={{ opacity: 0.4 }}>
            <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <p className="text-base font-medium" style={{ color: 'var(--color-text)' }}>Авторизуйтесь через Telegram</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Для доступа к кабинету продавца нужна авторизация</p>
        </div>
      </div>
    )
  }

  // Не продавец
  if (notSeller) {
    return (
      <div className="flex flex-col h-full" style={{ background: 'var(--color-bg)' }}>
        <div className="flex-shrink-0 px-5 pt-4 pb-3 flex items-center gap-3"
          style={{ borderBottom: '1px solid var(--color-bg-secondary)' }}>
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer"
            style={{ background: 'var(--color-bg-secondary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-[17px] font-bold" style={{ color: 'var(--color-text)' }}>Кабинет продавца</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.2" className="mb-4" style={{ opacity: 0.4 }}>
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
          </svg>
          <p className="text-base font-medium" style={{ color: 'var(--color-text)' }}>Вы не зарегистрированы как продавец</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Чтобы стать продавцом, свяжитесь с администрацией AlaTau
          </p>
        </div>
      </div>
    )
  }

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
          <h1 className="text-[17px] font-bold truncate" style={{ color: 'var(--color-text)' }}>Кабинет продавца</h1>
          <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>
            {seller?.is_verified ? 'Верифицирован' : 'Не верифицирован'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

        {/* Статистика */}
        <div className="flex gap-3">
          <StatCard label="Ожидают" value={stats.pending} color="#FF9500" />
          <StatCard label="Заказов" value={stats.totalOrders} color="#34C759" />
          <StatCard label="Доход" value={`${(stats.totalRevenue / 1000).toFixed(0)}K`} />
        </div>

        {/* Заказы */}
        <div>
          <p className="text-sm font-semibold mb-3 px-1" style={{ color: 'var(--color-text)' }}>Заказы</p>
          <FilterTabs tabs={statusFilters} activeTab={filter} onTabChange={setFilter} />
          <div className="mt-3 space-y-3">
            {filteredOrders.length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: 'var(--color-text-secondary)' }}>
                Нет заказов{filter !== 'all' ? ' с таким статусом' : ''}
              </p>
            ) : (
              filteredOrders.map(o => (
                <OrderCard key={o.id} order={o} onConfirm={handleConfirm} onReject={handleReject} />
              ))
            )}
          </div>
        </div>

        {/* Мои услуги */}
        <div>
          <p className="text-sm font-semibold mb-2 px-1" style={{ color: 'var(--color-text)' }}>Мои услуги</p>
          <div className="rounded-2xl px-4" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
            {listings.length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: 'var(--color-text-secondary)' }}>Нет добавленных услуг</p>
            ) : (
              listings.map(l => <ListingItem key={`${l.type}-${l.id}`} listing={l} />)
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
