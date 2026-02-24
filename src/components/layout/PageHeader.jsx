export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between px-5 pt-6 pb-4">
      <div>
        <h1 className="text-[26px] font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>{title}</h1>
        {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{subtitle}</p>}
      </div>
      {action && action}
    </div>
  )
}
