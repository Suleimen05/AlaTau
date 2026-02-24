import { supabase } from '../lib/supabase'

export async function getRoute(routeId) {
  const { data, error } = await supabase
    .from('routes').select('*').eq('id', routeId).single()
  if (error) throw error
  return data
}

export async function getGuidesForRoute(routeId) {
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('is_active', true)
    .filter('route_ids_json', 'cs', JSON.stringify([routeId]))
  if (error) throw error
  return (data || []).map(g => ({
    id: g.id,
    seller_id: g.seller_id,
    name: g.title,
    specialization: g.specialization || 'Горный туризм',
    experience: g.experience_years ? `${g.experience_years} лет опыта` : '',
    languages: g.languages_json || [],
    price: g.price_per_person,
    rating: Number(g.rating) || 0,
    avatar: g.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${g.id}&backgroundColor=b6e3f4`,
  }))
}

export async function getEquipmentAll() {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .eq('is_active', true)
    .gt('quantity_available', 0)
  if (error) throw error
  return (data || []).map(e => ({
    id: e.id,
    seller_id: e.seller_id,
    name: e.name,
    description: e.description || '',
    price: e.price_per_day,
    image: (e.images_json || [])[0] || '',
    rating: Number(e.rating) || 0,
  }))
}

export async function getTransfersForRoute(routeId) {
  const { data, error } = await supabase
    .from('transfers')
    .select('*')
    .eq('is_active', true)
    .filter('route_ids_json', 'cs', JSON.stringify([routeId]))
  if (error) throw error
  return (data || []).map(t => ({
    id: t.id,
    seller_id: t.seller_id,
    title: `${t.from_location} → ${t.to_location}`,
    price: t.price_per_vehicle,
    capacity: t.capacity_persons,
    duration: t.duration_minutes ? `${Math.round(t.duration_minutes / 60)} ч` : '',
    rating: Number(t.rating) || 0,
  }))
}

export async function getHousingForRoute(routeId) {
  const { data, error } = await supabase
    .from('housing')
    .select('*')
    .eq('is_active', true)
    .filter('route_ids_json', 'cs', JSON.stringify([routeId]))
  if (error) throw error
  return (data || []).map(h => ({
    id: h.id,
    seller_id: h.seller_id,
    title: h.title,
    type: h.type || '',
    location: h.location || '',
    price: h.price_per_night,
    amenities: h.amenities_json || [],
    image: (h.images_json || [])[0] || '',
    rating: Number(h.rating) || 0,
  }))
}

export async function createTrip({
  userId, routeId, routeTitle,
  date, persons,
  selectedGuide, selectedEquipment, selectedTransfer, selectedHousing,
  total,
}) {
  const { data: trip, error } = await supabase
    .from('trips')
    .insert({
      user_id: userId,
      route_id: routeId,
      title: `${routeTitle} — ${new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`,
      date_start: date,
      date_end: date,
      persons_count: persons,
      status: 'draft',
      total_price: total,
    })
    .select()
    .single()

  if (error) throw error

  const items = []

  if (selectedGuide) {
    items.push({
      trip_id: trip.id, service_type: 'guide',
      service_id: selectedGuide.id, seller_id: selectedGuide.seller_id,
      quantity: persons, unit_price: selectedGuide.price,
      total_price: selectedGuide.price * persons,
      date_start: date, date_end: date,
    })
  }

  selectedEquipment.forEach(e => {
    items.push({
      trip_id: trip.id, service_type: 'equipment',
      service_id: e.id, seller_id: e.seller_id,
      quantity: 1, unit_price: e.price, total_price: e.price,
      date_start: date, date_end: date,
    })
  })

  if (selectedTransfer) {
    items.push({
      trip_id: trip.id, service_type: 'transfer',
      service_id: selectedTransfer.id, seller_id: selectedTransfer.seller_id,
      quantity: 1, unit_price: selectedTransfer.price, total_price: selectedTransfer.price,
      date_start: date, date_end: date,
    })
  }

  if (selectedHousing) {
    items.push({
      trip_id: trip.id, service_type: 'housing',
      service_id: selectedHousing.id, seller_id: selectedHousing.seller_id,
      quantity: 1, unit_price: selectedHousing.price, total_price: selectedHousing.price,
      date_start: date, date_end: date,
    })
  }

  if (items.length > 0) {
    const { error: itemsErr } = await supabase.from('trip_items').insert(items)
    if (itemsErr) throw itemsErr
  }

  return trip
}

export async function getTripForPayment(tripId) {
  const { data, error } = await supabase
    .from('trips')
    .select('*, routes(title, images_json), trip_items(service_type, unit_price, quantity, total_price)')
    .eq('id', tripId)
    .single()
  if (error) throw error
  return data
}

export async function payTrip(tripId, userId, amount) {
  const { error: payErr } = await supabase.from('payments').insert({
    trip_id: tripId,
    user_id: userId,
    amount,
    method: 'mock',
    status: 'paid',
    paid_at: new Date().toISOString(),
  })
  if (payErr) throw payErr

  const { error: tripErr } = await supabase
    .from('trips').update({ status: 'pending' }).eq('id', tripId)
  if (tripErr) throw tripErr
}
