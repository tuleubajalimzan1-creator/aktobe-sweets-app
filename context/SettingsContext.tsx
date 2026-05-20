import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { translations, Lang, Translations } from '@/constants/i18n'

export interface Settings {
  pushNotifications: boolean
  emailNotifications: boolean
  promotions: boolean
  feedActivity: boolean
  privateProfile: boolean
  showPrices: boolean
  language: Lang
}

export const SETTINGS_DEFAULTS: Settings = {
  pushNotifications: true,
  emailNotifications: true,
  promotions: true,
  feedActivity: true,
  privateProfile: false,
  showPrices: true,
  language: 'ru',
}

const STORAGE_KEY = '@aktobe_settings_v1'

interface SettingsCtxValue {
  settings: Settings
  t: Translations
  isLoaded: boolean
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  reset: () => void
}

const SettingsContext = createContext<SettingsCtxValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(SETTINGS_DEFAULTS)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as Partial<Settings>
            setSettings(prev => ({ ...prev, ...parsed }))
          } catch {}
        }
      })
      .finally(() => setIsLoaded(true))
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch(() => {})
  }, [settings, isLoaded])

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    setSettings(SETTINGS_DEFAULTS)
  }, [])

  const t = translations[settings.language]

  return (
    <SettingsContext.Provider value={{ settings, t, isLoaded, update, reset }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
