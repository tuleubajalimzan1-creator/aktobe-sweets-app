import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AppState {
  likedPosts: Set<string>
  savedPosts: Set<string>
  followedChefs: Set<string>
  cartCount: number
  toggleLike: (id: string) => void
  toggleSave: (id: string) => void
  toggleFollow: (id: string) => void
  addToCart: () => void
  isLiked: (id: string) => boolean
  isSaved: (id: string) => boolean
  isFollowed: (id: string) => boolean
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set())
  const [followedChefs, setFollowedChefs] = useState<Set<string>>(new Set())
  const [cartCount, setCartCount] = useState(2)

  const toggleLike = (id: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSave = (id: string) => {
    setSavedPosts(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleFollow = (id: string) => {
    setFollowedChefs(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const addToCart = () => setCartCount(n => n + 1)

  return (
    <AppContext.Provider value={{
      likedPosts, savedPosts, followedChefs, cartCount,
      toggleLike, toggleSave, toggleFollow, addToCart,
      isLiked: (id) => likedPosts.has(id),
      isSaved: (id) => savedPosts.has(id),
      isFollowed: (id) => followedChefs.has(id),
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
