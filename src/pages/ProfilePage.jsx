import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatsBlock from '../components/profile/StatsBlock'
import AchievementCard from '../components/profile/AchievementCard'
import { useAuth } from '../context/AuthContext'
import { getUserAchievements, getUserStats } from '../services/user'
import { getUnreadCount } from '../services/notifications'

function MenuItem({ icon, label, sublabel, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 border-none cursor-pointer bg-transparent text-left"
      style={{ borderBottom: '1px solid var(--color-bg-secondary)' }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--color-bg-secondary)' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{label}</p>
        {sublabel && <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{sublabel}</p>}
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </button>
  )
}

export default function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [achievements, setAchievements] = useState([])
  const [stats,        setStats]        = useState({ routes: 0, trips: 0, challenges: 0 })
  const [loading,      setLoading]      = useState(true)
  const [showAch,      setShowAch]      = useState(false)
  const [unreadCount,  setUnreadCount]  = useState(0)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    Promise.all([getUserAchievements(user.id), getUserStats(user.id), getUnreadCount(user.id)])
      .then(([ach, st, unread]) => { setAchievements(ach); setStats(st); setUnreadCount(unread) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  const displayName   = user ? [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Пользователь' : 'Гость'
  const username      = user?.username ? `@${user.username}` : ''
  const avatar        = user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'guest'}&backgroundColor=b6e3f4`
  const level         = user?.level || 1
  const levelName     = user?.level_name || 'Новичок'
  const levelProgress = user?.level_progress || 0
  const ecoPoints     = user?.total_eco_points || 0

  return (
    <div className="pb-6">

      {/* Баннер */}
      <div className="relative overflow-hidden rounded-b-3xl"
        style={{ background: 'linear-gradient(135deg, #34C759 0%, #28A745 50%, #1E7E34 100%)' }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15"
          style={{ background: '#fff', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full opacity-10"
          style={{ background: '#fff', transform: 'translate(-30%, 30%)' }} />

        <div className="relative px-5 pt-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/80 text-sm font-medium">Профиль</span>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/notifications')}
                className="relative w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.2)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full flex items-center justify-center text-[9px] font-bold text-white px-1"
                    style={{ background: '#FF3B30' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <button onClick={() => navigate('/settings')}
                className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.2)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <img src={avatar} alt={displayName}
                className="w-20 h-20 rounded-full object-cover"
                style={{ border: '3px solid rgba(255,255,255,0.5)' }} />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: '#FFB800', border: '2px solid #34C759' }}>
                {level}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{displayName}</h2>
              {username && <p className="text-sm text-white/70 truncate">{username}</p>}
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}>
                  {levelName}
                </span>
              </div>
            </div>
          </div>

          {/* Прогресс-бар */}
          <div className="mt-4">
            <div className="w-full rounded-full overflow-hidden" style={{ height: '6px', background: 'rgba(255,255,255,0.25)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%`, background: '#fff' }} />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-white/60">Прогресс уровня</span>
              <span className="text-xs font-medium text-white/90">{levelProgress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Меню */}
      <div className="px-5 mt-5">
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
          <MenuItem
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2"><path d="m8 3 4 8 5-5 5 15H2L8 3z" /></svg>}
            label="Мои поездки"
            sublabel={stats.trips > 0 ? `${stats.trips} поездок` : undefined}
            onClick={() => navigate('/trips')}
          />
          <MenuItem
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
            label="История бронирований"
            onClick={() => navigate('/booking-history')}
          />
          <MenuItem
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>}
            label="Уведомления"
            sublabel={unreadCount > 0 ? `${unreadCount} новых` : undefined}
            onClick={() => navigate('/notifications')}
          />
          {user?.is_seller && (
            <MenuItem
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>}
              label="Кабинет продавца"
              sublabel="Управление заказами"
              onClick={() => navigate('/seller')}
            />
          )}
          <MenuItem
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 9 7 12 7s5-3 7.5-3a2.5 2.5 0 010 5H18" /><path d="M12 7v10" /><path d="M3 17h18" /><path d="M5 21h14" /></svg>}
            label="Мои достижения"
            sublabel={achievements.length > 0 ? `${achievements.length} получено` : undefined}
            onClick={() => setShowAch(!showAch)}
          />
          <MenuItem
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2"><path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>}
            label="Эко-баллы"
            sublabel={`${ecoPoints.toLocaleString()} баллов`}
            onClick={() => {}}
          />
          <MenuItem
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>}
            label="О приложении"
            sublabel="AlaTau v1.0"
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Статистика */}
      <div className="px-5 mt-5">
        <p className="text-sm font-semibold mb-3 px-1" style={{ color: 'var(--color-text)' }}>Статистика</p>
        <StatsBlock stats={stats} />
      </div>

      {/* Достижения */}
      {showAch && (
        <div className="px-5 mt-5 pb-6">
          <p className="text-sm font-semibold mb-3 px-1" style={{ color: 'var(--color-text)' }}>Достижения</p>
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 rounded-full border-2 mx-auto animate-spin"
                style={{ borderColor: 'var(--color-text-secondary)', borderTopColor: 'transparent' }} />
            </div>
          ) : achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.map(a => <AchievementCard key={a.id} achievement={a} />)}
            </div>
          ) : (
            <div className="rounded-2xl p-6 text-center" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" className="mx-auto mb-3" style={{ opacity: 0.4 }}>
                <path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 9 7 12 7s5-3 7.5-3a2.5 2.5 0 010 5H18" /><path d="M12 7v10" /><path d="M3 17h18" /><path d="M5 21h14" />
              </svg>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Пока нет достижений</p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                Проходи маршруты и выполняй челленджи
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
