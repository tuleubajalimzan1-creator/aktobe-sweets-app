import React, { useRef, useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Animated,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { TRENDS } from '@/constants/mockData'

export default function TrendsSection() {
  const [active, setActive] = useState('1')

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.firePill}>
            <Text style={styles.fireEmoji}>🔥</Text>
            <Text style={styles.fireText}>Тренды</Text>
          </View>
          <Text style={styles.title}>Что в моде</Text>
        </View>
        <Text style={styles.sub}>В Актобе сейчас</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TRENDS.map((trend) => {
          const isActive = active === trend.id
          return (
            <TouchableOpacity
              key={trend.id}
              onPress={() => setActive(trend.id)}
              activeOpacity={0.8}
            >
              {isActive ? (
                <LinearGradient
                  colors={['#e8698a', '#c94a6a']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.chip, styles.chipActive]}
                >
                  <Text style={styles.chipEmoji}>{trend.emoji}</Text>
                  <Text style={[styles.chipLabel, styles.chipLabelActive]}>{trend.label}</Text>
                  {trend.hot && <View style={styles.hotDot} />}
                </LinearGradient>
              ) : (
                <View style={[styles.chip, styles.chipInactive]}>
                  <Text style={styles.chipEmoji}>{trend.emoji}</Text>
                  <Text style={styles.chipLabel}>{trend.label}</Text>
                  {trend.hot && (
                    <View style={[styles.hotDot, { backgroundColor: COLORS.pink }]} />
                  )}
                </View>
              )}
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* Trending stats strip */}
      <View style={styles.statsStrip}>
        {[
          { label: 'Публикаций', value: '2.4k', icon: '📸' },
          { label: 'Повторений', value: '847',  icon: '🔄' },
          { label: 'Заказов',    value: '312',  icon: '🎂' },
        ].map(s => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
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
  headerLeft: {
    gap: 8,
  },
  firePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ffedd5',
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  fireEmoji: { fontSize: 13 },
  fireText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#c2410c',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.chocolate,
  },
  sub: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '400',
    marginBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: 8,
    paddingRight: SPACING.md + 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
  },
  chipActive: {
    ...SHADOWS.pink,
    shadowOpacity: 0.25,
  },
  chipInactive: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipEmoji: {
    fontSize: 15,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.muted,
  },
  chipLabelActive: {
    color: '#fff',
    fontWeight: '700',
  },
  hotDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  chipCount: {
    fontSize: 10.5,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
  },
  statsStrip: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    gap: 3,
  },
  statIcon: { fontSize: 18 },
  statValue: {
    fontFamily: FONTS.serif,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.chocolate,
  },
  statLabel: {
    fontSize: 9.5,
    color: COLORS.muted,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
})
