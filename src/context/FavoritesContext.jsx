import { createContext, useContext, useState, useCallback } from 'react'

const STORAGE_KEY = 'alatau_favorites'

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveFavorites(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites)

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveFavorites(next)
      return next
    })
  }, [])

  const isFavorite = useCallback((id) => favorites.has(id), [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be inside FavoritesProvider')
  return ctx
}
