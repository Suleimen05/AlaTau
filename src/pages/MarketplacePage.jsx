import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import FilterTabs from '../components/ui/FilterTabs'
import GuideCard from '../components/marketplace/GuideCard'
import EquipmentCard from '../components/marketplace/EquipmentCard'
import TransferCard from '../components/marketplace/TransferCard'
import HousingCard from '../components/marketplace/HousingCard'
import MarketplaceDetailModal from '../components/marketplace/MarketplaceDetailModal'
import { getGuides, getEquipment, getTransfers, getHousing, getEquipmentCategories } from '../services/marketplace'

const categories = [
  { label: 'Гиды',      value: 'guides'    },
  { label: 'Снаряжение', value: 'equipment' },
  { label: 'Трансфер',  value: 'transfers' },
  { label: 'Жильё',     value: 'housing'   },
]

const sortTabs = [
  { label: 'По рейтингу', value: 'rating'     },
  { label: 'Цена ↑',      value: 'price_asc'  },
  { label: 'Цена ↓',      value: 'price_desc' },
]

const searchPlaceholders = {
  guides:    'Поиск гидов...',
  equipment: 'Поиск снаряжения...',
  transfers: 'Поиск трансферов...',
  housing:   'Поиск жилья...',
}

export default function MarketplacePage() {
  const [category,        setCategory]        = useState('guides')
  const [items,           setItems]           = useState([])
  const [loading,         setLoading]         = useState(true)
  const [selected,        setSelected]        = useState(null)
  const [search,          setSearch]          = useState('')
  const [sortBy,          setSortBy]          = useState('rating')
  const [equipCategory,   setEquipCategory]   = useState('all')
  const [equipCategories, setEquipCategories] = useState([])
  const navigate = useNavigate()
  const debounceRef = useRef(null)

  // Загрузка категорий снаряжения один раз
  useEffect(() => {
    getEquipmentCategories().then(setEquipCategories).catch(console.error)
  }, [])

  // Сброс фильтров при смене категории
  function handleCategoryChange(newCat) {
    setCategory(newCat)
    setSearch('')
    setSortBy('rating')
    setEquipCategory('all')
  }

  // Debounced загрузка данных
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setLoading(true)
      setItems([])

      const params = { search, sortBy }
      let fetcher
      if (category === 'guides')         fetcher = getGuides(params)
      else if (category === 'equipment') fetcher = getEquipment({ ...params, category: equipCategory })
      else if (category === 'transfers') fetcher = getTransfers(params)
      else                               fetcher = getHousing(params)

      fetcher
        .then(data => setItems(data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }, search ? 300 : 0)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [category, search, sortBy, equipCategory])

  const renderers = {
    guides:    (items) => items.map(g => <GuideCard     key={g.id} guide={g}    onClick={() => setSelected(g)} />),
    equipment: (items) => items.map(e => <EquipmentCard key={e.id} item={e}     onClick={() => setSelected(e)} />),
    transfers: (items) => items.map(t => <TransferCard  key={t.id} transfer={t} onClick={() => setSelected(t)} />),
    housing:   (items) => items.map(h => <HousingCard   key={h.id} housing={h}  onClick={() => setSelected(h)} />),
  }

  return (
    <div>
      <PageHeader
        title="Маркетплейс"
        subtitle="Всё для твоего похода"
        action={
          <button
            onClick={() => navigate('/booking-history')}
            className="w-10 h-10 rounded-full flex items-center justify-center border-none cursor-pointer"
            style={{ background: 'var(--color-bg-secondary)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>
        }
      />
      <FilterTabs tabs={categories} activeTab={category} onTabChange={handleCategoryChange} />

      {/* Поиск */}
      <div className="px-5 mt-3">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl" style={{ background: 'var(--color-bg-secondary)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholders[category]}
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: 'var(--color-text)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="border-none bg-transparent cursor-pointer p-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Сортировка */}
      <div className="mt-2">
        <FilterTabs tabs={sortTabs} activeTab={sortBy} onTabChange={setSortBy} />
      </div>

      {/* Фильтр категории снаряжения */}
      {category === 'equipment' && equipCategories.length > 1 && (
        <div className="mt-1">
          <FilterTabs
            tabs={[{ label: 'Все', value: 'all' }, ...equipCategories.map(c => ({ label: c, value: c }))]}
            activeTab={equipCategory}
            onTabChange={setEquipCategory}
          />
        </div>
      )}

      <div className="px-5 mt-4 space-y-4 pb-6">
        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-full border-2 mx-auto animate-spin"
              style={{ borderColor: 'var(--color-text-secondary)', borderTopColor: 'transparent' }} />
          </div>
        )}
        {!loading && renderers[category](items)}
        {!loading && items.length === 0 && (
          <div className="text-center py-16">
            <p className="text-base font-medium" style={{ color: 'var(--color-text)' }}>
              {search ? 'Ничего не найдено' : 'Пока пусто'}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {search ? 'Попробуйте изменить запрос' : 'Скоро появятся предложения'}
            </p>
          </div>
        )}
      </div>

      {selected && (
        <MarketplaceDetailModal
          item={selected}
          category={category}
          onClose={() => setSelected(null)}
        />
      )}

    </div>
  )
}
