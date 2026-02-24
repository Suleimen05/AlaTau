import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getNotifications, markAsRead, markAllAsRead } from '../services/notifications'

const TYPE_CONFIG = {
  booking_confirmed:   { color: '#34C759', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  booking_cancelled:   { color: '#FF3B30', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> },
  payment_received:    { color: '#34C759', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
  challenge_completed: { color: '#FFB800', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFB800" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 9 7 12 7s5-3 7.5-3a2.5 2.5 0 010 5H18"/><path d="M12 7v10"/><path d="M3 17h18"/><path d="M5 21h14"/></svg> },
  new_achievement:     { color: '#FFB800', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFB800" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
}

const DEFAULT_CONFIG = { color: '#8E8E93', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> }

const DEMO_NOTIFICATIONS = [
  { id: 'd1', type: 'booking_confirmed', title: 'Бронь подтверждена', message: 'Гид Айгерим подтвердила вашу бронь на Кок-Жайлау', isRead: false, timeAgo: '2 ч назад' },
  { id: 'd2', type: 'payment_received', title: 'Оплата получена', message: 'Оплата 15 000 тг за поездку на Бутаковский водопад', isRead: false, timeAgo: '5 ч назад' },
  { id: 'd3', type: 'challenge_completed', title: 'Челлендж выполнен!', message: 'Вы выполнили «Первое восхождение» и получили 15 эко-баллов', isRead: true, timeAgo: '1 дн назад' },
  { id: 'd4', type: 'new_achievement', title: 'Новое достижение', message: 'Разблокировано достижение «Первое восхождение!»', isRead: true, timeAgo: '1 дн назад' },
]

function NotificationItem({ notification, onRead }) {
  const config = TYPE_CONFIG[notification.type] || DEFAULT_CONFIG

  return (
    <button
      onClick={() => !notification.isRead && onRead(notification.id)}
      className="w-full flex items-start gap-3 p-4 border-none cursor-pointer bg-transparent text-left"
      style={{ borderBottom: '1px solid var(--color-bg-secondary)', opacity: notification.isRead ? 0.7 : 1 }}
    >
      {!notification.isRead && (
        <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: '#007AFF' }} />
      )}
      {notification.isRead && <div className="w-2 flex-shrink-0" />}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${config.color}15` }}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{notification.title}</p>
        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>{notification.message}</p>
        <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-secondary)', opacity: 0.7 }}>{notification.timeAgo}</p>
      </div>
    </button>
  )
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const isDemo = !user

  useEffect(() => {
    if (!user) {
      setNotifications(DEMO_NOTIFICATIONS)
      setLoading(false)
      return
    }
    getNotifications(user.id)
      .then(data => setNotifications(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  function handleRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    if (!isDemo) markAsRead(id).catch(console.error)
  }

  function handleReadAll() {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    if (!isDemo && user) markAllAsRead(user.id).catch(console.error)
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--color-text-secondary)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-bg)' }}>

      {/* Шапка */}
      <div className="flex-shrink-0 px-5 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-bg-secondary)' }}>
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer flex-shrink-0"
          style={{ background: 'var(--color-bg-secondary)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2.5">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[17px] font-bold truncate" style={{ color: 'var(--color-text)' }}>Уведомления</h1>
          <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>
            {unreadCount > 0 ? `${unreadCount} непрочитанных` : 'Всё прочитано'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleReadAll}
            className="text-xs font-medium border-none bg-transparent cursor-pointer px-3 py-1.5 rounded-full"
            style={{ color: '#007AFF', background: '#007AFF15' }}>
            Прочитать все
          </button>
        )}
      </div>

      {/* Контент */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.2" className="mb-4" style={{ opacity: 0.4 }}>
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <p className="text-base font-medium" style={{ color: 'var(--color-text)' }}>Нет уведомлений</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Здесь появятся уведомления о бронированиях и достижениях
            </p>
          </div>
        ) : (
          <div className="pb-8">
            {notifications.map(n => (
              <NotificationItem key={n.id} notification={n} onRead={handleRead} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
