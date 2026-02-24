export default function Avatar({ src, alt, size = 'md' }) {
  const sizes = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
  }

  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden flex-shrink-0`} style={{ background: 'var(--color-bg-secondary)' }}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  )
}
