import React, { useState } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'

const { width: W } = Dimensions.get('window')

type OrderStatus = 'preparing' | 'ready' | 'delivered' | 'cancelled'

interface Order {
  id: string
  title: string
  subtitle: string
  status: OrderStatus
  date: string
  total: number
  items: number
  emoji: string
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    title: 'Медовый торт',
    subtitle: 'Карамельный крем · Цветы · 2 кг',
    status: 'preparing',
    date: '18 мая, 14:30',
    total: 7800,
    items: 3,
    emoji: '🍯',
  },
  {
    id: 'o2',
    title: 'Шоколадный торт',
    subtitle: 'Ягодный крем · Ягоды · 1 кг',
    status: 'ready',
    date: '17 мая, 18:00',
    total: 5200,
    items: 2,
    emoji: '🍫',
  },
  {
    id: 'o3',
    title: 'Свадебный торт',
    subtitle: 'Слоёный · Сливочный · 3 кг',
    status: 'delivered',
    date: '10 мая, 12:00',
    total: 12400,
    items: 5,
    emoji: '💍',
  },
  {
    id: 'o4',
    title: 'Чизкейк NY',
    subtitle: 'Ягодный соус · Без декора',
    status: 'delivered',
    date: '2 мая, 16:00',
    total: 3900,
    items: 1,
    emoji: '🧀',
  },
  {
    id: 'o5',
    title: 'Кастомный торт',
    subtitle: 'Бисквит · Карамельный · Сердце',
    status: 'cancelled',
    date: '28 апр, 10:00',
    total: 6100,
    items: 4,
    emoji: '❤️',
  },
]

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: string }> = {
  preparing: { label: 'Готовится',   color: '#d97706', bg: '#fef3c7', icon: 'flame-outline'    },
  ready:     { label: 'Готов!',      color: '#059669', bg: '#d1fae5', icon: 'checkmark-circle-outline' },
  delivered: { label: 'Доставлен',   color: COLORS.muted, bg: '#f1f5f9', icon: 'bag-check-outline' },
  cancelled: { label: 'Отменён',     color: '#dc2626', bg: '#fee2e2', icon: 'close-circle-outline' },
}

const FILTERS: { key: string; label: string }[] = [
  { key: 'all',       label: 'Все'       },
  { key: 'active',    label: 'Активные'  },
  { key: 'delivered', label: 'Доставлены'},
  { key: 'cancelled', label: 'Отменены'  },
]

