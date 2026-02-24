export default function Rating({ value, reviews, light = false }) {
  return (
    <div className="inline-flex items-center gap-1" style={{
      background: light ? 'rgba(0,0,0,0.5)' : 'var(--color-accent)',
      padding: '3px 8px',
      borderRadius: '8px',
      backdropFilter: light ? 'blur(8px)' : 'none',
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" stroke="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="text-xs font-bold text-white">{value}</span>
      {reviews !== undefined && (
        <span className="text-[10px] text-white/70">({reviews})</span>
      )}
    </div>
  )
}
