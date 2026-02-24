import { useNavigate } from 'react-router-dom'

const statusLabels = { confirmed: 'Подтверждено', pending: 'Ожидает', completed: 'Завершено' }
const statusColors = {
  confirmed: '#34C759',
  pending: '#FF9500',
  completed: '#8E8E93',
}

export default function TripCard({ trip }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/trip/${trip.id}`)}
      className="relative rounded-3xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
    >
      <img src={trip.image} alt={trip.routeTitle} className="w-full h-52 object-cover block" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Status badge */}
      <div className="absolute top-4 left-4">
        <div
          className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
          style={{ background: statusColors[trip.status] }}
        >
          {statusLabels[trip.status]}
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white text-xl font-bold">{trip.routeTitle}</h3>

        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
            <span className="text-white/80 text-xs">{trip.date}</span>
          </div>
          {trip.guide && trip.guide !== '—' && (
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              <span className="text-white/80 text-xs">{trip.guide}</span>
            </div>
          )}
        </div>

        {trip.services.length > 0 && (
          <div className="flex gap-2 mt-2">
            {trip.services.map(s => (
              <span key={s} className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)' }}>
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-white text-lg font-bold">{trip.totalPrice.toLocaleString()} тг</span>
          {trip.status === 'pending' && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/payment/${trip.id}`) }}
              className="text-[13px] font-semibold px-5 py-2 rounded-full border-none cursor-pointer active:scale-[0.97] transition-transform"
              style={{ background: '#FF9500', color: '#fff' }}
            >
              Оплатить
            </button>
          )}
          {trip.status === 'confirmed' && (
            <span className="text-[13px] font-semibold px-5 py-2 rounded-full"
              style={{ background: 'rgba(52,199,89,0.25)', color: '#34C759' }}>
              Оплачено
            </span>
          )}
          {trip.status === 'completed' && (
            <span className="text-[13px] font-semibold px-5 py-2 rounded-full"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
              Оплачено
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
