export default function StatsBlock({ stats }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
      <div className="flex justify-around">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{stats.routes}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Маршрутов</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{stats.trips}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Поездок</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{stats.challenges}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Челленджей</div>
        </div>
      </div>
    </div>
  )
}
