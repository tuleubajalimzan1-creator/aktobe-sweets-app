import React, { useRef, useState } from 'react'
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Animated,
  Dimensions, ActivityIndicator,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { useUser } from '@/context/UserContext'

const { width: W } = Dimensions.get('window')

type Tab = 'login' | 'register'

/* ── Input field ── */
function Field({
  icon, placeholder, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize,
}: {
  icon: string
  placeholder: string
  value: string
  onChangeText: (v: string) => void
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'phone-pad' | 'email-address'
  autoCapitalize?: 'none' | 'sentences' | 'words'
}) {
  const [focused, setFocused] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const isPass = secureTextEntry === true

  return (
    <View style={[styles.field, focused && styles.fieldFocused]}>
      <Ionicons name={icon as any} size={18} color={focused ? COLORS.chocolate : COLORS.muted} />
      <TextInput
        style={styles.fieldInput}
        placeholder={placeholder}
        placeholderTextColor={COLORS.muted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPass && !showPass}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="next"
      />
      {isPass && (
        <TouchableOpacity onPress={() => setShowPass(v => !v)}>
          <Ionicons
            name={showPass ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color={COLORS.muted}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

/* ── Login form ── */
function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { login } = useUser()
  const [phone, setPhone]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    const res = await login(phone, password)
    setLoading(false)
    if (!res.success) setError(res.error ?? 'Ошибка входа')
  }

  return (
    <View style={styles.form}>
      <Field
        icon="call-outline"
        placeholder="+7 (___) ___-__-__"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
      <Field
        icon="lock-closed-outline"
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={15} color="#dc2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.submitBtn, loading && { opacity: 0.75 }]}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.submitText}>Войти</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchLink} onPress={onSwitch}>
        <Text style={styles.switchText}>
          Нет аккаунта? <Text style={styles.switchAccent}>Зарегистрироваться</Text>
        </Text>
      </TouchableOpacity>
    </View>
  )
}

/* ── Register form ── */
function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const { register } = useUser()
  const [fullName, setFullName]   = useState('')
  const [phone, setPhone]         = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  const handleRegister = async () => {
    setError('')
    if (password !== confirm) { setError('Пароли не совпадают'); return }
    setLoading(true)
    const res = await register(fullName, phone, email, password)
    setLoading(false)
    if (!res.success) setError(res.error ?? 'Ошибка регистрации')
  }

  return (
    <View style={styles.form}>
      <Field
        icon="person-outline"
        placeholder="Имя и фамилия"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
      />
      <Field
        icon="call-outline"
        placeholder="+7 (___) ___-__-__"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
      <Field
        icon="mail-outline"
        placeholder="Email (необязательно)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Field
        icon="lock-closed-outline"
        placeholder="Пароль (минимум 4 символа)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Field
        icon="lock-closed-outline"
        placeholder="Повторите пароль"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        autoCapitalize="none"
      />

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={15} color="#dc2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.submitBtn, loading && { opacity: 0.75 }]}
        onPress={handleRegister}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.submitText}>Зарегистрироваться</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchLink} onPress={onSwitch}>
        <Text style={styles.switchText}>
          Уже есть аккаунт? <Text style={styles.switchAccent}>Войти</Text>
        </Text>
      </TouchableOpacity>
    </View>
  )
}

/* ── Main Component ── */
export default function AuthScreen() {
  const insets  = useSafeAreaInsets()
  const [tab, setTab] = useState<Tab>('login')
  const slideAnim = useRef(new Animated.Value(0)).current

  const switchTab = (next: Tab) => {
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: next === 'register' ? -20 : 20, duration: 80, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 60 }),
    ]).start()
    setTab(next)
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.root}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient
            colors={[COLORS.chocolate, '#5c3518']}
            style={styles.logoWrap}
          >
            <Text style={styles.logoEmoji}>🍰</Text>
          </LinearGradient>
          <Text style={styles.appName}>Aktobe Sweets</Text>
          <Text style={styles.appTagline}>Десерты с душой</Text>
        </View>

        {/* Tab switcher */}
        <View style={styles.tabRow}>
          {(['login', 'register'] as Tab[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
              onPress={() => switchTab(t)}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>
                {t === 'login' ? 'Войти' : 'Регистрация'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form */}
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          <View style={[styles.card, SHADOWS.md]}>
            {tab === 'login'
              ? <LoginForm onSwitch={() => switchTab('register')} />
              : <RegisterForm onSwitch={() => switchTab('login')} />}
          </View>
        </Animated.View>

        {/* Footer */}
        <Text style={styles.footer}>
          Регистрируясь, вы соглашаетесь с{'\n'}условиями использования и политикой конфиденциальности
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

/* ── Styles ── */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.cream },
  content: { paddingHorizontal: SPACING.md, alignItems: 'center' },

  /* Hero */
  hero: { alignItems: 'center', gap: 8, marginBottom: SPACING.lg },
  logoWrap: {
    width: 72, height: 72, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
    ...SHADOWS.md,
  },
  logoEmoji: { fontSize: 36 },
  appName: {
    fontFamily: FONTS.serif, fontSize: 28, fontWeight: '700', color: COLORS.chocolate,
  },
  appTagline: { fontSize: 14, color: COLORS.muted },

  /* Tabs */
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: RADIUS.full,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    alignSelf: 'stretch',
    ...SHADOWS.sm,
  },
  tabBtn: {
    flex: 1, paddingVertical: 10, borderRadius: RADIUS.full,
    alignItems: 'center', justifyContent: 'center',
  },
  tabBtnActive: { backgroundColor: COLORS.chocolate },
  tabLabel: { fontSize: 14, fontWeight: '600', color: COLORS.muted },
  tabLabelActive: { color: '#fff' },

  /* Card */
  card: {
    backgroundColor: '#fff', borderRadius: RADIUS.xl,
    padding: SPACING.md, alignSelf: 'stretch',
    borderWidth: 1, borderColor: COLORS.border,
  },

  /* Form */
  form: { gap: 12 },
  field: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.cream, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.border,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  fieldFocused: { borderColor: COLORS.chocolate, backgroundColor: '#fdf5ee' },
  fieldInput: { flex: 1, fontSize: 15, color: COLORS.chocolate },

  /* Error */
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fef2f2', borderRadius: RADIUS.sm,
    padding: 12, borderWidth: 1, borderColor: '#fecaca',
  },
  errorText: { flex: 1, fontSize: 13, color: '#dc2626' },

  /* Submit */
  submitBtn: {
    backgroundColor: COLORS.chocolate, borderRadius: RADIUS.full,
    paddingVertical: 15, alignItems: 'center', marginTop: 4,
  },
  submitText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  /* Switch */
  switchLink: { alignItems: 'center', paddingTop: 4 },
  switchText: { fontSize: 13, color: COLORS.muted },
  switchAccent: { color: COLORS.chocolate, fontWeight: '700' },

  /* Footer */
  footer: {
    fontSize: 11, color: COLORS.mutedLight, textAlign: 'center',
    marginTop: SPACING.lg, lineHeight: 16,
  },
})
