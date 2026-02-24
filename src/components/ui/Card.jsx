export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl overflow-hidden ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} ${className}`}
      style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}
    >
      {children}
    </div>
  )
}
