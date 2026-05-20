import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'

function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[styles.toggle, value && styles.toggleActive]}
      activeOpacity={0.8}
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
    </TouchableOpacity>
  )
}

function RowToggle({ icon, label, value, onToggle }: {
  icon: string; label: string; value: boolean; onToggle: () => void
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIconWrap}>
        <Ionicons name={icon as any} size={18} color={COLORS.chocolate} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Toggle value={value} onToggle={onToggle} />
    </View>
  )
}

function RowAction({ icon, label, value, onPress, danger }: {
  icon: string; label: string; value?: string; onPress: () => void; danger?: boolean
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.rowIconWrap, danger && styles.rowIconDanger]}>
        <Ionicons name={icon as any} size={18} color={danger ? '#dc2626' : COLORS.chocolate} />
      </View>
      <Text style={[styles.rowLabel, danger && { color: '#dc2626' }]}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      <Ionicons name="chevron-forward" size={16} color={COLORS.border} />
    </TouchableOpacity>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={[styles.sectionCard, SHADOWS.sm]}>
        {children}
      </View>
    </View>
  )
}

export default function SettingsScreen() {
  const router = useRouter()
  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(false)
  const [promoEnabled, setPromoEnabled] = useState(true)
  const [activityEnabled, setActivityEnabled] = useState(true)
  const [privateProfile, setPrivateProfile] = useState(false)
  const [showPrice, setShowPrice] = useState(true)

  const confirm = (msg: string) => Alert.alert('Готово', msg)

  return (
    <View style={styles.root}>
      {/* Handle */}
      <View style={styles.handle} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color={COLORS.chocolate} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Настройки</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Уведомления */}
        <Section title="Уведомления">
          <RowToggle icon="notifications-outline" label="Push-уведомления" value={pushEnabled} onToggle={() => setPushEnabled(v => !v)} />
          <View style={styles.divider} />
          <RowToggle icon="mail-outline" label="Email-рассылка" value={emailEnabled} onToggle={() => setEmailEnabled(v => !v)} />
          <View style={styles.divider} />
          <RowToggle icon="pricetag-outline" label="Акции и скидки" value={promoEnabled} onToggle={() => setPromoEnabled(v => !v)} />
          <View style={styles.divider} />
          <RowToggle icon="pulse-outline" label="Активность в ленте" value={activityEnabled} onToggle={() => setActivityEnabled(v => !v)} />
        </Section>

        {/* Приватность */}
        <Section title="Приватность">
          <RowToggle icon="lock-closed-outline" label="Закрытый профиль" value={privateProfile} onToggle={() => setPrivateProfile(v => !v)} />
          <View style={styles.divider} />
          <RowToggle icon="eye-outline" label="Показывать цены" value={showPrice} onToggle={() => setShowPrice(v => !v)} />
          <View style={styles.divider} />
          <RowAction icon="document-text-outline" label="Политика конфиденциальности" onPress={() => confirm('Открываем политику...')} />
        </Section>

        {/* Приложение */}
        <Section title="Приложение">
          <RowAction icon="language-outline" label="Язык" value="Русский" onPress={() => Alert.alert('Язык', 'Доступные: Русский, Қазақша, English')} />
          <View style={styles.divider} />
          <RowAction icon="color-palette-outline" label="Тема" value="Светлая" onPress={() => Alert.alert('Тема', 'Сейчас: Светлая (Dark mode скоро)')} />
          <View style={styles.divider} />
          <RowAction icon="information-circle-outline" label="О приложении" value="v1.0.0" onPress={() => Alert.alert('Aktobe Sweets', 'Версия 1.0.0\nСделано с ❤️ в Актобе')} />
          <View style={styles.divider} />
          <RowAction icon="star-outline" label="Оценить приложение" onPress={() => confirm('Спасибо за оценку!')} />
        </Section>

        {/* Аккаунт */}
        <Section title="Аккаунт">
          <RowAction icon="key-outline" label="Сменить пароль" onPress={() => confirm('Письмо отправлено на почту')} />
          <View style={styles.divider} />
          <RowAction icon="trash-outline" label="Удалить аккаунт" onPress={() => Alert.alert('Удалить аккаунт?', 'Это действие нельзя отменить', [
            { text: 'Отмена', style: 'cancel' },
            { text: 'Удалить', style: 'destructive', onPress: () => {} },
          ])} danger />
        </Section>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  handle: {
    width: 36, height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: 12, marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: '#fff',
  },
  closeBtn: {
    width: 32, height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cream,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.chocolate,
  },
  scroll: { flex: 1 },
  content: {
    paddingBottom: 80,
    gap: 0,
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,
  },
  rowIconWrap: {
    width: 34, height: 34,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.cream,
    alignItems: 'center', justifyContent: 'center',
  },
  rowIconDanger: {
    backgroundColor: '#fee2e2',
  },
  rowLabel: {
    flex: 1,
    fontSize: 14, fontWeight: '500', color: COLORS.chocolate,
  },
  rowValue: {
    fontSize: 13, color: COLORS.muted, fontWeight: '400',
    marginRight: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.md + 34 + 14,
  },
  toggle: {
    width: 46, height: 26, borderRadius: 13,
    backgroundColor: COLORS.border, padding: 3,
    justifyContent: 'center',
  },
  toggleActive: { backgroundColor: COLORS.chocolate },
  toggleThumb: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff',
  },
  toggleThumbActive: { transform: [{ translateX: 20 }] },
})
