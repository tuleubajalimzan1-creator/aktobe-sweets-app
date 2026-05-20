import React from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import FeedCard from '@/components/common/FeedCard'
import { FEED_POSTS } from '@/constants/mockData'

const { width: W } = Dimensions.get('window')
const CARD_W = W - SPACING.md * 2

export default function SocialFeedPreview() {
  const left  = FEED_POSTS.filter((_, i) => i % 2 === 0)
  const right = FEED_POSTS.filter((_, i) => i % 2 === 1)
  const COL_W = (W - SPACING.md * 2 - 10) / 2

  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Социальная лента</Text>
          <Text style={styles.title}>Вдохновение дня</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={16} color={COLORS.chocolate} />
          <Text style={styles.filterText}>Фильтр</Text>
        </TouchableOpacity>
      </View>

      {/* Masonry-style 2-col grid */}
      <View style={styles.grid}>
        {/* Left column */}
        <View style={[styles.col, { width: COL_W }]}>
          {left.map((post) => (
            <FeedCard key={post.id} post={post} width={COL_W} compact />
          ))}
        </View>
        {/* Right column — offset for masonry feel */}
        <View style={[styles.col, { width: COL_W, marginTop: 28 }]}>
          {right.map((post) => (
            <FeedCard key={post.id} post={post} width={COL_W} compact />
          ))}
        </View>
      </View>

      {/* Open feed button */}
      <TouchableOpacity style={styles.openFeedBtn} activeOpacity={0.85}>
        <Text style={styles.openFeedText}>Открыть всю ленту</Text>
        <Ionicons name="arrow-forward" size={16} color={COLORS.cream} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginTop: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.chocolate,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.cream,
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.chocolate,
  },
  grid: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: 10,
  },
  col: {
    gap: 10,
  },
  openFeedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.chocolate,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    borderRadius: RADIUS.full,
    paddingVertical: 16,
    ...SHADOWS.md,
  },
  openFeedText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.cream,
    letterSpacing: 0.4,
  },
})
