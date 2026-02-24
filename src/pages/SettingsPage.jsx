import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../services/user'

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm border-none outline-none"
        style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
      />
    </div>
  )
}

export default function SettingsPage() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [lastName,  setLastName]  = useState(user?.last_name || '')
  const [username,  setUsername]  = useState(user?.username || '')
  const [phone,     setPhone]     = useState(user?.phone || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '')
  const [showAvatar, setShowAvatar] = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [toast,     setToast]     = useState('')
  const [error,     setError]     = useState('')

  if (!user) {
    return (
      <div className="flex flex-col h-full" style={{ background: 'var(--color-bg)' }}>
        <div className="flex-shrink-0 px-5 pt-4 pb-3 flex items-center gap-3"
          style={{ borderBottom: '1px solid var(--color-bg-secondary)' }}>
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer"
            style={{ background: 'var(--color-bg-secondary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2.5">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h1 className="text-[17px] font-bold" style={{ color: 'var(--color-text)' }}>Настройки</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.2" className="mb-4" style={{ opacity: 0.4 }}>
            <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          <p className="text-base font-medium" style={{ color: 'var(--color-text)' }}>Авторизуйтесь</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Откройте приложение через Telegram
          </p>
        </div>
      </div>
    )
  }

  const avatar = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}&backgroundColor=b6e3f4`

  async function handleSave() {
    setError('')

    if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username: только латиница, цифры и _')
      return
    }
    if (phone && !/^\+?[0-9]*$/.test(phone)) {
      setError('Телефон: только цифры и +')
      return
    }

    setSaving(true)
    try {
      const updated = await updateProfile(user.id, {
        first_name: firstName.trim() || null,
        last_name: lastName.trim() || null,
        username: username.trim() || null,
        phone: phone.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      })
      setUser(updated)
      setToast('Сохранено')
      setTimeout(() => setToast(''), 2000)
    } catch (err) {
      setError(err.message || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-bg)' }}>

      {/* Шапка */}
      <div className="flex-shrink-0 px-5 pt-4 pb-3 flex items-center gap-3"
        style={{ borderBottom: '1px solid var(--color-bg-secondary)' }}>
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer"
          style={{ background: 'var(--color-bg-secondary)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2.5">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="text-[17px] font-bold" style={{ color: 'var(--color-text)' }}>Настройки</h1>
      </div>

      {/* Контент */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

        {/* Аватар */}
        <div className="flex flex-col items-center">
          <button onClick={() => setShowAvatar(!showAvatar)}
            className="relative border-none cursor-pointer bg-transparent p-0">
            <img src={avatar} alt="Аватар"
              className="w-24 h-24 rounded-full object-cover"
              style={{ border: '3px solid var(--color-bg-secondary)' }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: '#34C759', border: '3px solid var(--color-bg)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </div>
          </button>
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>Нажмите чтобы изменить</p>
        </div>

        {showAvatar && (
          <Field
            label="URL аватара"
            value={avatarUrl}
            onChange={setAvatarUrl}
            placeholder="https://example.com/photo.jpg"
          />
        )}

        {/* Поля */}
        <div className="rounded-2xl p-4 space-y-4" style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
          <Field label="Имя" value={firstName} onChange={setFirstName} placeholder="Введите имя" />
          <Field label="Фамилия" value={lastName} onChange={setLastName} placeholder="Введите фамилию" />
          <Field label="Username" value={username} onChange={setUsername} placeholder="username" />
          <Field label="Телефон" value={phone} onChange={setPhone} placeholder="+7 777 123 4567" type="tel" />
        </div>

        {/* Ошибка */}
        {error && (
          <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: '#FFE5E5', color: '#FF3B30' }}>
            {error}
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: '#E8F5E9', color: '#34C759' }}>
            {toast}
          </div>
        )}
      </div>

      {/* Футер */}
      <div className="flex-shrink-0 px-5 pb-24 pt-4"
        style={{ borderTop: '1px solid var(--color-bg-secondary)' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-2xl text-base font-bold border-none cursor-pointer active:scale-[0.98] transition-transform"
          style={{ background: saving ? 'var(--color-bg-secondary)' : '#34C759', color: saving ? 'var(--color-text-secondary)' : '#fff' }}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </div>
  )
}
