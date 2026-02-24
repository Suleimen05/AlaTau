import { supabase } from '../lib/supabase'

function formatTimeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMin = Math.floor((now - date) / 60000)
  if (diffMin < 1) return 'только что'
  if (diffMin < 60) return `${diffMin} мин назад`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH} ч назад`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 7) return `${diffD} дн назад`
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function mapNotification(n) {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    isRead: n.is_read,
    data: n.data_json || {},
    createdAt: n.created_at,
    timeAgo: formatTimeAgo(n.created_at),
  }
}

export async function getNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return (data || []).map(mapNotification)
}

export async function getUnreadCount(userId) {
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)
  if (error) throw error
  return count || 0
}

export async function markAsRead(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
  if (error) throw error
}

export async function markAllAsRead(userId) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)
  if (error) throw error
}
