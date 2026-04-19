import { supabase } from '../lib/supabase'

function mapGuide(g) {
  return {
    id: g.id,
    name: g.title,
    specialization: g.specialization || 'Горный туризм',
    experience: g.experience_years ? `${g.experience_years} лет опыта` : '—',
    languages: g.languages_json || [],
    price: g.price_per_person,
    rating: Number(g.rating) || 0,
    avatar: g.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${g.id}&backgroundColor=b6e3f4`,
  }
}

function mapEquipment(e) {
  const images = e.images_json || []
  return {
    id: e.id,
    name: e.name,
    description: e.description || '',
    price: e.price_per_day,
    priceUnit: 'день',
    category: e.category || 'Снаряжение',
    rating: Number(e.rating) || 0,
    image: images[0] || 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&q=80',
  }
}

function mapTransfer(t) {
  const durationH = t.duration_minutes ? (t.duration_minutes / 60).toFixed(1) : null
  return {
    id: t.id,
    title: `${t.from_location} → ${t.to_location}`,
    provider: t.vehicle_type || 'Трансфер',
    rating: Number(t.rating) || 0,
    price: t.price_per_vehicle,
    priceUnit: 'машина',
    capacity: `${t.capacity_persons} человека`,
    duration: durationH ? `${durationH} ч` : '—',
  }
}

function mapHousing(h) {
  const images = h.images_json || []
  return {
    id: h.id,
    title: h.title,
    location: h.location || '',
    rating: Number(h.rating) || 0,
    price: h.price_per_night,
    priceUnit: 'ночь',
    amenities: h.amenities_json || [],
    image: images[0] || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400&q=80',
  }
}

export async function getGuides({ search = '', sortBy = 'rating' } = {}) {
  let query = supabase.from('guides').select('*').eq('is_active', true)

  if (search.trim()) {
    query = query.or(`title.ilike.%${search}%,specialization.ilike.%${search}%`)
  }

  if (sortBy === 'price_asc') query = query.order('price_per_person', { ascending: true })
  else if (sortBy === 'price_desc') query = query.order('price_per_person', { ascending: false })
  else query = query.order('rating', { ascending: false })

  const { data, error } = await query
  if (error) throw error
  return (data || []).map(mapGuide)
}

export async function getEquipment({ search = '', sortBy = 'rating', category = 'all' } = {}) {
  let query = supabase.from('equipment').select('*').eq('is_active', true)

  if (search.trim()) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (category !== 'all') {
    query = query.eq('category', category)
  }

  if (sortBy === 'price_asc') query = query.order('price_per_day', { ascending: true })
  else if (sortBy === 'price_desc') query = query.order('price_per_day', { ascending: false })
  else query = query.order('rating', { ascending: false })

  const { data, error } = await query
  if (error) throw error
  return (data || []).map(mapEquipment)
}

export async function getTransfers({ search = '', sortBy = 'rating' } = {}) {
  let query = supabase.from('transfers').select('*').eq('is_active', true)

  if (search.trim()) {
    query = query.or(`from_location.ilike.%${search}%,to_location.ilike.%${search}%`)
  }

  if (sortBy === 'price_asc') query = query.order('price_per_vehicle', { ascending: true })
  else if (sortBy === 'price_desc') query = query.order('price_per_vehicle', { ascending: false })
  else query = query.order('rating', { ascending: false })

  const { data, error } = await query
  if (error) throw error
  return (data || []).map(mapTransfer)
}

export async function getHousing({ search = '', sortBy = 'rating' } = {}) {
  let query = supabase.from('housing').select('*').eq('is_active', true)

  if (search.trim()) {
    query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`)
  }

  if (sortBy === 'price_asc') query = query.order('price_per_night', { ascending: true })
  else if (sortBy === 'price_desc') query = query.order('price_per_night', { ascending: false })
  else query = query.order('rating', { ascending: false })

  const { data, error } = await query
  if (error) throw error
  return (data || []).map(mapHousing)
}

export async function getEquipmentCategories() {
  const { data, error } = await supabase
    .from('equipment')
    .select('category')
    .eq('is_active', true)
    .not('category', 'is', null)
  if (error) throw error
  return [...new Set((data || []).map(e => e.category).filter(Boolean))].sort()
}

export async function recordMarketLead(userId) {
  const { error } = await supabase.from('market_leads').insert([
    { user_id: userId || null }
  ])
  if (error) console.error('Error tracking lead:', error)
}
