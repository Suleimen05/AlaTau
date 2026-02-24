import { useState } from 'react'
import { submitReview } from '../../services/reviews'

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} onClick={() => onChange(i)}
          className="border-none bg-transparent cursor-pointer p-1 active:scale-110 transition-transform">
          <svg width="28" height="28" viewBox="0 0 24 24"
            fill={i <= value ? '#F0C14B' : 'none'}
            stroke={i <= value ? '#F0C14B' : 'var(--color-text-secondary)'}
            strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function ReviewForm({ userId, tripId, reviewableType, reviewableId, onSubmitted, onCancel }) {
  const [rating,  setRating]  = useState(0)
  const [comment, setComment] = useState('')
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [done,    setDone]    = useState(false)

  async function handleSubmit() {
    if (rating === 0) { setError('Выберите оценку'); return }
    setError('')
    setSaving(true)
    try {
      await submitReview({ userId, tripId, reviewableType, reviewableId, rating, comment })
      setDone(true)
      onSubmitted?.()
    } catch (err) {
      setError(err.message || 'Ошибка отправки')
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" className="mx-auto mb-2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Спасибо за отзыв!</p>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>Ваша оценка учтена</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-4 space-y-4" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
      <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Оставить отзыв</p>

      <div className="flex flex-col items-center gap-1">
        <StarPicker value={rating} onChange={setRating} />
        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {rating === 0 ? 'Нажмите на звезду' : `${rating} из 5`}
        </span>
      </div>

      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Расскажите о вашем опыте (необязательно)"
        rows={3}
        className="w-full px-4 py-3 rounded-xl text-sm border-none outline-none resize-none"
        style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
      />

      {error && (
        <p className="text-xs font-medium" style={{ color: '#FF3B30' }}>{error}</p>
      )}

      <div className="flex gap-3">
        {onCancel && (
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-sm font-semibold border-none cursor-pointer"
            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>
            Отмена
          </button>
        )}
        <button onClick={handleSubmit} disabled={saving}
          className="flex-1 py-3 rounded-xl text-sm font-bold border-none cursor-pointer active:scale-[0.98] transition-transform"
          style={{ background: saving ? 'var(--color-bg-secondary)' : '#34C759', color: saving ? 'var(--color-text-secondary)' : '#fff' }}>
          {saving ? 'Отправка...' : 'Отправить'}
        </button>
      </div>
    </div>
  )
}
