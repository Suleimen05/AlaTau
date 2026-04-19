import { useNavigate } from 'react-router-dom'

const difficultyLabels = { easy: 'Лёгкий', medium: 'Средний', hard: 'Сложный' }
const difficultyColors = { easy: '#34C759', medium: '#FF9500', hard: '#FF3B30' }

export default function RouteDetailsModal({ route, onClose }) {
  const navigate = useNavigate()

  if (!route) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="mt-auto rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh] relative" 
        style={{ background: 'var(--color-bg)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-64 flex-shrink-0">
          <img src={route.image} alt={route.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center border-none cursor-pointer z-10"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex gap-2 mb-2">
              <div className="px-2.5 py-1 rounded-lg text-xs font-medium text-white" style={{ background: difficultyColors[route.difficulty] }}>
                {difficultyLabels[route.difficulty]}
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#F0C14B" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span className="text-white text-xs font-bold">{route.rating}</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">{route.title}</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28">
          <div className="flex items-center justify-between mb-6 p-4 rounded-2xl" style={{ background: 'var(--color-bg-secondary)' }}>
            <div className="flex flex-col items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-1"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Время</span>
              <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{route.duration}</span>
            </div>
            <div className="w-px h-10 opacity-20" style={{ background: 'var(--color-text)' }}></div>
            <div className="flex flex-col items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-1"><circle cx="12" cy="12" r="10" /><path d="M12 2v20M2 12h20" /></svg>
              <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Длина</span>
              <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{route.distance}</span>
            </div>
            <div className="w-px h-10 opacity-20" style={{ background: 'var(--color-text)' }}></div>
            <div className="flex flex-col items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-1"><path d="m8 3 4 8 5-5 5 15H2L8 3z" /></svg>
              <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Высота</span>
              <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{route.elevation}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text)' }}>Обзор маршрута</h3>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>
            {route.description}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 pt-10" style={{ background: 'linear-gradient(to top, var(--color-bg) 60%, transparent)' }}>
          <button
            onClick={() => { onClose(); navigate('/trips') }}
            className="w-full py-4 rounded-2xl text-base font-bold text-white border-none cursor-pointer active:scale-[0.98] transition-transform"
            style={{ background: '#34C759', boxShadow: '0 8px 16px rgba(52,199,89,0.25)' }}
          >
            Афиша походов
          </button>
        </div>
      </div>
    </div>
  )
}
