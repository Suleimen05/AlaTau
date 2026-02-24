import { supabase } from '../lib/supabase'

const CATEGORY_LABELS = {
  ecology:     'Экология',
  achievement: 'Достижение',
  community:   'Сообщество',
}

export async function getChallenges(userId) {
  const { data: all, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) throw error

  let progressMap = {}
  if (userId) {
    const { data: userChallenges } = await supabase
      .from('user_challenges')
      .select('*')
      .eq('user_id', userId)

    ;(userChallenges || []).forEach(uc => {
      progressMap[uc.challenge_id] = uc
    })
  }

  return (all || []).map(c => ({
    id: c.id,
    title: c.title,
    description: c.description || '',
    points: c.points,
    category: CATEGORY_LABELS[c.category] || c.category,
    completed: progressMap[c.id]?.is_completed || false,
    progress: progressMap[c.id]?.progress || 0,
  }))
}

export async function getEcoPoints(userId) {
  const { data: challenges } = await supabase
    .from('challenges')
    .select('points')
    .eq('is_active', true)

  const maxPoints = (challenges || []).reduce((sum, c) => sum + c.points, 0)

  if (!userId) return { totalPoints: 0, maxPoints }

  const { data: user } = await supabase
    .from('users')
    .select('total_eco_points')
    .eq('id', userId)
    .single()

  return { totalPoints: user?.total_eco_points || 0, maxPoints }
}
