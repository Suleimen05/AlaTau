import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../../context/FavoritesContext'

const difficultyLabels = { easy: 'Лёгкий', medium: 'Средний', hard: 'Сложный' }
const difficultyColors = { easy: '#34C759', medium: '#FF9500', hard: '#FF3B30' }

export default function RouteCard({ route }) {
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()
  const fav = isFavorite(route.id)

  return (
    <div className="relative rounded-3xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <img src={route.image} alt={route.title} className="w-full h-56 object-cover block" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Top-left: rating + difficulty */}
      <div className="absolute top-4 left-4 flex gap-2">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#F0C14B" stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-white text-xs font-bold">{route.rating}</span>
        </div>
        <div className="px-2.5 py-1 rounded-lg text-xs font-medium text-white" style={{ background: difficultyColors[route.difficulty] }}>
          {difficultyLabels[route.difficulty]}
        </div>
      </div>

      {/* Heart */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleFavorite(route.id) }}
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center border-none cursor-pointer active:scale-90 transition-transform"
        style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={fav ? '#FF3B30' : 'none'} stroke={fav ? '#FF3B30' : 'white'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
      </button>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white text-xl font-bold">{route.title}</h3>
        <p className="text-white/70 text-sm mt-1 line-clamp-2">{route.description}</p>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            <span className="text-white/80 text-xs">{route.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2v20M2 12h20" /></svg>
            <span className="text-white/80 text-xs">{route.distance}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="m8 3 4 8 5-5 5 15H2L8 3z" /></svg>
            <span className="text-white/80 text-xs">{route.elevation}</span>
          </div>
        </div>

        {/* Кнопка конструктора */}
        <button
          onClick={() => navigate(`/trip-builder/${route.id}`)}
          className="mt-3 w-full py-2.5 rounded-2xl text-sm font-bold border-none cursor-pointer active:scale-[0.97] transition-transform"
          style={{ background: 'rgba(255,255,255,0.92)', color: '#1A1A1A' }}
        >
          Собрать поездку
        </button>
      </div>
    </div>
  )
}
