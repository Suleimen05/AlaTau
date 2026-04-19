import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import FilterTabs from '../components/ui/FilterTabs'

const filters = [
  { label: 'Все', value: 'all' },
  { label: 'На выходных', value: 'weekend' },
  { label: 'Популярные', value: 'popular' }
]

const afishaTrips = [
  {
    id: 'trip-1',
    routeTitle: 'Кок-Жайляу',
    date: '25 мая 2026, 08:00',
    guide: 'Максат Аскаров',
    price: 5000,
    spotsLeft: 5,
    tag: 'weekend',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    tgLink: 'https://t.me/ala_tauu' // Сюда нужно будет вставить ссылку на пост
  },
  {
    id: 'trip-2',
    routeTitle: 'Пик Букреева',
    date: '26 мая 2026, 07:00',
    guide: 'Айгерим Турсын',
    price: 7000,
    spotsLeft: 12,
    tag: 'weekend',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
    tgLink: 'https://t.me/ala_tauu'
  },
  {
    id: 'trip-3',
    routeTitle: 'Большое Алматинское озеро',
    date: '30 мая 2026, 09:00',
    guide: 'Илья Сергеев',
    price: 8000,
    spotsLeft: 2,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400&q=80',
    tgLink: 'https://t.me/ala_tauu'
  }
]

export default function TripsPage() {
  const [filter, setFilter] = useState('all')

  const filteredTrips = filter === 'all' ? afishaTrips : afishaTrips.filter(t => t.tag === filter)

  const handleJoin = (link) => {
    // Если мы внутри Telegram Mini App, можно использовать tg.openTelegramLink()
    // или tg.openLink()
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(link)
    } else {
      window.open(link, '_blank')
    }
  }

  return (
    <div className="pb-6">
      <PageHeader title="Афиша походов" subtitle="Сборные группы с опытными гидами" />
      <FilterTabs tabs={filters} activeTab={filter} onTabChange={setFilter} />
      
      <div className="px-5 mt-5 space-y-4">
        {filteredTrips.map(trip => (
          <div key={trip.id} className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
            <div className="h-32 relative">
              <img src={trip.image} alt={trip.routeTitle} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <div>
                  <h3 className="text-white font-bold text-lg">{trip.routeTitle}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                    <span className="text-white/90 text-xs font-medium">{trip.date}</span>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-lg" style={{ background: 'rgba(52, 199, 89, 0.9)' }}>
                  <span className="text-white text-xs font-bold">{trip.price} тг</span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${trip.guide}&backgroundColor=b6e3f4`} alt="Гид" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Гид</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{trip.guide}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold" style={{ color: trip.spotsLeft < 5 ? '#FF9500' : 'var(--color-text-secondary)' }}>
                    Осталось мест: {trip.spotsLeft}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => handleJoin(trip.tgLink)}
                className="w-full py-3 rounded-xl border-none cursor-pointer text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                Записаться (Telegram)
              </button>
            </div>
          </div>
        ))}

        {filteredTrips.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Пока нет походов в этой категории</p>
          </div>
        )}
      </div>
    </div>
  )
}
