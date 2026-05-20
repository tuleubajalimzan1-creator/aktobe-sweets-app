import React, {
  createContext, useContext, useState, useEffect, useCallback, ReactNode,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

/* ── Types ─────────────────────────────────────────── */
export type Gender = 'male' | 'female' | null

export interface BuyerProfile {
  id: string
  fullName: string
  phone: string
  email: string
  avatar?: string
  birthDate?: string
  gender?: Gender
  role: 'buyer'
  createdAt: string
}

export interface Address {
  id: string
  label: 'home' | 'work' | 'other'
  city: string
  street: string
  house: string
  apartment?: string
  entrance?: string
  floor?: string
  comment?: string
  isDefault: boolean
}

export interface PaymentMethod {
  id: string
  type: 'kaspi_pay' | 'kaspi_qr' | 'visa' | 'mastercard' | 'cash'
  title: string
  maskedDetails?: string
  isDefault: boolean
}

export interface Repeat {
  id: string
  title: string
  previewEmoji: string
  date: string
  status: 'draft' | 'ordered' | 'saved' | 'published'
}

export interface Review {
  id: string
  chefName: string
  productName: string
  rating: number
  text: string
  date: string
}

interface StoredUser {
  phone: string
  password: string
  profile: BuyerProfile
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  repeats: Repeat[]
  reviews: Review[]
  referralCode: string
  referralCount: number
  referralBonus: number
  ordersCount: number
  savesCount: number
}

interface AuthResult { success: boolean; error?: string }

interface UserCtx {
  isAuthenticated: boolean
  isLoaded: boolean
  profile: BuyerProfile | null
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  repeats: Repeat[]
  reviews: Review[]
  referralCode: string
  referralCount: number
  referralBonus: number
  ordersCount: number
  savesCount: number
  login: (phone: string, password: string) => Promise<AuthResult>
  register: (fullName: string, phone: string, email: string, password: string) => Promise<AuthResult>
  logout: () => void
  updateProfile: (data: Partial<BuyerProfile>) => void
  addAddress: (a: Omit<Address, 'id'>) => void
  updateAddress: (id: string, data: Partial<Omit<Address, 'id'>>) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  addPaymentMethod: (m: Omit<PaymentMethod, 'id'>) => void
  deletePaymentMethod: (id: string) => void
  setDefaultPayment: (id: string) => void
  deleteRepeat: (id: string) => void
  deleteReview: (id: string) => void
}

/* ── Storage keys ──────────────────────────────────── */
const USERS_KEY   = '@aktobe_users_v2'
const SESSION_KEY = '@aktobe_session_v2'

/* ── Helpers ───────────────────────────────────────── */
const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

const normalizePhone = (p: string) => p.replace(/\D/g, '').slice(-10)

const genReferralCode = (name: string) =>
  (name.toUpperCase().replace(/\s+/g, '').slice(0, 5) +
   Math.floor(1000 + Math.random() * 9000)).slice(0, 9)

async function loadUsers(): Promise<StoredUser[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

async function saveUsers(users: StoredUser[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users)).catch(() => {})
}

/* ── Context ───────────────────────────────────────── */
const UserContext = createContext<UserCtx | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<StoredUser | null>(null)
  const [isLoaded, setIsLoaded]   = useState(false)

  /* Load session on mount */
  useEffect(() => {
    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY)
        if (raw) {
          const { phone } = JSON.parse(raw)
          const users = await loadUsers()
          const user  = users.find(u => u.phone === phone)
          if (user) setCurrent(user)
        }
      } catch {}
      setIsLoaded(true)
    })()
  }, [])

  /* Sync current user back to storage whenever it changes */
  useEffect(() => {
    if (!current) return
    loadUsers().then(users => {
      const idx = users.findIndex(u => u.phone === current.phone)
      if (idx >= 0) users[idx] = current
      else users.push(current)
      saveUsers(users)
    })
  }, [current])

  /* Mutate helper */
  const mut = useCallback((fn: (u: StoredUser) => StoredUser) => {
    setCurrent(prev => (prev ? fn({ ...prev }) : prev))
  }, [])

  /* ── Auth actions ── */
  const login = useCallback(async (phone: string, password: string): Promise<AuthResult> => {
    const normalized = normalizePhone(phone)
    if (normalized.length < 10) return { success: false, error: 'Введите корректный номер телефона' }
    if (password.length < 4)    return { success: false, error: 'Пароль слишком короткий' }
    const users = await loadUsers()
    const user  = users.find(u => u.phone === normalized)
    if (!user)                   return { success: false, error: 'Пользователь не найден' }
    if (user.password !== password) return { success: false, error: 'Неверный пароль' }
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ phone: normalized }))
    setCurrent(user)
    return { success: true }
  }, [])

  const register = useCallback(async (
    fullName: string, phone: string, email: string, password: string,
  ): Promise<AuthResult> => {
    if (!fullName.trim())       return { success: false, error: 'Введите имя' }
    const normalized = normalizePhone(phone)
    if (normalized.length < 10) return { success: false, error: 'Введите корректный номер' }
    if (password.length < 4)    return { success: false, error: 'Пароль минимум 4 символа' }
    const users = await loadUsers()
    if (users.find(u => u.phone === normalized))
      return { success: false, error: 'Этот номер уже зарегистрирован' }

    const newUser: StoredUser = {
      phone: normalized, password,
      profile: {
        id: genId(), fullName: fullName.trim(), phone: normalized, email: email.trim(),
        role: 'buyer', createdAt: new Date().toISOString(),
      },
      addresses: [],
      paymentMethods: [{ id: genId(), type: 'kaspi_pay', title: 'Kaspi Pay', isDefault: true }],
      repeats: [], reviews: [],
      referralCode: genReferralCode(fullName),
      referralCount: 0, referralBonus: 0,
      ordersCount: 0, savesCount: 0,
    }
    users.push(newUser)
    await saveUsers(users)
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ phone: normalized }))
    setCurrent(newUser)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    AsyncStorage.removeItem(SESSION_KEY).catch(() => {})
    setCurrent(null)
  }, [])

  /* ── Profile ── */
  const updateProfile = useCallback((data: Partial<BuyerProfile>) => {
    mut(u => ({ ...u, profile: { ...u.profile, ...data, updatedAt: new Date().toISOString() } as BuyerProfile }))
  }, [mut])

  /* ── Addresses ── */
  const addAddress = useCallback((a: Omit<Address, 'id'>) => {
    mut(u => {
      const addresses = a.isDefault
        ? u.addresses.map(x => ({ ...x, isDefault: false }))
        : u.addresses
      return { ...u, addresses: [...addresses, { ...a, id: genId() }] }
    })
  }, [mut])

  const updateAddress = useCallback((id: string, data: Partial<Omit<Address, 'id'>>) => {
    mut(u => ({
      ...u,
      addresses: u.addresses.map(a => a.id === id ? { ...a, ...data } : a),
    }))
  }, [mut])

  const deleteAddress = useCallback((id: string) => {
    mut(u => ({ ...u, addresses: u.addresses.filter(a => a.id !== id) }))
  }, [mut])

  const setDefaultAddress = useCallback((id: string) => {
    mut(u => ({
      ...u,
      addresses: u.addresses.map(a => ({ ...a, isDefault: a.id === id })),
    }))
  }, [mut])

  /* ── Payment ── */
  const addPaymentMethod = useCallback((m: Omit<PaymentMethod, 'id'>) => {
    mut(u => {
      const methods = m.isDefault
        ? u.paymentMethods.map(x => ({ ...x, isDefault: false }))
        : u.paymentMethods
      return { ...u, paymentMethods: [...methods, { ...m, id: genId() }] }
    })
  }, [mut])

  const deletePaymentMethod = useCallback((id: string) => {
    mut(u => ({ ...u, paymentMethods: u.paymentMethods.filter(m => m.id !== id) }))
  }, [mut])

  const setDefaultPayment = useCallback((id: string) => {
    mut(u => ({
      ...u,
      paymentMethods: u.paymentMethods.map(m => ({ ...m, isDefault: m.id === id })),
    }))
  }, [mut])

  /* ── Repeats & Reviews ── */
  const deleteRepeat = useCallback((id: string) => {
    mut(u => ({ ...u, repeats: u.repeats.filter(r => r.id !== id) }))
  }, [mut])

  const deleteReview = useCallback((id: string) => {
    mut(u => ({ ...u, reviews: u.reviews.filter(r => r.id !== id) }))
  }, [mut])

  const value: UserCtx = {
    isAuthenticated: !!current,
    isLoaded,
    profile:        current?.profile        ?? null,
    addresses:      current?.addresses      ?? [],
    paymentMethods: current?.paymentMethods ?? [],
    repeats:        current?.repeats        ?? [],
    reviews:        current?.reviews        ?? [],
    referralCode:   current?.referralCode   ?? '',
    referralCount:  current?.referralCount  ?? 0,
    referralBonus:  current?.referralBonus  ?? 0,
    ordersCount:    current?.ordersCount    ?? 0,
    savesCount:     current?.savesCount     ?? 0,
    login, register, logout, updateProfile,
    addAddress, updateAddress, deleteAddress, setDefaultAddress,
    addPaymentMethod, deletePaymentMethod, setDefaultPayment,
    deleteRepeat, deleteReview,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
