import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { useAuth } from '../context/AuthContext'
import { recordMarketLead } from '../services/marketplace'

export default function MarketplacePage() {
  const [clicked, setClicked] = useState(false)
  const { user } = useAuth()

  const handleClick = async () => {
    setClicked(true)
    await recordMarketLead(user?.id)
    setTimeout(() => {
      alert("Спасибо за интерес! Мы свяжемся с вами в Telegram, как только раздел заработает.")
    }, 300)
  }

  return (
    <div className="h-full flex flex-col pt-4">
      <PageHeader title="Маркет" subtitle="Аренда экипировки и жилья" />
      
      <div className="flex-1 px-5 flex flex-col items-center justify-center pb-20">
        <div className="w-24 h-24 mb-6 relative">
          <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20"></div>
          <div className="relative w-full h-full rounded-full flex items-center justify-center" style={{ background: 'var(--color-bg-secondary)' }}>
            <span className="text-4xl">🏕️</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-3" style={{ color: 'var(--color-text)' }}>
          Скоро запуск!
        </h2>
        <p className="text-center text-sm mb-8 max-w-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Мы готовим для вас удобный маркетплейс палаток, рюкзаков, трансферов и глэмпингов.
        </p>

        <button
          onClick={handleClick}
          disabled={clicked}
          className="w-full max-w-xs py-4 rounded-2xl text-base font-bold text-white border-none cursor-pointer transition-all active:scale-95"
          style={{
            background: clicked ? 'var(--color-bg-secondary)' : '#34C759',
            color: clicked ? 'var(--color-text-secondary)' : '#fff',
            boxShadow: clicked ? 'none' : '0 8px 16px rgba(52, 199, 89, 0.25)'
          }}
        >
          {clicked ? 'Вы в списке ожидания!' : 'Сообщить мне о запуске'}
        </button>
      </div>
    </div>
  )
}
