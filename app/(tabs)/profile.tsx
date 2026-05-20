import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'

const { width: W } = Dimensions.get('window')

const STATS = [
  { label: 'Заказов',    value: '24'  },
  { label: 'Сохранено',  value: '138' },
  { label: 'Повторений', value: '6'   },
]


interface MenuItem {
  icon: string
  label: string
  badge: string | null
  onPress?: () => void
}

function MenuRow({ item, last }: { item: MenuItem; last?: boolean }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[styles.menuRow, !last && styles.menuRowBorder]}
      onPress={item.onPress}
    >
      <View style={styles.menuIconWrap}>
        <Ionicons name={item.icon as any} size={19} color={COLORS.chocolate} />
      </View>
      <Text style={styles.menuLabel}>{item.label}</Text>
      <View style={styles.menuRight}>
        {item.badge && (
          <View style={styles.menuBadge}>
            <Text style={styles.menuBadgeText}>{item.badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={16} color={COLORS.border} />
      </View>
    </TouchableOpacity>
  )
}

export default function ProfileScreen() {
  const router = useRouter()
  const [isChef, setIsChef] = useState(false)

  const MENU_SECTIONS_WITH_ACTIONS = [
    {
      title: 'Аккаунт',
      items: [
        { icon: 'person-outline',        label: 'Личные данные',     badge: null, onPress: () => Alert.alert('Личные данные', 'Алима Сейткали\nalima_sweets@mail.ru\n+7 701 234 56 78') },
        { icon: 'location-outline',      label: 'Адреса доставки',   badge: null, onPress: () => Alert.alert('Адреса', 'ул. Абая 15, кв. 3\nАктобе, 030000') },
        { icon: 'card-outline',          label: 'Способы оплаты',    badge: null, onPress: () => Alert.alert('Оплата', 'Kaspi Gold **** 4521') },
        { icon: 'notifications-outline', label: 'Уведомления',       badge: '3',  onPress: () => router.push('/notifications') },
      ],
    },
    {
      title: 'Активность',
      items: [
        { icon: 'heart-outline',   label: 'Избранное',             badge: '12', onPress: () => router.push('/wishlist') },
        { icon: 'repeat-outline',  label: 'Мои повторения',        badge: null, onPress: () => Alert.alert('Повторения', 'Вы повторили 6 дизайнов') },
        { icon: 'star-outline',    label: 'Мои отзывы',            badge: null, onPress: () => Alert.alert('Отзывы', 'Вы оставили 4 отзыва') },
        { icon: 'gift-outline',    label: 'Реферальная программа', badge: null, onPress: () => Alert.alert('Реферальная программа', 'Ваш код: ALIMA2024\nПригласите друга и получите 500 ₸') },
      ],
    },
    {
      title: 'Поддержка',
      items: [
        { icon: 'chatbubble-ellipses-outline', label: 'Чат с поддержкой', badge: null, onPress: () => Alert.alert('Поддержка', 'Среднее время ответа: 15 минут') },
        { icon: 'help-circle-outline',         label: 'FAQ',              badge: null, onPress: () => Alert.alert('FAQ', 'Открываем базу знаний...') },
        { icon: 'document-text-outline',       label: 'Условия и политика', badge: null, onPress: () => Alert.alert('Документы', 'Условия использования и политика конфиденциальности') },
      ],
    },
  ]

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header gradient */}
      <LinearGradient
        colors={[COLORS.chocolate, '#5c3518']}
        style={styles.headerGrad}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Settings button */}
        <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <LinearGradient
            colors={[COLORS.pink, COLORS.gold]}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>А</Text>
          </LinearGradient>
          <View style={styles.avatarOnline} />
        </View>

        <Text style={styles.userName}>Алима Сейткали</Text>
        <Text style={styles.userHandle}>@alima_sweets · Актобе</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
              {i < STATS.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>
      </LinearGradient>

      {/* Chef toggle card */}
      <View style={[styles.chefCard, SHADOWS.sm]}>
        <View style={styles.chefCardLeft}>
          <Text style={styles.chefCardTitle}>
            {isChef ? '👨‍🍳 Режим кондитера' : '🍰 Режим покупателя'}
          </Text>
          <Text style={styles.chefCardSub}>
            {isChef
              ? 'Вы принимаете заказы и публикуете работы'
              : 'Переключитесь, чтобы продавать десерты'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsChef(v => !v)}
          style={[styles.toggle, isChef && styles.toggleActive]}
          activeOpacity={0.8}
        >
          <View style={[styles.toggleThumb, isChef && styles.toggleThumbActive]} />
        </TouchableOpacity>
      </View>

      {/* Chef panel (visible when chef mode on) */}
      {isChef && (
        <LinearGradient
          colors={['#1c0a02', COLORS.chocolate]}
          style={[styles.chefPanel, SHADOWS.md]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.chefPanelTitle}>Панель кондитера</Text>
          <View style={styles.chefPanelStats}>
            {[
              { label: 'Выручка', value: '84 200 ₸' },
              { label: 'Заказов', value: '17'        },
              { label: 'Рейтинг', value: '4.9 ★'    },
            ].map(s => (
              <View key={s.label} style={styles.chefStat}>
                <Text style={styles.chefStatValue}>{s.value}</Text>
                <Text style={styles.chefStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.chefPanelBtns}>
            <TouchableOpacity style={styles.chefPanelBtn}>
              <Ionicons name="add-circle-outline" size={16} color={COLORS.gold} />
              <Text style={styles.chefPanelBtnText}>Добавить работу</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chefPanelBtn}>
              <Ionicons name="bar-chart-outline" size={16} color={COLORS.gold} />
              <Text style={styles.chefPanelBtnText}>Статистика</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      )}

      {/* Menu sections */}
      {MENU_SECTIONS_WITH_ACTIONS.map(section => (
        <View key={section.title} style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{section.title}</Text>
          <View style={[styles.menuCard, SHADOWS.sm]}>
            {section.items.map((item, i) => (
              <MenuRow
                key={item.label}
                item={item}
                last={i === section.items.length - 1}
              />
            ))}
          </View>
        </View>
      ))}

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutBtn}
        activeOpacity={0.8}
        onPress={() => Alert.alert('Выйти?', 'Вы уверены, что хотите выйти из аккаунта?', [
          { text: 'Отмена', style: 'cancel' },
          { text: 'Выйти', style: 'destructive', onPress: () => {} },
        ])}
      >
        <Ionicons name="log-out-outline" size={18} color="#dc2626" />
        <Text style={styles.logoutText}>Выйти из аккаунта</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Aktobe Sweets v1.0.0</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  content: { paddingBottom: 120 },

  headerGrad: {
    paddingTop: 60,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    gap: 6,
  },
  settingsBtn: {
    position: 'absolute', top: 60, right: SPACING.md,
    width: 38, height: 38,
    borderRadius: RADIUS.sm, backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarWrap: { position: 'relative', marginBottom: 4 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontFamily: FONTS.serif, fontSize: 32, fontWeight: '700', color: '#fff',
  },
  avatarOnline: {
    position: 'absolute', bottom: 2, right: 2,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#4ade80',
    borderWidth: 2, borderColor: COLORS.chocolate,
  },
  userName: {
    fontFamily: FONTS.serif, fontSize: 22, fontWeight: '700', color: '#fff',
  },
  userHandle: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },

  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS.lg, paddingVertical: 14,
    paddingHorizontal: 24, gap: 0,
    alignSelf: 'stretch',
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 20, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: '500' },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' },

  chefCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md,
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
  },
  chefCardLeft: { flex: 1, gap: 2 },
  chefCardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.chocolate },
  chefCardSub: { fontSize: 12, color: COLORS.muted },
  toggle: {
    width: 48, height: 28, borderRadius: 14,
    backgroundColor: COLORS.border, padding: 3,
    justifyContent: 'center',
  },
  toggleActive: { backgroundColor: COLORS.chocolate },
  toggleThumb: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff',
  },
  toggleThumbActive: { transform: [{ translateX: 20 }] },

  chefPanel: {
    borderRadius: RADIUS.lg, marginHorizontal: SPACING.md, marginTop: 12,
    padding: SPACING.md, gap: 14,
  },
  chefPanelTitle: {
    fontFamily: FONTS.serif, fontSize: 18, fontWeight: '700', color: '#fff',
  },
  chefPanelStats: { flexDirection: 'row', gap: 0 },
  chefStat: { flex: 1, alignItems: 'center', gap: 2 },
  chefStatValue: { fontSize: 16, fontWeight: '700', color: COLORS.gold },
  chefStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  chefPanelBtns: { flexDirection: 'row', gap: 10 },
  chefPanelBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: RADIUS.md,
    paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  chefPanelBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.gold },

  menuSection: { paddingHorizontal: SPACING.md, marginTop: SPACING.lg, gap: 8 },
  menuSectionTitle: {
    fontSize: 11, fontWeight: '700', color: COLORS.muted,
    textTransform: 'uppercase', letterSpacing: 1.5,
  },
  menuCard: {
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, paddingHorizontal: SPACING.md,
  },
  menuRowBorder: {
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  menuIconWrap: {
    width: 34, height: 34, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.chocolate },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuBadge: {
    minWidth: 20, height: 20, borderRadius: 10,
    backgroundColor: COLORS.pink, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 6,
  },
  menuBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: SPACING.md, marginTop: SPACING.lg,
    paddingVertical: 14, borderRadius: RADIUS.full,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#fecaca',
  },
  logoutText: { fontSize: 14, fontWeight: '600', color: '#dc2626' },

  version: {
    textAlign: 'center', fontSize: 11, color: COLORS.muted,
    marginTop: SPACING.md, paddingBottom: SPACING.sm,
  },
})