function OrderCard({ order }: { order: Order }) {
  const cfg = STATUS_CONFIG[order.status]

  return (
    <TouchableOpacity activeOpacity={0.88} style={[styles.card, SHADOWS.sm]}>
      {/* Emoji badge */}
      <View style={styles.cardEmoji}>
        <Text style={{ fontSize: 28 }}>{order.emoji}</Text>
      </View>

      <View style={styles.cardBody}>
        {/* Top row */}
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle} numberOfLines={1}>{order.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <Ionicons name={cfg.icon as any} size={11} color={cfg.color} />
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        <Text style={styles.cardSub} numberOfLines={1}>{order.subtitle}</Text>

        {/* Bottom row */}
        <View style={styles.cardBottom}>
          <View style={styles.cardMeta}>
            <Ionicons name="calendar-outline" size={12} color={COLORS.muted} />
            <Text style={styles.cardMetaText}>{order.date}</Text>
          </View>
          <View style={styles.cardMeta}>
            <Ionicons name="layers-outline" size={12} color={COLORS.muted} />
            <Text style={styles.cardMetaText}>{order.items} позиции</Text>
          </View>
          <Text style={styles.cardPrice}>{order.total.toLocaleString()} ₸</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🛍️</Text>
      <Text style={styles.emptyTitle}>Заказов пока нет</Text>
      <Text style={styles.emptyText}>Сделайте первый заказ и он появится здесь</Text>
      <TouchableOpacity style={styles.emptyBtn}>
        <Text style={styles.emptyBtnText}>Перейти в каталог</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function OrdersScreen() {
  const [filter, setFilter] = useState('all')

  const filtered = MOCK_ORDERS.filter(o => {
    if (filter === 'all') return true
    if (filter === 'active') return o.status === 'preparing' || o.status === 'ready'
    return o.status === filter
  })

  const activeCount = MOCK_ORDERS.filter(o => o.status === 'preparing' || o.status === 'ready').length

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[COLORS.cream, '#fae8f0']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}>История</Text>
            <Text style={styles.title}>Мои заказы</Text>
          </View>
          {activeCount > 0 && (
            <View style={styles.activeBadge}>
              <View style={styles.activeOrb} />
              <Text style={styles.activeText}>{activeCount} активных</Text>
            </View>
          )}
        </View>

        {/* Filter row */}
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.key}
          contentContainerStyle={styles.filtersRow}
          renderItem={({ item }) => {
            const active = filter === item.key
            return (
              <TouchableOpacity
                onPress={() => setFilter(item.key)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )
          }}
        />
      </LinearGradient>

      {/* Active order banner */}
      {filter === 'all' && activeCount > 0 && (
        <LinearGradient
          colors={[COLORS.chocolate, '#5c3518']}
          style={styles.activeBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="flame" size={20} color={COLORS.gold} />
          <View style={styles.activeBannerBody}>
            <Text style={styles.activeBannerTitle}>Ваш заказ готовится</Text>
            <Text style={styles.activeBannerSub}>Медовый торт · готов через ~40 мин</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
        </LinearGradient>
      )}

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={o => o.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, filtered.length === 0 && { flex: 1 }]}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => <OrderCard order={item} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },

  header: {
    paddingTop: 60,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  headerTop: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 10, fontWeight: '700', color: COLORS.gold,
    letterSpacing: 2.5, textTransform: 'uppercase',
  },
  title: {
    fontFamily: FONTS.serif, fontSize: 28, fontWeight: '700', color: COLORS.chocolate,
  },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#d1fae5', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: RADIUS.full, marginTop: 8,
  },
  activeOrb: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#059669',
  },
  activeText: { fontSize: 12, fontWeight: '700', color: '#059669' },

  filtersRow: { gap: 8, paddingBottom: 4 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: RADIUS.full, backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.chocolate, borderColor: COLORS.chocolate },
  filterText: { fontSize: 13, fontWeight: '500', color: COLORS.muted },
  filterTextActive: { color: COLORS.cream, fontWeight: '700' },

  activeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    padding: SPACING.md, borderRadius: RADIUS.lg,
  },
  activeBannerBody: { flex: 1 },
  activeBannerTitle: { fontSize: 14, fontWeight: '700', color: '#fff' },
  activeBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  list: { padding: SPACING.md, gap: 12, paddingBottom: 100 },

  card: {
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    flexDirection: 'row', gap: 14, padding: SPACING.md,
  },
  cardEmoji: {
    width: 56, height: 56, borderRadius: RADIUS.md,
    backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center',
  },
  cardBody: { flex: 1, gap: 4 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: {
    flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.chocolate,
  },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardSub: { fontSize: 12, color: COLORS.muted },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { fontSize: 11, color: COLORS.muted },
  cardPrice: {
    marginLeft: 'auto', fontSize: 14, fontWeight: '700', color: COLORS.chocolate,
  },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingBottom: 80 },
  emptyIcon: { fontSize: 56 },
  emptyTitle: {
    fontFamily: FONTS.serif, fontSize: 22, fontWeight: '700', color: COLORS.chocolate,
  },
  emptyText: { fontSize: 14, color: COLORS.muted, textAlign: 'center', paddingHorizontal: 32 },
  emptyBtn: {
    marginTop: 8, paddingVertical: 14, paddingHorizontal: 32,
    borderRadius: RADIUS.full, backgroundColor: COLORS.chocolate,
  },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.cream },
})
