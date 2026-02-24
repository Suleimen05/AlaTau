export default function ChallengeCard({ challenge }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
      <div className="flex gap-3 items-start">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: challenge.completed ? '#E8F5E9' : 'var(--color-bg-secondary)' }}>
          {challenge.completed ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-[15px]" style={{ color: 'var(--color-text)' }}>{challenge.title}</h3>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg flex-shrink-0" style={{ background: '#34C759' }}>
              <span className="text-xs font-bold text-white">+{challenge.points}</span>
            </div>
          </div>
          <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>{challenge.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>{challenge.category}</span>
          </div>
        </div>
      </div>

      {!challenge.completed && (
        <button className="w-full mt-4 text-[13px] font-semibold py-2.5 rounded-full border-none cursor-pointer active:scale-[0.97] transition-transform" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}>
          Выполнить
        </button>
      )}
    </div>
  )
}
