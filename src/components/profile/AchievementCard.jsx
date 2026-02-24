const iconMap = {
  mountain: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2"><path d="m8 3 4 8 5-5 5 15H2L8 3z" /></svg>
  ),
  leaf: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2"><path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
  ),
  camera: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
  ),
}

export default function AchievementCard({ achievement }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#E8F5E9' }}>
          {iconMap[achievement.icon] || iconMap.mountain}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[15px]" style={{ color: 'var(--color-text)' }}>{achievement.title}</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{achievement.description}</p>
        </div>
      </div>
    </div>
  )
}
