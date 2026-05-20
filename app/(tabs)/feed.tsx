import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { FEED_POSTS, FeedPost } from '@/constants/mockData'
import SocialCard   from '@/components/feed/SocialCard'
import SkeletonCard from '@/components/feed/SkeletonCard'
import LiveToast    from '@/components/feed/LiveToast'
import FilterSheet  from '@/components/feed/FilterSheet'

const { width: SCREEN_W } = Dimensions.get('window')
const COL_GAP = 10
const SIDE_PAD = SPACING.md

const FILTERS = [
  'Все', 'Свадьба', 'День рождения', 'Корпоратив',
  'Просто так', 'Бенто', 'Минимализм', 'Ягодный', 'Детский', 'Шоколадный',
]

function filterPosts(posts: FeedPost[], f: string): FeedPost[] {
  if (f === 'Все') return posts
  const map: Record<string, (p: FeedPost) => boolean> = {
    'Свадьба':       p => p.occasion.includes('Свадьба') || p.tags.some(t => t.includes('свадеб')),
    'День рождения': p => p.occasion.includes('День рождения') || p.occasionIcon === '🎂',
    'Корпоратив':    p => p.occasion.includes('Корпоратив'),
    'Просто так':    p => p.occasion.includes('Просто так') || p.occasion.includes('Годовщина'),
    'Бенто':         p => p.tags.some(t => t.includes('бенто')),
    'Минимализм':    p => p.tags.some(t => t.includes('минимализм')),
    'Ягодный':       p => p.tags.some(t => t.includes('ягод') || t.includes('клубник') || t.includes('черник')),
    'Детский':       p => p.tags.some(t => t.includes('детск') || t.includes('радуга')),
    'Шоколадный':    p => p.tags.some(t => t.includes('шоколад') || t.includes('трюфель')),
  }
  return map[f] ? posts.filter(map[f]) : posts
}

function computeColumns(posts: FeedPost[], colW: number): [FeedPost[], FeedPost[]] {
  const left: FeedPost[] = []
  const right: FeedPost[] = []
  let lH = 0, rH = 0
  const BODY_H = 148

  posts.forEach(p => {
    const h = (p.height ?? 260) + BODY_H
    if (lH <= rH) { left.push(p);  lH += h + 12 }
    else           { right.push(p); rH += h + 12 }
  })
  return [left, right]
}

