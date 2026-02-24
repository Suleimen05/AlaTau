export default function SearchBar({ value, onChange, placeholder = 'Поиск...' }) {
  return (
    <div className="relative px-5">
      <svg
        className="absolute left-8 top-1/2 -translate-y-1/2"
        style={{ color: 'var(--color-text-light)' }}
        width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl pl-11 pr-12 py-3.5 text-sm outline-none"
        style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
      />
      <button className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center border-none cursor-pointer" style={{ background: 'var(--color-primary)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg)" strokeWidth="2" strokeLinecap="round">
          <path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14h6M9 8h6M17 16h6" />
        </svg>
      </button>
    </div>
  )
}
