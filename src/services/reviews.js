import { supabase } from '../lib/supabase'

function formatTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'только что'
  if (mins < 60) return `${mins} мин назад`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} ч назад`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days} дн назад`
  if (days < 30) return `${Math.floor(days / 7)} нед назад`
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function mapReview(r) {
  return {
    id: r.id,
    userId: r.user_id,
    rating: r.rating,
    comment: r.comment || '',
    createdAt: r.created_at,
    timeAgo: formatTimeAgo(r.created_at),
    userName: r.users
      ? [r.users.first_name, r.users.last_name].filter(Boolean).join(' ') || 'Пользователь'
      : 'Пользователь',
    userAvatar: r.users?.avatar_url
      || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.user_id}&backgroundColor=b6e3f4`,
  }
}

export async function getReviews(reviewableType, reviewableId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, users(first_name, last_name, avatar_url)')
    .eq('reviewable_type', reviewableType)
    .eq('reviewable_id', reviewableId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return (data || []).map(mapReview)
}

export async function submitReview({ userId, tripId, reviewableType, reviewableId, rating, comment }) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id: userId,
      trip_id: tripId,
      reviewable_type: reviewableType,
      reviewable_id: reviewableId,
      rating,
      comment: comment?.trim() || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserReviews(userId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, users(first_name, last_name, avatar_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(mapReview)
}

// Демо-отзывы для dev-режима
export const DEMO_REVIEWS = [
  {
    id: 'demo-r1',
    userId: 'demo',
    rating: 5,
    comment: 'Отличный маршрут! Виды потрясающие, тропа хорошо размечена.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    timeAgo: '2 дн назад',
    userName: 'Айдана К.',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aidana&backgroundColor=b6e3f4',
  },
  {
    id: 'demo-r2',
    userId: 'demo',
    rating: 4,
    comment: 'Хороший гид, всё рассказал. Немного устали, но довольны.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    timeAgo: '5 дн назад',
    userName: 'Марат Б.',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marat&backgroundColor=b6e3f4',
  },
  {
    id: 'demo-r3',
    userId: 'demo',
    rating: 5,
    comment: 'Рекомендую! Очень красивое место, особенно на рассвете.',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    timeAgo: '2 нед назад',
    userName: 'Диана С.',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana&backgroundColor=b6e3f4',
  },
]
