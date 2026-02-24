export default function ProgressBar({ value, max = 100, height = 8, className = '' }) {
  const percent = Math.min((value / max) * 100, 100)

  return (
    <div className={`w-full rounded-full overflow-hidden ${className}`} style={{ height: `${height}px`, background: 'var(--color-bg-secondary)' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${percent}%`, background: '#34C759' }}
      />
    </div>
  )
}
