import { supabase } from '../lib/supabase'

export async function getUserAchievements(userId) {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('unlocked_at, achievements(*)')
    .eq('user_id', userId)

  if (error) throw error
  return (data || []).map(ua => ({
    id: ua.achievements.id,
    title: ua.achievements.title,
    description: ua.achievements.description,
    icon: ua.achievements.icon,
    unlockedAt: ua.unlocked_at,
  }))
}

export async function updateProfile(userId, fields) {
  const { data, error } = await supabase
    .from('users')
    .update(fields)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getUserStats(userId) {
  const [tripsRes, challengesRes] = await Promise.all([
    supabase.from('trips').select('id', { count: 'exact' })
      .eq('user_id', userId).eq('status', 'completed'),
    supabase.from('user_challenges').select('id', { count: 'exact' })
      .eq('user_id', userId).eq('is_completed', true),
  ])

  return {
    routes: tripsRes.count || 0,
    trips:  tripsRes.count || 0,
    challenges: challengesRes.count || 0,
  }
}
