import React from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Image, Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { CATEGORIES } from '@/constants/mockData'

const CARD_W = 148
const CARD_H = 190

export default function CategoriesGrid() {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Ассортимент</Text>
        <Text style={styles.title}>Категории</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.card}
            activeOpacity={0.88}
          >
            <Image source={{ uri: cat.image }} style={styles.img} />
            <LinearGradient
              colors={['transparent', 'rgba(44,24,16,0.78)']}
              style={styles.overlay}
            />
            {/* Count badge */}
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{cat.count}</Text>
            </View>
            <View style={styles.labelWrap}>
              <Text style={styles.label}>{cat.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    gap: 6,
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
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: 12,
    paddingRight: SPACING.md + 8,
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.md,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  countBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  labelWrap: {
    position: 'absolute',
    bottom: 16,
    left: 14,
    right: 14,
  },
  label: {
    fontFamily: FONTS.serif,
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.2,
  },
})
