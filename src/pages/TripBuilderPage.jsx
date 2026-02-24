import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getRoute, getGuidesForRoute, createTrip,
} from '../services/tripBuilder'

const difficultyLabels = { easy: 'Лёгкий', medium: 'Средний', hard: 'Сложный' }
const difficultyColors = { easy: '#34C759', medium: '#FF9500', hard: '#FF3B30' }

// ── Переиспользуемые UI-блоки ──────────────────────────────

function SectionHeader({ icon, title, count }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span style={{ color: 'var(--color-text-secondary)' }}>{icon}</span>
        <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>{title}</h3>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>
          опционально
        </span>
      </div>
      {count > 0 && (
        <span className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ background: '#34C759' }}>
          +{count}
        </span>
      )}
    </div>
  )
}

function EmptySection({ text }) {
  return (
    <p className="text-sm py-3 text-center" style={{ color: 'var(--color-text-secondary)' }}>{text}</p>
  )
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="#F0C14B" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}

// ── Карточки выбора ────────────────────────────────────────

function GuideSelectCard({ guide, selected, onToggle }) {
  return (
    <button
      onClick={() => onToggle(guide)}
      className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98]"
      style={{
        background: selected ? 'var(--color-primary)' : 'var(--color-card)',
        boxShadow: 'var(--shadow-card)',
        border: selected ? '2px solid var(--color-primary)' : '2px solid transparent',
      }}
    >
      <div className="flex gap-3 items-center">
        <img src={guide.avatar} alt={guide.name} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[14px]" style={{ color: selected ? '#fff' : 'var(--color-text)' }}>{guide.name}</p>
          <p className="text-xs mt-0.5" style={{ color: selected ? 'rgba(255,255,255,0.7)' : 'var(--color-text-secondary)' }}>
            {guide.specialization} · {guide.experience}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {guide.languages.slice(0, 2).map(l => (
              <span key={l} className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{ background: selected ? 'rgba(255,255,255,0.2)' : 'var(--color-bg-secondary)', color: selected ? '#fff' : 'var(--color-text-secondary)' }}>
                {l}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            <StarIcon />
            <span className="text-xs font-bold" style={{ color: selected ? '#F0C14B' : 'var(--color-text)' }}>{guide.rating}</span>
          </div>
          <span className="text-sm font-bold" style={{ color: selected ? '#fff' : 'var(--color-text)' }}>
            {guide.price.toLocaleString()} тг
          </span>
          <span className="text-[10px]" style={{ color: selected ? 'rgba(255,255,255,0.6)' : 'var(--color-text-secondary)' }}>/чел</span>
        </div>
      </div>
    </button>
  )
}

// ── Главная страница ───────────────────────────────────────

export default function TripBuilderPage() {
  const { routeId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [route,         setRoute]         = useState(null)
  const [guides,        setGuides]        = useState([])
  const [loading,       setLoading]       = useState(true)

  const [date,          setDate]          = useState('')
  const [persons,       setPersons]       = useState(1)
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [creating,      setCreating]      = useState(false)
  const [error,         setError]         = useState('')

  useEffect(() => {
    Promise.all([
      getRoute(routeId),
      getGuidesForRoute(routeId),
    ])
      .then(([r, g]) => { setRoute(r); setGuides(g) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [routeId])

  const total = useMemo(() => {
    return selectedGuide ? selectedGuide.price * persons : 0
  }, [selectedGuide, persons])

  async function handleCreate() {
    if (!date) { setError('Выберите дату похода'); return }
    if (!user) { setError('Авторизация через Telegram'); return }
    setError('')
    setCreating(true)
    try {
      const trip = await createTrip({
        userId: user.id, routeId, routeTitle: route.title,
        date, persons,
        selectedGuide, selectedEquipment: [], selectedTransfer: null, selectedHousing: null, total,
      })
      navigate(`/payment/${trip.id}`)
    } catch (err) {
      console.error(err)
      setError('Ошибка создания поездки')
    } finally {
      setCreating(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--color-text-secondary)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!route) return null

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-bg)' }}>

      {/* ── Шапка ── */}
      <div className="flex-shrink-0 px-5 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-bg-secondary)' }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer flex-shrink-0"
          style={{ background: 'var(--color-bg-secondary)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2.5">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="text-[17px] font-bold truncate" style={{ color: 'var(--color-text)' }}>Собрать поездку</h1>
          <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>{route.title}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ── Карточка маршрута ── */}
        <div className="px-5 mt-4">
          <div className="rounded-2xl overflow-hidden relative h-36" style={{ boxShadow: 'var(--shadow-card)' }}>
            {(route.images_json || [])[0] && (
              <img src={route.images_json[0]} alt={route.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="text-xs font-medium px-2.5 py-1 rounded-lg text-white"
                style={{ background: difficultyColors[route.difficulty] }}>
                {difficultyLabels[route.difficulty]}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white font-bold text-base">{route.title}</p>
              <div className="flex gap-3 mt-1">
                {route.distance_km && <span className="text-white/70 text-xs">{route.distance_km} км</span>}
                {route.elevation_m && <span className="text-white/70 text-xs">{route.elevation_m} м</span>}
              </div>
            </div>
          </div>
        </div>

        {/* ── Дата и кол-во человек ── */}
        <div className="px-5 mt-5">
          <div className="rounded-2xl p-4" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
            <h3 className="text-base font-bold mb-3" style={{ color: 'var(--color-text)' }}>Когда и сколько</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Дата похода</label>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium border-none outline-none"
                  style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Количество человек</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setPersons(p => Math.max(1, p - 1))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer font-bold text-lg"
                    style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}>−</button>
                  <span className="flex-1 text-center text-base font-bold" style={{ color: 'var(--color-text)' }}>{persons}</span>
                  <button onClick={() => setPersons(p => Math.min(20, p + 1))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer font-bold text-lg"
                    style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}>+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Гиды ── */}
        <div className="px-5 mt-5">
          <SectionHeader icon="🧗" title="Гид" count={selectedGuide ? 1 : 0} />
          {guides.length === 0
            ? <EmptySection text="Нет гидов для этого маршрута" />
            : <div className="space-y-3">
                {guides.map(g => (
                  <GuideSelectCard key={g.id} guide={g} selected={selectedGuide?.id === g.id}
                    onToggle={g => setSelectedGuide(prev => prev?.id === g.id ? null : g)} />
                ))}
              </div>
          }
        </div>

      </div>

      {/* ── Футер ── */}
      <div className="flex-shrink-0 px-5 pb-6 pt-4"
        style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--color-bg-secondary)' }}>
        {error && (
          <p className="text-sm text-center mb-2" style={{ color: '#FF3B30' }}>{error}</p>
        )}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Итого:</span>
          <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
            {total > 0 ? `${total.toLocaleString()} тг` : '—'}
          </span>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating || total === 0}
          className="w-full py-4 rounded-2xl text-base font-bold border-none cursor-pointer transition-opacity active:scale-[0.98]"
          style={{
            background: total > 0 ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
            color: total > 0 ? '#fff' : 'var(--color-text-secondary)',
            opacity: creating ? 0.7 : 1,
          }}
        >
          {creating ? 'Создаём поездку...' : total > 0 ? 'Перейти к оплате' : 'Добавьте хотя бы одну услугу'}
        </button>
      </div>

    </div>
  )
}
