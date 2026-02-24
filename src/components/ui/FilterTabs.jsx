export default function FilterTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="px-5">
      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border-none cursor-pointer active:scale-[0.97] transition-all"
              style={{
                background: isActive ? '#34C759' : 'var(--color-bg-secondary)',
                color: isActive ? '#fff' : 'var(--color-text-secondary)',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
