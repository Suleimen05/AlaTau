import { supabase } from '../lib/supabase'

// Преобразуем данные БД в формат, ожидаемый компонентами
function mapRoute(r) {
  const images = r.images_json || []

  let duration = '—'
  if (r.duration_min && r.duration_max) {
    if (r.duration_min >= 24) {
      duration = `${r.duration_min / 24}–${r.duration_max / 24} дня`
    } else {
      duration = `${r.duration_min}–${r.duration_max} часов`
    }
  }

  return {
    id: r.id,
    title: r.title,
    description: r.description || '',
    difficulty: r.difficulty,
    duration,
    distance: r.distance_km ? `${r.distance_km} км` : '—',
    elevation: r.elevation_m ? `${r.elevation_m} м` : '—',
    rating: Number(r.rating) || 0,
    image: images[0] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    services: { guides: 0, equipment: 0 },
    region: r.region || '',
    review_count: r.review_count || 0,
  }
}

export async function getRoutes({ search = '', difficulty = 'all', region = 'all' } = {}) {
  let query = supabase
    .from('routes')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (difficulty !== 'all') {
    query = query.eq('difficulty', difficulty)
  }

  if (region !== 'all') {
    query = query.eq('region', region)
  }

  if (search.trim()) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return (data || []).map(mapRoute)
}

export async function getRegions() {
  const { data, error } = await supabase
    .from('routes')
    .select('region')
    .eq('is_active', true)
    .not('region', 'is', null)
  if (error) throw error
  const unique = [...new Set((data || []).map(r => r.region).filter(Boolean))]
  return unique.sort()
}
