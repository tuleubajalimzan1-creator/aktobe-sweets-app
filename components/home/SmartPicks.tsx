import React from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { SMART_PICKS } from '@/constants/mockData'

export default function SmartPicks() {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Smart подборки</Text>
        <Text style={styles.title}>Выбери своё</Text>
        <Text style={styles.sub}>Быстрые подборки под ваш запрос</Text>
      </View>

      <View style={styles.grid}>
        {SMART_PICKS.map((pick) => (
          <TouchableOpacity key={pick.id} activeOpacity={0.82}>
            <LinearGradient
              colors={pick.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.chip}
            >
              <Text style={styles.chipEmoji}>{pick.emoji}</Text>
              <Text style={styles.chipLabel}>{pick.label}</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: 5,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.chocolate,
  },
  sub: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: '300',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    ...SHADOWS.sm,
  },
  chipEmoji: {
    fontSize: 17,
  },
  chipLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: COLORS.chocolate,
    letterSpacing: 0.1,
  },
})
