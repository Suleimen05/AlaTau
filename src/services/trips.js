import { supabase } from '../lib/supabase'

const SERVICE_LABELS = {
  guide: 'Гид',
  equipment: 'Снаряжение',
  transfer: 'Трансфер',
  housing: 'Жильё',
}

function mapTrip(t) {
  const routeImages = t.routes?.images_json || []

  const services = [...new Set(
    (t.trip_items || []).map(item => SERVICE_LABELS[item.service_type]).filter(Boolean)
  )]

  let date = '—'
  if (t.date_start) {
    date = new Date(t.date_start).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  }

  return {
    id: t.id,
    routeTitle: t.routes?.title || t.title || 'Поездка',
    date,
    status: t.status,
    guide: '—',
    services,
    totalPrice: t.total_price || 0,
    image: routeImages[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  }
}

export async function getTrips(userId) {
  const { data, error } = await supabase
    .from('trips')
    .select('*, routes(title, images_json), trip_items(service_type)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(mapTrip)
}
