function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i <= rating ? '#F0C14B' : 'none'}
          stroke={i <= rating ? '#F0C14B' : 'var(--color-text-secondary)'}
          strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function ReviewCard({ review }) {
  return (
    <div className="flex gap-3 py-3" style={{ borderBottom: '1px solid var(--color-bg-secondary)' }}>
      <img
        src={review.userAvatar}
        alt={review.userName}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
            {review.userName}
          </span>
          <span className="text-[10px] flex-shrink-0 ml-2" style={{ color: 'var(--color-text-secondary)' }}>
            {review.timeAgo}
          </span>
        </div>
        <div className="mt-0.5">
          <Stars rating={review.rating} />
        </div>
        {review.comment && (
          <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {review.comment}
          </p>
        )}
      </div>
    </div>
  )
}
