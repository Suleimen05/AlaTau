import RouteCard from './RouteCard'
import { useFavorites } from '../../context/FavoritesContext'

export default function FavoritesModal({ routes, onClose }) {
  const { favorites } = useFavorites()
  const favRoutes = routes.filter(r => favorites.has(r.id))

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal — 80% экрана, от низа вверх, на всю ширину */}
      <div
        className="relative w-full flex flex-col rounded-t-3xl overflow-hidden"
        style={{ background: 'var(--color-bg)', height: '80vh' }}
      >

      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3"
        style={{ borderBottom: '1px solid var(--color-bg-secondary)' }}>
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Избранные маршруты</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {favRoutes.length > 0 ? `${favRoutes.length} сохранённых` : 'Пока пусто'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer"
          style={{ background: 'var(--color-bg-secondary)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {favRoutes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.2" className="mb-4" style={{ opacity: 0.4 }}>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <p className="text-base font-medium" style={{ color: 'var(--color-text)' }}>Нет избранных</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Нажмите на сердечко на карточке маршрута
            </p>
          </div>
        ) : (
          <div className="space-y-4 pb-20">
            {favRoutes.map(route => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
