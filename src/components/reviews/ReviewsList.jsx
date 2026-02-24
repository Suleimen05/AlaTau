import { useState, useEffect } from 'react'
import ReviewCard from './ReviewCard'
import { getReviews, DEMO_REVIEWS } from '../../services/reviews'
import { useAuth } from '../../context/AuthContext'

export default function ReviewsList({ reviewableType, reviewableId }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!reviewableId) { setLoading(false); return }

    if (!user) {
      setReviews(DEMO_REVIEWS)
      setLoading(false)
      return
    }

    getReviews(reviewableType, reviewableId)
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user, reviewableType, reviewableId])

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0'

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Отзывы</p>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#F0C14B" stroke="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{avgRating}</span>
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              ({reviews.length})
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-4 text-center">
          <div className="w-6 h-6 rounded-full border-2 mx-auto animate-spin"
            style={{ borderColor: 'var(--color-text-secondary)', borderTopColor: 'transparent' }} />
        </div>
      ) : reviews.length > 0 ? (
        <div>
          {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
        </div>
      ) : (
        <p className="text-xs py-3" style={{ color: 'var(--color-text-secondary)' }}>
          Пока нет отзывов
        </p>
      )}
    </div>
  )
}
