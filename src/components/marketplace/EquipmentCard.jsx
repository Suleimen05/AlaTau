import { useFavorites } from '../../context/FavoritesContext'

export default function EquipmentCard({ item, onClick }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const fav = isFavorite(item.id)

  return (
    <div onClick={onClick} className="relative rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
      <button
        onClick={e => { e.stopPropagation(); toggleFavorite(item.id) }}
        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer active:scale-90 transition-transform z-10"
        style={{ background: 'var(--color-bg-secondary)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24"
          fill={fav ? '#FF3B30' : 'none'}
          stroke={fav ? '#FF3B30' : 'var(--color-text-secondary)'}
          strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      </button>

      <div className="flex gap-3">
        <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0 pr-8">
          <h3 className="font-bold text-[15px] truncate" style={{ color: 'var(--color-text)' }}>{item.name}</h3>
          <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>{item.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>{item.category}</span>
            <div className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#34C759" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>{item.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          <span className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{item.price.toLocaleString()} тг</span>
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}> /{item.priceUnit}</span>
        </div>
        <button className="text-[13px] font-semibold px-5 py-2.5 rounded-full border-none cursor-pointer active:scale-[0.97] transition-transform text-white" style={{ background: '#34C759' }}>
          Арендовать
        </button>
      </div>
    </div>
  )
}