export default function FeedScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const scrollY = useRef(new Animated.Value(0)).current

  const [activeFilter, setActiveFilter] = useState('Все')
  const [loading, setLoading]           = useState(true)
  const [showFilter, setShowFilter]     = useState(false)

  const COL_W = (SCREEN_W - SIDE_PAD * 2 - COL_GAP) / 2

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => filterPosts(FEED_POSTS, activeFilter), [activeFilter])
  const [leftPosts, rightPosts] = useMemo(() => computeColumns(filtered, COL_W), [filtered])

  /* ── Header animations ── */
  const HEADER_FULL = insets.top + 76
  const HEADER_MINI = insets.top + 48

  const headerH = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [HEADER_FULL, HEADER_MINI],
    extrapolate: 'clamp',
  })
  const eyebrowOp = scrollY.interpolate({
    inputRange: [0, 35],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })
  const titleSize = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [26, 18],
    extrapolate: 'clamp',
  })
  const borderOp = scrollY.interpolate({
    inputRange: [40, 70],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })

  return (
    <View style={styles.root}>

      {/* ── STICKY HEADER ── */}
      <Animated.View style={[styles.header, { height: headerH }]}>
        {/* glass layer */}
        <View style={[styles.headerGlass, { paddingTop: insets.top }]}>
          <View style={styles.headerInner}>
            <View style={{ flex: 1 }}>
              <Animated.Text style={[styles.eyebrow, { opacity: eyebrowOp }]}>
                ЛЕНТА ДЕСЕРТОВ
              </Animated.Text>
              <Animated.Text style={[styles.headerTitle, { fontSize: titleSize }]}>
                Вдохновение
              </Animated.Text>
            </View>
            <View style={styles.headerBtns}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => router.push('/search')}
              >
                <Ionicons name="search-outline" size={19} color={COLORS.chocolate} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconBtn, showFilter && styles.iconBtnActive]}
                onPress={() => setShowFilter(true)}
              >
                <Ionicons
                  name="options-outline"
                  size={19}
                  color={showFilter ? '#fff' : COLORS.chocolate}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* bottom border (appears on scroll) */}
        <Animated.View style={[styles.headerBorder, { opacity: borderOp }]} />
      </Animated.View>

      {/* ── FILTER CHIPS (sticky below header) ── */}
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map(f => {
            const active = f === activeFilter
            return (
              <TouchableOpacity
                key={f}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.75}
              >
                <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>{f}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* ── MAIN SCROLL ── */}
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {loading ? (
          /* Skeleton loading */
          <View style={styles.grid}>
            <View style={styles.col}>
              <SkeletonCard width={COL_W} imgHeight={280} />
              <SkeletonCard width={COL_W} imgHeight={230} />
              <SkeletonCard width={COL_W} imgHeight={260} />
            </View>
            <View style={[styles.col, { marginTop: 24 }]}>
              <SkeletonCard width={COL_W} imgHeight={240} />
              <SkeletonCard width={COL_W} imgHeight={270} />
              <SkeletonCard width={COL_W} imgHeight={250} />
            </View>
          </View>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <EmptyState onReset={() => setActiveFilter('Все')} />
        ) : (
          /* Masonry grid */
          <View style={styles.grid}>
            <View style={styles.col}>
              {leftPosts.map(p => <SocialCard key={p.id} post={p} width={COL_W} />)}
            </View>
            <View style={[styles.col, { marginTop: 24 }]}>
              {rightPosts.map(p => <SocialCard key={p.id} post={p} width={COL_W} />)}
            </View>
          </View>
        )}

        {!loading && filtered.length > 0 && (
          <View style={styles.footer}>
            <Text style={styles.footerLine}>✦</Text>
            <Text style={styles.footerText}>Вы посмотрели все {filtered.length} работ</Text>
            <Text style={styles.footerLine}>✦</Text>
          </View>
        )}
      </Animated.ScrollView>

      {/* ── LIVE TOAST ── */}
      <LiveToast />

      {/* ── FILTER SHEET ── */}
      <FilterSheet
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
    </View>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>🍰</Text>
      <Text style={styles.emptyTitle}>Пока ничего нет</Text>
      <Text style={styles.emptyText}>
        По этому фильтру работ не найдено.{'\n'}Попробуй другой или сбрось фильтры.
      </Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={onReset} activeOpacity={0.85}>
        <Text style={styles.emptyBtnTxt}>Показать все</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  /* Header */
  header: {
    backgroundColor: COLORS.cream,
    zIndex: 100,
  },
  headerGlass: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingBottom: 10,
    gap: 8,
  },
  eyebrow: {
    fontSize: 9.5,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  headerTitle: {
    fontFamily: FONTS.serif,
    fontWeight: '700',
    color: COLORS.chocolate,
    lineHeight: 30,
  },
  headerBtns: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 2,
  },
  iconBtn: {
    width: 38, height: 38,
    borderRadius: RADIUS.sm,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.sm,
  },
  iconBtnActive: {
    backgroundColor: COLORS.chocolate,
    borderColor: COLORS.chocolate,
  },
  headerBorder: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  /* Filter row */
  filterRow: {
    backgroundColor: COLORS.cream,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: COLORS.chocolate,
    borderColor: COLORS.chocolate,
  },
  chipTxt: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.muted,
  },
  chipTxtActive: {
    color: '#fff',
    fontWeight: '700',
  },

  /* Scroll */
  scroll: { flex: 1 },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 120,
  },
  grid: {
    flexDirection: 'row',
    gap: COL_GAP,
  },
  col: {
    flex: 1,
  },

  /* Footer */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    paddingBottom: 16,
  },
  footerLine: {
    fontSize: 12,
    color: COLORS.gold,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '500',
  },

  /* Empty */
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: SPACING.xl,
  },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.chocolate,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: COLORS.chocolate,
    borderRadius: RADIUS.full,
    paddingHorizontal: 28,
    paddingVertical: 13,
  },
  emptyBtnTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
})
