import { useNavigate } from 'react-router-dom'
import ReviewsList from '../reviews/ReviewsList'

const typeLabels = {
  guides: 'Гид',
  equipment: 'Снаряжение',
  transfers: 'Трансфер',
  housing: 'Жильё',
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--color-bg-secondary)' }}>
      <div className="flex items-center gap-2.5">
        <span className="text-base">{icon}</span>
        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      </div>
      <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{value}</span>
    </div>
  )
}

function GuideContent({ item }) {
  return (
    <>
      <div className="flex items-center gap-4 mb-5">
        <img src={item.avatar} alt={item.name} className="w-16 h-16 rounded-full object-cover" />
        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{item.name}</h3>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{item.specialization}</p>
        </div>
      </div>
      <InfoRow icon="📋" label="Опыт" value={item.experience} />
      <InfoRow icon="⭐" label="Рейтинг" value={item.rating} />
      <InfoRow icon="💰" label="Стоимость" value={`${item.price?.toLocaleString()} тг/чел`} />
      {item.languages?.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Языки</p>
          <div className="flex flex-wrap gap-2">
            {item.languages.map(l => (
              <span key={l} className="text-xs px-3 py-1.5 rounded-full" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}>{l}</span>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function EquipmentContent({ item }) {
  return (
    <>
      <div className="flex items-center gap-4 mb-5">
        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{item.name}</h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full mt-1 inline-block" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>{item.category}</span>
        </div>
      </div>
      {item.description && (
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>{item.description}</p>
      )}
      <InfoRow icon="⭐" label="Рейтинг" value={item.rating} />
      <InfoRow icon="💰" label="Аренда" value={`${item.price?.toLocaleString()} тг/${item.priceUnit}`} />
    </>
  )
}

function TransferContent({ item }) {
  return (
    <>
      <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{item.title}</h3>
      <p className="text-sm mt-0.5 mb-5" style={{ color: 'var(--color-text-secondary)' }}>{item.provider}</p>
      <InfoRow icon="🕐" label="В пути" value={item.duration} />
      <InfoRow icon="👥" label="Вместимость" value={item.capacity} />
      <InfoRow icon="⭐" label="Рейтинг" value={item.rating} />
      <InfoRow icon="💰" label="Стоимость" value={`${item.price?.toLocaleString()} тг/${item.priceUnit}`} />
    </>
  )
}

function HousingContent({ item }) {
  return (
    <>
      {item.image && (
        <div className="rounded-2xl overflow-hidden mb-4 h-44">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        </div>
      )}
      <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{item.title}</h3>
      {item.location && (
        <div className="flex items-center gap-1.5 mt-1 mb-5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item.location}</span>
        </div>
      )}
      <InfoRow icon="⭐" label="Рейтинг" value={item.rating} />
      <InfoRow icon="💰" label="Стоимость" value={`${item.price?.toLocaleString()} тг/${item.priceUnit}`} />
      {(item.amenities || []).length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Удобства</p>
          <div className="flex flex-wrap gap-2">
            {item.amenities.map(a => (
              <span key={a} className="text-xs px-3 py-1.5 rounded-full" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}>{a}</span>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

const contentRenderers = {
  guides: (item) => <GuideContent item={item} />,
  equipment: (item) => <EquipmentContent item={item} />,
  transfers: (item) => <TransferContent item={item} />,
  housing: (item) => <HousingContent item={item} />,
}

function getItemPrice(item) {
  return item.price || 0
}

const SERVICE_TYPE_MAP = {
  guides: 'guide',
  equipment: 'equipment',
  transfers: 'transfer',
  housing: 'housing',
}

export default function MarketplaceDetailModal({ item, category, onClose }) {
  const navigate = useNavigate()

  if (!item) return null

  const price = getItemPrice(item)

  function handleBook() {
    const tripData = {
      id: `marketplace-${item.id}`,
      status: 'pending',
      date_start: new Date().toISOString().slice(0, 10),
      persons_count: 1,
      total_price: price,
      routes: {
        title: item.name || item.title || typeLabels[category],
        images_json: [item.avatar || item.image || ''],
      },
      trip_items: [
        {
          service_type: SERVICE_TYPE_MAP[category],
          unit_price: price,
          quantity: 1,
          total_price: price,
        },
      ],
    }
    onClose()
    navigate(`/payment/${tripData.id}`, { state: { marketplaceTrip: tripData } })
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full flex flex-col rounded-t-3xl"
        style={{ background: 'var(--color-bg)', maxHeight: '75vh' }}
      >

      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3"
        style={{ borderBottom: '1px solid var(--color-bg-secondary)' }}>
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{typeLabels[category]}</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Подробная информация</p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer"
          style={{ background: 'var(--color-bg-secondary)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4" style={{ minHeight: 0 }}>
        {contentRenderers[category](item)}
        <ReviewsList reviewableType={SERVICE_TYPE_MAP[category]} reviewableId={item.id} />
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-5 pt-3 pb-24"
        style={{ borderTop: '1px solid var(--color-bg-secondary)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Стоимость</span>
          <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
            {price.toLocaleString()} тг
          </span>
        </div>
        <button
          onClick={handleBook}
          className="w-full py-4 rounded-2xl text-base font-bold border-none cursor-pointer active:scale-[0.98] transition-transform"
          style={{ background: 'var(--color-primary)', color: '#fff' }}
        >
          Забронировать и оплатить
        </button>
      </div>
      </div>
    </div>
  )
}
