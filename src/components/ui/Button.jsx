export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold transition-all active:scale-[0.97] rounded-xl'

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-3.5 text-base',
    full: 'px-5 py-3.5 text-sm w-full',
  }

  const style = variant === 'primary'
    ? { background: 'var(--color-primary)', color: 'var(--color-bg)' }
    : variant === 'secondary'
    ? { color: 'var(--color-text)', border: '1px solid var(--color-border)', background: 'transparent' }
    : { color: 'var(--color-text-secondary)', background: 'transparent' }

  return (
    <button className={`${base} ${sizes[size]} ${className}`} style={style} {...props}>
      {children}
    </button>
  )
}
