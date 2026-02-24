import { useFavorites } from '../../context/FavoritesContext'

export default function TransferCard({ transfer, onClick }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const fav = isFavorite(transfer.id)

  return (
    <div onClick={onClick} className="rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
      <div className="flex gap-3 items-start">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-bg-secondary)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 002 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[15px] truncate" style={{ color: 'var(--color-text)' }}>{transfer.title}</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{transfer.provider}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>{transfer.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
              <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>{transfer.capacity}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: '#34C759' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            <span className="text-xs font-bold text-white">{transfer.rating}</span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); toggleFavorite(transfer.id) }}
            className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer active:scale-90 transition-transform"
            style={{ background: 'var(--color-bg-secondary)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24"
              fill={fav ? '#FF3B30' : 'none'}
              stroke={fav ? '#FF3B30' : 'var(--color-text-secondary)'}
              strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          <span className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{transfer.price.toLocaleString()} тг</span>
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}> /{transfer.priceUnit}</span>
        </div>
        <button className="text-[13px] font-semibold px-5 py-2.5 rounded-full border-none cursor-pointer active:scale-[0.97] transition-transform text-white" style={{ background: '#34C759' }}>
          Забронировать
        </button>
      </div>
    </div>
  )
}
