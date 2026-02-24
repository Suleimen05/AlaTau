export default function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default: { background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' },
    dark: { background: 'rgba(0,0,0,0.5)', color: '#fff', backdropFilter: 'blur(8px)' },
    success: { background: '#E8F5E9', color: '#2E7D32' },
    warning: { background: '#FFF3E0', color: '#E65100' },
    danger: { background: '#FFEBEE', color: '#C62828' },
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${className}`}
      style={styles[variant] || styles.default}
    >
      {children}
    </span>
  )
}
