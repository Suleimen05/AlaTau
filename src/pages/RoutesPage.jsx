import { useState, useEffect } from 'react'
import PageHeader from '../components/layout/PageHeader'
import FilterTabs from '../components/ui/FilterTabs'
import RouteCard from '../components/routes/RouteCard'
import FavoritesModal from '../components/routes/FavoritesModal'
import { useFavorites } from '../context/FavoritesContext'
import { getRoutes, getRegions } from '../services/routes'

const filters = [
  { label: 'Все',     value: 'all'    },
  { label: 'Лёгкие',  value: 'easy'   },
  { label: 'Средние', value: 'medium' },
  { label: 'Сложные', value: 'hard'   },
]

export default function RoutesPage() {
  const [search,        setSearch]        = useState('')
  const [difficulty,    setDifficulty]    = useState('all')
  const [region,        setRegion]        = useState('all')
  const [regions,       setRegions]       = useState([])
  const [routes,        setRoutes]        = useState([])
  const [loading,       setLoading]       = useState(true)
  const [showFavorites, setShowFavorites] = useState(false)
  const { favorites } = useFavorites()

  useEffect(() => {
    getRegions().then(r => setRegions(r)).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    getRoutes({ search, difficulty, region })
      .then(data => setRoutes(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, difficulty, region])

  const favCount = favorites.size

  return (
    <div>
      <PageHeader
        title="Маршруты"
        subtitle="Выбери свой путь в горы"
        action={
          <button
            onClick={() => setShowFavorites(true)}
            className="relative w-10 h-10 rounded-full flex items-center justify-center border-none cursor-pointer active:scale-90 transition-transform"
            style={{ background: 'var(--color-bg-secondary)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            {favCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1"
                style={{ background: '#FF3B30' }}>
                {favCount}
              </span>
            )}
          </button>
        }
      />
      <div className="px-5">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'var(--color-bg-secondary)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск маршрутов..."
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: 'var(--color-text)' }}
          />
        </div>
      </div>
      <div className="mt-4">
        <FilterTabs tabs={filters} activeTab={difficulty} onTabChange={setDifficulty} />
      </div>
      {regions.length > 1 && (
        <div className="mt-2">
          <FilterTabs
            tabs={[{ label: 'Все регионы', value: 'all' }, ...regions.map(r => ({ label: r, value: r }))]}
            activeTab={region}
            onTabChange={setRegion}
          />
        </div>
      )}
      <div className="px-5 mt-5 space-y-4 pb-6">
        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-full border-2 mx-auto animate-spin"
              style={{ borderColor: 'var(--color-text-secondary)', borderTopColor: 'transparent' }} />
            <p className="text-sm mt-3" style={{ color: 'var(--color-text-secondary)' }}>Загружаем маршруты...</p>
          </div>
        )}
        {!loading && routes.map(route => (
          <RouteCard key={route.id} route={route} />
        ))}
        {!loading && routes.length === 0 && (
          <div className="text-center py-16">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" className="mx-auto mb-3">
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
            </svg>
            <p className="text-base font-medium" style={{ color: 'var(--color-text)' }}>Ничего не найдено</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Попробуйте изменить фильтры</p>
          </div>
        )}
      </div>

      {showFavorites && (
        <FavoritesModal routes={routes} onClose={() => setShowFavorites(false)} />
      )}
    </div>
  )
}
