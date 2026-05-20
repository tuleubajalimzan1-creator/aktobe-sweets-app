import React from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { useUser } from '@/context/UserContext'
import { useApp } from '@/context/AppContext'

/* ── Avatar gradient map ── */
const LABEL_COLORS: Record<string, [string, string]> = {
  А: [COLORS.pink, COLORS.gold],      Б: ['#7c3aed', '#a78bfa'],
  В: ['#059669', '#34d399'],           Д: ['#ea580c', '#fb923c'],
  Е: [COLORS.gold, '#fbbf24'],         З: ['#0284c7', '#38bdf8'],
  И: ['#be185d', '#f472b6'],           К: ['#7c3aed', '#c084fc'],
  Л: ['#047857', '#6ee7b7'],           М: ['#b45309', '#fcd34d'],
  Н: ['#0369a1', '#7dd3fc'],           О: [COLORS.pink, '#fda4af'],
  П: ['#92400e', '#fbbf24'],           Р: ['#be185d', '#f9a8d4'],
  С: ['#065f46', '#6ee7b7'],           Т: ['#7c3aed', '#ddd6fe'],
  У: ['#dc2626', '#fca5a5'],           Ф: ['#0369a1', '#bae6fd'],
  Х: ['#78350f', '#fcd34d'],           Ч: ['#4f46e5', '#a5b4fc'],
  Э: ['#0f766e', '#5eead4'],           Я: ['#be123c', '#fda4af'],
}
function avatarColors(name: string): [string, string] {
  return LABEL_COLORS[name.trim().charAt(0).toUpperCase()] ?? [COLORS.pink, COLORS.gold]
}

/* ── Sub-components ── */
function MenuRow({ icon, label, badge, onPress, danger }: {
  icon: string; label: string; badge?: string | null; onPress: () => void; danger?: boolean
}) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Ionicons name={icon as any} size={18} color={danger ? '#dc2626' : COLORS.chocolate} />
      </View>
      <Text style={[styles.menuLabel, danger && { color: '#dc2626' }]}>{label}</Text>
      <View style={styles.menuRight}>
        {badge ? (
          <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>
        ) : null}
        <Ionicons name="chevron-forward" size={15} color={COLORS.border} />
      </View>
    </TouchableOpacity>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={[styles.sectionCard, SHADOWS.sm]}>
        {React.Children.map(children, (child, i) => (
          <>{i > 0 && <View style={styles.divider} />}{child}</>
        ))}
      </View>
    </View>
  )
}

/* ── Guest view ── */
const GUEST_BENEFITS = [
  { icon: 'receipt-outline',    text: 'История заказов' },
  { icon: 'location-outline',   text: 'Сохранённые адреса' },
  { icon: 'heart-outline',      text: 'Избранные десерты' },
  { icon: 'repeat-outline',     text: 'Быстрые повторные заказы' },
  { icon: 'gift-outline',       text: 'Бонусы и реферальная программа' },
]

