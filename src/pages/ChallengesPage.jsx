import { useState, useEffect } from 'react'
import PageHeader from '../components/layout/PageHeader'
import ChallengeCard from '../components/challenges/ChallengeCard'
import { useAuth } from '../context/AuthContext'
import { getChallenges, getEcoPoints } from '../services/challenges'

export default function ChallengesPage() {
  const { user } = useAuth()
  const [challenges,  setChallenges]  = useState([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [maxPoints,   setMaxPoints]   = useState(1)
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([getChallenges(user?.id), getEcoPoints(user?.id)])
      .then(([ch, pts]) => {
        setChallenges(ch)
        setTotalPoints(pts.totalPoints)
        setMaxPoints(pts.maxPoints || 1)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  const percent = Math.round((totalPoints / maxPoints) * 100)

  return (
    <div>
      <PageHeader title="Эко-челленджи" subtitle="Получай награды за активность" />

      <div className="px-5">
        <div className="rounded-2xl p-5" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                {totalPoints}
                <span className="text-lg font-normal" style={{ color: 'var(--color-text-secondary)' }}>/{maxPoints}</span>
              </div>
              <div className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>очков получено</div>
            </div>
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#E8F5E9' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0012 0V2Z" />
              </svg>
            </div>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: '10px', background: 'var(--color-bg-secondary)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, background: '#34C759' }} />
          </div>
          <div className="flex justify-between mt-3">
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {user?.level_name || 'Новичок'}
            </span>
            <span className="text-xs font-medium" style={{ color: '#34C759' }}>{percent}%</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 pb-6">
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>Доступные челленджи</h2>
        {loading ? (
          <div className="text-center py-10">
            <div className="w-8 h-8 rounded-full border-2 mx-auto animate-spin"
              style={{ borderColor: 'var(--color-text-secondary)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
