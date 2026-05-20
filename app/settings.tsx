import React, { useRef, useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Modal, Animated, Dimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { useSettings, SETTINGS_DEFAULTS } from '@/context/SettingsContext'

const { width: W } = Dimensions.get('window')

const LANGUAGES = [
  { id: 'ru' as const, label: 'Русский',  flag: '🇷🇺', sub: 'Russian'  },
  { id: 'kz' as const, label: 'Қазақша', flag: '🇰🇿', sub: 'Kazakh'   },
]

/* ── Animated Toggle ── */
function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  const pos = useRef(new Animated.Value(value ? 1 : 0)).current

  useEffect(() => {
    Animated.spring(pos, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      speed: 55,
      bounciness: 7,
    }).start()
  }, [value])

  const thumbX = pos.interpolate({ inputRange: [0, 1], outputRange: [2, 22] })

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.85}>
      <View style={[styles.toggle, value && styles.toggleOn]}>
        <Animated.View style={[styles.toggleThumb, { transform: [{ translateX: thumbX }] }]} />
      </View>
    </TouchableOpacity>
  )
}

/* ── Toggle Row ── */
function ToggleRow({
  iconName, iconBg, iconColor, label, desc, value, onToggle,
}: {
  iconName: string; iconBg: string; iconColor: string
  label: string; desc: string; value: boolean; onToggle: () => void
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconBadge, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName as any} size={17} color={iconColor} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDesc}>{desc}</Text>
      </View>
      <Toggle value={value} onToggle={onToggle} />
    </View>
  )
}

/* ── Action Row ── */
function ActionRow({
  iconName, iconBg, iconColor, label, value, onPress, danger = false,
}: {
  iconName: string; iconBg: string; iconColor: string
  label: string; value?: string; onPress: () => void; danger?: boolean
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconBadge, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName as any} size={17} color={iconColor} />
      </View>
      <Text style={[styles.rowLabel, danger && styles.dangerText]}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <Ionicons
        name="chevron-forward"
        size={15}
        color={danger ? '#dc2626' : COLORS.border}
        style={{ marginLeft: value ? 2 : 0 }}
      />
    </TouchableOpacity>
  )
}

/* ── Section ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={[styles.sectionCard, SHADOWS.sm]}>
        {React.Children.map(children, (child, i) => (
          <>
            {i > 0 && <View style={styles.divider} />}
            {child}
          </>
        ))}
      </View>
    </View>
  )
}

/* ── Language Picker Modal ── */
function LangPicker({
  visible, current, onSelect, onClose, title,
}: {
  visible: boolean; current: string
  onSelect: (id: 'ru' | 'kz') => void; onClose: () => void; title: string
}) {
  const slideY = useRef(new Animated.Value(300)).current

  useEffect(() => {
    if (visible) {
      Animated.spring(slideY, {
        toValue: 0, useNativeDriver: true, tension: 60, friction: 10,
      }).start()
    } else {
      Animated.timing(slideY, { toValue: 300, duration: 220, useNativeDriver: true }).start()
    }
  }, [visible])

  if (!visible) return null

  return (
    <Modal transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.langSheet, { transform: [{ translateY: slideY }] }]}>
        <View style={styles.langHandle} />
        <Text style={styles.langTitle}>{title}</Text>
        {LANGUAGES.map(lang => {
          const active = lang.id === current
          return (
            <TouchableOpacity
              key={lang.id}
              style={[styles.langRow, active && styles.langRowActive]}
              onPress={() => { onSelect(lang.id); onClose() }}
              activeOpacity={0.75}
            >
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.langName, active && styles.langNameActive]}>{lang.label}</Text>
                <Text style={styles.langSub}>{lang.sub}</Text>
              </View>
              {active && <Ionicons name="checkmark-circle" size={20} color={COLORS.chocolate} />}
            </TouchableOpacity>
          )
        })}
      </Animated.View>
    </Modal>
  )
}

