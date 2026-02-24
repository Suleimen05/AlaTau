import { supabase } from '../lib/supabase'

const SERVICE_LABELS = { guide: 'Гид', equipment: 'Снаряжение', transfer: 'Трансфер', housing: 'Жильё' }

export async function getSellerProfile(userId) {
  const { data, error } = await supabase
    .from('seller_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  // PGRST116 = no rows found — не ошибка, просто пользователь не продавец
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

export async function getSellerStats(sellerId) {
  const [pendingRes, totalRes, revenueRes] = await Promise.all([
    supabase.from('trip_items').select('id', { count: 'exact', head: true })
      .eq('seller_id', sellerId).eq('status', 'pending'),
    supabase.from('trip_items').select('id', { count: 'exact', head: true })
      .eq('seller_id', sellerId).in('status', ['confirmed', 'completed']),
    supabase.from('trip_items').select('total_price')
      .eq('seller_id', sellerId).in('status', ['confirmed', 'completed']),
  ])

  const totalRevenue = (revenueRes.data || []).reduce((sum, i) => sum + (i.total_price || 0), 0)

  return {
    pending: pendingRes.count || 0,
    totalOrders: totalRes.count || 0,
    totalRevenue,
  }
}

export async function getSellerOrders(sellerId) {
  const { data, error } = await supabase
    .from('trip_items')
    .select('*, trips(title, date_start, persons_count, users(first_name, last_name, username))')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return (data || []).map(mapSellerOrder)
}

function mapSellerOrder(item) {
  const trip = item.trips || {}
  const client = trip.users || {}
  return {
    id: item.id,
    tripTitle: trip.title || 'Заказ',
    serviceType: item.service_type,
    serviceLabel: SERVICE_LABELS[item.service_type] || item.service_type,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    totalPrice: item.total_price,
    status: item.status || 'pending',
    dateStart: item.date_start,
    createdAt: item.created_at,
    clientName: [client.first_name, client.last_name].filter(Boolean).join(' ') || 'Клиент',
    clientUsername: client.username || '',
    personsCount: trip.persons_count || 1,
  }
}

export async function updateOrderStatus(itemId, newStatus) {
  const { error } = await supabase
    .from('trip_items')
    .update({ status: newStatus })
    .eq('id', itemId)
  if (error) throw error
}

export async function getSellerListings(sellerId) {
  const [guidesRes, equipRes, transRes, housRes] = await Promise.all([
    supabase.from('guides').select('id, title, price_per_person, rating, is_active').eq('seller_id', sellerId),
    supabase.from('equipment').select('id, name, price_per_day, rating, is_active').eq('seller_id', sellerId),
    supabase.from('transfers').select('id, from_location, to_location, price_per_vehicle, rating, is_active').eq('seller_id', sellerId),
    supabase.from('housing').select('id, title, price_per_night, rating, is_active').eq('seller_id', sellerId),
  ])

  return [
    ...(guidesRes.data || []).map(g => ({ id: g.id, name: g.title, price: g.price_per_person, priceUnit: 'чел', rating: Number(g.rating) || 0, isActive: g.is_active, type: 'guide' })),
    ...(equipRes.data || []).map(e => ({ id: e.id, name: e.name, price: e.price_per_day, priceUnit: 'день', rating: Number(e.rating) || 0, isActive: e.is_active, type: 'equipment' })),
    ...(transRes.data || []).map(t => ({ id: t.id, name: `${t.from_location} → ${t.to_location}`, price: t.price_per_vehicle, priceUnit: 'машина', rating: Number(t.rating) || 0, isActive: t.is_active, type: 'transfer' })),
    ...(housRes.data || []).map(h => ({ id: h.id, name: h.title, price: h.price_per_night, priceUnit: 'ночь', rating: Number(h.rating) || 0, isActive: h.is_active, type: 'housing' })),
  ]
}