function GuestProfile() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.guestContent, { paddingBottom: 120 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <LinearGradient
        colors={[COLORS.chocolate, '#5c3518']}
        style={[styles.guestHero, { paddingTop: insets.top + 20 }]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <View style={styles.guestAvatar}>
          <Ionicons name="person-outline" size={38} color="rgba(255,255,255,0.7)" />
        </View>
        <Text style={styles.guestTitle}>Вы не вошли</Text>
        <Text style={styles.guestSub}>Войдите, чтобы получить доступ{'\n'}ко всем функциям приложения</Text>
      </LinearGradient>

      {/* Auth buttons */}
      <View style={styles.guestBtns}>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/auth')} activeOpacity={0.85}>
          <Text style={styles.loginBtnText}>Войти в аккаунт</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/auth')} activeOpacity={0.85}>
          <Text style={styles.registerBtnText}>Зарегистрироваться</Text>
        </TouchableOpacity>
      </View>

      {/* Benefits */}
      <Text style={styles.benefitsTitle}>Что даёт аккаунт</Text>
      <View style={[styles.benefitsCard, SHADOWS.sm]}>
        {GUEST_BENEFITS.map((b, i) => (
          <React.Fragment key={b.text}>
            {i > 0 && <View style={styles.divider} />}
            <View style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <Ionicons name={b.icon as any} size={18} color={COLORS.chocolate} />
              </View>
              <Text style={styles.benefitText}>{b.text}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      <Text style={styles.version}>Aktobe Sweets v1.0.0</Text>
    </ScrollView>
  )
}

/* ── Main screen ── */
export default function ProfileScreen() {
  const router  = useRouter()
  const insets  = useSafeAreaInsets()
  const { profile, addresses, paymentMethods, repeats, reviews, logout, ordersCount, savesCount } = useUser()
  const { savedPosts } = useApp()

  if (!profile) return <GuestProfile />

  const initial  = profile.fullName.trim().charAt(0).toUpperCase()
  const [c1, c2] = avatarColors(profile.fullName)
  const defaultAddr = addresses.find(a => a.isDefault)
  const defaultPay  = paymentMethods.find(m => m.isDefault)
  const savesTotal  = savedPosts.size + savesCount

  const handleLogout = () => {
    Alert.alert('Выйти из аккаунта?', 'Вы можете войти снова в любое время', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive', onPress: logout },
    ])
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingBottom: 120 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={[COLORS.chocolate, '#5c3518']}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/profile-edit')} style={styles.avatarWrap}>
          <LinearGradient colors={[c1, c2]} style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </LinearGradient>
          <View style={styles.avatarEditBadge}>
            <Ionicons name="pencil" size={10} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.userName}>{profile.fullName}</Text>
        <Text style={styles.userSub}>
          {profile.phone
            ? `+7 ${profile.phone.slice(0, 3)} ${profile.phone.slice(3, 6)} ${profile.phone.slice(6)}`
            : profile.email}
        </Text>

        <View style={styles.statsRow}>
          {[
            { label: 'Заказов',    value: String(ordersCount) },
            { label: 'Сохранено',  value: String(savesTotal) },
            { label: 'Повторений', value: String(repeats.length) },
            { label: 'Отзывов',    value: String(reviews.length) },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>
      </LinearGradient>

      {/* Info chips */}
      {(defaultAddr || defaultPay) && (
        <View style={styles.infoChips}>
          {defaultAddr && (
            <TouchableOpacity style={styles.infoChip} onPress={() => router.push('/addresses')} activeOpacity={0.8}>
              <Ionicons name="location-outline" size={13} color={COLORS.muted} />
              <Text style={styles.infoChipText} numberOfLines={1}>{defaultAddr.street} {defaultAddr.house}</Text>
            </TouchableOpacity>
          )}
          {defaultPay && (
            <TouchableOpacity style={styles.infoChip} onPress={() => router.push('/payment')} activeOpacity={0.8}>
              <Ionicons name="card-outline" size={13} color={COLORS.muted} />
              <Text style={styles.infoChipText}>{defaultPay.title}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Menu */}
      <Section title="Личный кабинет">
        <MenuRow icon="person-outline"        label="Личные данные"   onPress={() => router.push('/profile-edit')} />
        <MenuRow icon="location-outline"      label="Адреса доставки" onPress={() => router.push('/addresses')} badge={addresses.length > 0 ? String(addresses.length) : null} />
        <MenuRow icon="card-outline"          label="Способы оплаты"  onPress={() => router.push('/payment')} badge={paymentMethods.length > 0 ? String(paymentMethods.length) : null} />
        <MenuRow icon="notifications-outline" label="Уведомления"     onPress={() => router.push('/settings')} />
      </Section>

      <Section title="Активность">
        <MenuRow icon="heart-outline"  label="Избранное"             onPress={() => router.push('/wishlist')} badge={savesTotal > 0 ? String(savesTotal) : null} />
        <MenuRow icon="repeat-outline" label="Мои повторения"        onPress={() => router.push('/repeats')} badge={repeats.length > 0 ? String(repeats.length) : null} />
        <MenuRow icon="star-outline"   label="Мои отзывы"            onPress={() => router.push('/reviews')} badge={reviews.length > 0 ? String(reviews.length) : null} />
        <MenuRow icon="gift-outline"   label="Реферальная программа" onPress={() => router.push('/referral')} />
      </Section>

      <Section title="Поддержка">
        <MenuRow icon="chatbubble-ellipses-outline" label="Чат с поддержкой" onPress={() => router.push('/support')} />
        <MenuRow icon="help-circle-outline"         label="FAQ"              onPress={() => router.push('/faq')} />
      </Section>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={18} color="#dc2626" />
        <Text style={styles.logoutText}>Выйти из аккаунта</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Aktobe Sweets v1.0.0</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.cream },
  content: {},

  /* Authenticated header */
  header: { paddingBottom: SPACING.lg, paddingHorizontal: SPACING.md, alignItems: 'center', gap: 6 },
  settingsBtn: { position: 'absolute', top: 0, right: SPACING.md, width: 38, height: 38, borderRadius: RADIUS.sm, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  avatarWrap: { position: 'relative', marginBottom: 4 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },
  avatarText: { fontFamily: FONTS.serif, fontSize: 32, fontWeight: '700', color: '#fff' },
  avatarEditBadge: { position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  userName: { fontFamily: FONTS.serif, fontSize: 22, fontWeight: '700', color: '#fff' },
  userSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: RADIUS.lg, paddingVertical: 14, paddingHorizontal: 16, alignSelf: 'stretch' },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 10.5, color: 'rgba(255,255,255,0.65)', fontWeight: '500' },
  statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.2)' },

  /* Info chips */
  infoChips: { flexDirection: 'row', gap: 8, paddingHorizontal: SPACING.md, paddingTop: SPACING.md },
  infoChip: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  infoChipText: { flex: 1, fontSize: 11.5, color: COLORS.muted, fontWeight: '500' },

  /* Menu */
  section: { paddingHorizontal: SPACING.md, marginTop: SPACING.lg, gap: 8 },
  sectionTitle: { fontSize: 10.5, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.8, marginLeft: 4 },
  sectionCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.md + 34 + 14 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: SPACING.md },
  menuIcon: { width: 34, height: 34, borderRadius: RADIUS.sm, backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center' },
  menuIconDanger: { backgroundColor: '#fee2e2' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.chocolate },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.pink, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },

  /* Logout */
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: SPACING.md, marginTop: SPACING.xl, paddingVertical: 14, borderRadius: RADIUS.full, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#fecaca' },
  logoutText: { fontSize: 14, fontWeight: '600', color: '#dc2626' },

  version: { textAlign: 'center', fontSize: 11, color: COLORS.muted, marginTop: SPACING.md },

  /* ── Guest styles ── */
  guestContent: {},
  guestHero: { paddingBottom: SPACING.xl, paddingHorizontal: SPACING.md, alignItems: 'center', gap: 10 },
  guestAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)', marginBottom: 4 },
  guestTitle: { fontFamily: FONTS.serif, fontSize: 22, fontWeight: '700', color: '#fff' },
  guestSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 20 },

  guestBtns: { paddingHorizontal: SPACING.md, paddingTop: SPACING.lg, gap: 10 },
  loginBtn: { backgroundColor: COLORS.chocolate, borderRadius: RADIUS.full, paddingVertical: 15, alignItems: 'center' },
  loginBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  registerBtn: { borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.chocolate, backgroundColor: '#fff' },
  registerBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.chocolate },

  benefitsTitle: { fontSize: 10.5, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.8, marginLeft: SPACING.md + 4, marginTop: SPACING.lg, marginBottom: 8 },
  benefitsCard: { marginHorizontal: SPACING.md, backgroundColor: '#fff', borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: SPACING.md },
  benefitIcon: { width: 34, height: 34, borderRadius: RADIUS.sm, backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center' },
  benefitText: { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.chocolate },
})
