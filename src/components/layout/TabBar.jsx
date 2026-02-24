import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  {
    path: '/',
    label: 'Маршруты',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#34C759' : 'var(--color-text)'} strokeWidth="2" style={{ opacity: active ? 1 : 0.35 }}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    )
  },
  {
    path: '/marketplace',
    label: 'Маркет',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#34C759' : 'var(--color-text)'} strokeWidth="2" style={{ opacity: active ? 1 : 0.35 }}>
        <path d="m16 6 4 14" />
        <path d="M12 6v14" />
        <path d="M8 8v12" />
        <path d="M4 4v16" />
      </svg>
    )
  },
  {
    path: '/trips',
    label: 'Поездки',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#34C759' : 'var(--color-text)'} strokeWidth="2" style={{ opacity: active ? 1 : 0.35 }}>
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    )
  },
  {
    path: '/challenges',
    label: 'Челленджи',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#34C759' : 'var(--color-text)'} strokeWidth="2" style={{ opacity: active ? 1 : 0.35 }}>
        <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0012 0V2Z" />
      </svg>
    )
  },
  {
    path: '/profile',
    label: 'Профиль',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#34C759' : 'var(--color-text)'} strokeWidth="2" style={{ opacity: active ? 1 : 0.35 }}>
        <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  }
]

export default function TabBar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 pb-6 px-2 z-50" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-tab)' }}>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center gap-1 py-1 px-3 border-none bg-transparent cursor-pointer"
          >
            {tab.icon(isActive)}
            <span
              className="text-[10px] font-medium"
              style={{ color: isActive ? '#34C759' : 'var(--color-text-secondary)' }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