/* ── Main Screen ── */
export default function SettingsScreen() {
  const router    = useRouter()
  const insets    = useSafeAreaInsets()
  const { settings, t, update, reset } = useSettings()
  const [showLang, setShowLang] = useState(false)

  const langLabel = LANGUAGES.find(l => l.id === settings.language)?.label ?? 'Русский'

  const confirmLogout = () => {
    Alert.alert(t.logoutTitle, t.logoutMsg, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.logoutConfirm, style: 'destructive',
        onPress: () => {
          reset()
          router.back()
        },
      },
    ])
  }

  const confirmReset = () => {
    Alert.alert(t.resetTitle, t.resetMsg, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.resetConfirm, style: 'destructive',
        onPress: reset,
      },
    ])
  }

  return (
    <View style={styles.root}>
      {/* Handle */}
      <View style={styles.handle} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
          <Ionicons name="close" size={19} color={COLORS.chocolate} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.settings}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── УВЕДОМЛЕНИЯ ── */}
        <Section title={t.notifications}>
          <ToggleRow
            iconName="notifications"
            iconBg="#fef3c7"
            iconColor="#d97706"
            label={t.push}
            desc={t.pushDesc}
            value={settings.pushNotifications}
            onToggle={() => update('pushNotifications', !settings.pushNotifications)}
          />
          <ToggleRow
            iconName="mail"
            iconBg="#fce7f3"
            iconColor={COLORS.pink}
            label={t.email}
            desc={t.emailDesc}
            value={settings.emailNotifications}
            onToggle={() => update('emailNotifications', !settings.emailNotifications)}
          />
          <ToggleRow
            iconName="pricetag"
            iconBg="#fdf5ee"
            iconColor={COLORS.gold}
            label={t.promos}
            desc={t.promosDesc}
            value={settings.promotions}
            onToggle={() => update('promotions', !settings.promotions)}
          />
          <ToggleRow
            iconName="pulse"
            iconBg={COLORS.greenBg}
            iconColor={COLORS.greenText}
            label={t.feedActivity}
            desc={t.feedActivityDesc}
            value={settings.feedActivity}
            onToggle={() => update('feedActivity', !settings.feedActivity)}
          />
        </Section>

        {/* ── ПРИВАТНОСТЬ ── */}
        <Section title={t.privacy}>
          <ToggleRow
            iconName="lock-closed"
            iconBg="#f0f4ff"
            iconColor="#4f6ef7"
            label={t.privateProfile}
            desc={t.privateProfileDesc}
            value={settings.privateProfile}
            onToggle={() => update('privateProfile', !settings.privateProfile)}
          />
          <ToggleRow
            iconName="eye"
            iconBg="#fdf8f3"
            iconColor={COLORS.muted}
            label={t.showPrices}
            desc={t.showPricesDesc}
            value={settings.showPrices}
            onToggle={() => update('showPrices', !settings.showPrices)}
          />
          <ActionRow
            iconName="document-text"
            iconBg="#f3f4f6"
            iconColor="#6b7280"
            label={t.privacyPolicy}
            onPress={() => Alert.alert(t.privacyPolicy, 'Политика конфиденциальности будет доступна в ближайшее время.', [{ text: 'OK' }])}
          />
        </Section>

        {/* ── ПРИЛОЖЕНИЕ ── */}
        <Section title={t.app}>
          <ActionRow
            iconName="language"
            iconBg="#fce7f3"
            iconColor={COLORS.pink}
            label={t.language}
            value={langLabel}
            onPress={() => setShowLang(true)}
          />
          <View style={styles.row}>
            <View style={[styles.iconBadge, { backgroundColor: '#fdf8f3' }]}>
              <Text style={{ fontSize: 16 }}>🍰</Text>
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>{t.about}</Text>
              <Text style={styles.rowDesc}>{t.aboutDesc}</Text>
            </View>
            <Text style={styles.versionBadge}>v1.0.0</Text>
          </View>
        </Section>

        {/* ── ВЫХОД И СБРОС ── */}
        <View style={styles.bottomBtns}>
          <TouchableOpacity style={styles.btnLogout} onPress={confirmLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={18} color="#dc2626" />
            <Text style={styles.btnLogoutText}>{t.logout}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnReset} onPress={confirmReset} activeOpacity={0.8}>
            <Ionicons name="refresh-outline" size={16} color={COLORS.muted} />
            <Text style={styles.btnResetText}>{t.resetSettings}</Text>
          </TouchableOpacity>
        </View>

        {/* ── FOOTER ── */}
        <View style={styles.footer}>
          <Text style={styles.footerVersion}>{t.version}</Text>
          <Text style={styles.footerMade}>{t.madeIn}</Text>
        </View>

      </ScrollView>

      {/* ── LANGUAGE PICKER ── */}
      <LangPicker
        visible={showLang}
        current={settings.language}
        title={t.selectLanguage}
        onSelect={(id) => update('language', id)}
        onClose={() => setShowLang(false)}
      />
    </View>
  )
}

/* ── Styles ── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  handle: {
    width: 36, height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.borderSolid,
    alignSelf: 'center',
    marginTop: 12, marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: '#fff',
  },
  backBtn: {
    width: 36, height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cream,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  headerTitle: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.chocolate,
  },

  /* Scroll */
  scroll: { flex: 1 },
  content: { paddingTop: 8 },

  /* Section */
  section: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    marginLeft: 4,
    marginBottom: 2,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },

  /* Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 13,
    paddingHorizontal: SPACING.md,
    minHeight: 62,
  },
  iconBadge: {
    width: 36, height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  rowText: { flex: 1, gap: 2 },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.chocolate,
    lineHeight: 18,
  },
  rowDesc: {
    fontSize: 11.5,
    color: COLORS.muted,
    lineHeight: 15,
  },
  rowValue: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: '400',
    marginRight: 2,
  },
  dangerText: { color: '#dc2626' },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.md + 36 + 13,
  },

  /* Toggle */
  toggle: {
    width: 48, height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.borderSolid,
    justifyContent: 'center',
    flexShrink: 0,
  },
  toggleOn: { backgroundColor: COLORS.chocolate },
  toggleThumb: {
    width: 22, height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    ...SHADOWS.sm,
  },

  /* Version badge */
  versionBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.muted,
    backgroundColor: COLORS.cream,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },

  /* Bottom buttons */
  bottomBtns: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.xl,
    gap: 10,
  },
  btnLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#fecaca',
  },
  btnLogoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
  btnReset: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 13,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnResetText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.muted,
  },

  /* Footer */
  footer: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    gap: 4,
  },
  footerVersion: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.muted,
  },
  footerMade: {
    fontSize: 11,
    color: COLORS.mutedLight,
  },

  /* Language picker */
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(44,24,16,0.4)',
  },
  langSheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingBottom: 40,
    ...SHADOWS.lg,
  },
  langHandle: {
    width: 36, height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.borderSolid,
    alignSelf: 'center',
    marginTop: 12, marginBottom: 16,
  },
  langTitle: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.chocolate,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: SPACING.md,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: 4,
  },
  langRowActive: {
    backgroundColor: '#fdf5ee',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  langFlag: { fontSize: 28 },
  langName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.chocolate,
    lineHeight: 20,
  },
  langNameActive: { color: COLORS.chocolate },
  langSub: {
    fontSize: 12,
    color: COLORS.muted,
  },
})
