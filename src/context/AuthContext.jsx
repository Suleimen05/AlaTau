import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

const EDGE_FN = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/telegram-auth`

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Проверяем существующую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUser(session.user.id)
      } else {
        loginWithTelegram()
      }
    })

    // Слушаем изменения авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        loadUser(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadUser(userId) {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      setUser(data)
    } finally {
      setLoading(false)
    }
  }

  async function loginWithTelegram() {
    try {
      const initData = window.Telegram?.WebApp?.initData
      if (!initData) {
        // Dev-режим: без Telegram — пропускаем авторизацию
        console.warn('[Auth] Not in Telegram WebApp — skipping auth')
        setLoading(false)
        return
      }

      const res = await fetch(EDGE_FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      })

      const json = await res.json()

      if (json.session) {
        await supabase.auth.setSession(json.session)
        setUser(json.user)
      }
    } catch (err) {
      console.error('[Auth] Telegram login failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
