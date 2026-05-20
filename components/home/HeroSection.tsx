import React, { useEffect, useRef } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  Dimensions, Animated,
} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'

const { width: W, height: H } = Dimensions.get('window')

export default function HeroSection() {
  const router = useRouter()
  const floatY1 = useRef(new Animated.Value(0)).current
  const floatY2 = useRef(new Animated.Value(0)).current
  const floatY3 = useRef(new Animated.Value(0)).current
  const fadeIn  = useRef(new Animated.Value(0)).current
  const slideUp = useRef(new Animated.Value(28)).current

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 780, useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, tension: 60, friction: 9, useNativeDriver: true }),
    ]).start()

    // Float animations (staggered loops)
    const loop = (val: Animated.Value, amp: number, dur: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: -amp, duration: dur, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0,    duration: dur, useNativeDriver: true }),
        ])
      ).start()

    loop(floatY1, 10, 2800)
    loop(floatY2, 8,  3400)
    loop(floatY3, 12, 2500)
  }, [])

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#fdf8f3', '#fae8f0', '#fdf8f3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient orb 1 */}
      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />

      {/* Main hero image */}
      <Animated.View style={[styles.heroImgWrap, { opacity: fadeIn }]}>
        <Animated.View style={{ transform: [{ translateY: floatY1 }] }}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=85' }}
            style={styles.heroImg}
          />
          {/* Glass badge: Hit */}
          <View style={[styles.glassBadge, styles.badgeHit]}>
            <View style={styles.liveOrb} />
            <Text style={styles.glassBadgeText}>♥ Хит недели</Text>
          </View>
          {/* Glass badge: Rating */}
          <View style={[styles.glassBadge, styles.badgeRating]}>
            <Text style={styles.glassBadgeText}>⭐ 4.9 рейтинг</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Floating cards */}
      <Animated.View style={[styles.floatCard, styles.floatLeft, { transform: [{ translateY: floatY2 }], opacity: fadeIn }]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=300&q=80' }}
          style={styles.floatImg}
        />
        <View style={styles.floatCardOverlay}>
          <Text style={styles.floatCardLabel}>🔄 Повторяют чаще всего</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.floatCard, styles.floatRight, { transform: [{ translateY: floatY3 }], opacity: fadeIn }]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&q=80' }}
          style={styles.floatImg}
        />
      </Animated.View>

      {/* Text content */}
      <Animated.View
        style={[
          styles.textWrap,
          { opacity: fadeIn, transform: [{ translateY: slideUp }] },
        ]}
      >
        <View style={styles.livePill}>
          <View style={styles.liveOrb} />
          <Text style={styles.livePillText}>Актобе · Доставка 60 мин</Text>
        </View>

        <Text style={styles.headline}>
          Торты,{'\n'}которые хочется{'\n'}
          <Text style={styles.headlineAccent}>показывать</Text>
        </Text>

        <Text style={styles.subline}>
          Смотри ленту десертов, сохраняй идеи и создавай свой шедевр вместе с лучшими кондитерами Актобе
        </Text>

        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.ctaPrimary} activeOpacity={0.85} onPress={() => router.navigate('/(tabs)/feed')}>
            <Text style={styles.ctaPrimaryText}>Смотреть ленту</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondary} activeOpacity={0.85} onPress={() => router.navigate('/(tabs)/build')}>
            <Text style={styles.ctaSecondaryText}>✨ Собрать торт</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

const IMG_H = Math.round(H * 0.38)

const styles = StyleSheet.create({
  container: {
    paddingTop: 130, // header clearance
    paddingBottom: SPACING.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  orb1: {
    position: 'absolute',
    top: -60,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(232,105,138,0.14)',
  },
  orb2: {
    position: 'absolute',
    bottom: 0,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(201,169,110,0.12)',
  },
  orb: {},
  heroImgWrap: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  heroImg: {
    width: W - 48,
    height: IMG_H,
    borderRadius: RADIUS.xl,
    ...SHADOWS.lg,
  },
  glassBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    ...SHADOWS.sm,
  },
  badgeHit: {
    bottom: 16,
    left: 14,
  },
  badgeRating: {
    top: 16,
    right: 14,
  },
  glassBadgeText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.chocolate,
    letterSpacing: 0.2,
  },
  liveOrb: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.green,
  },
  floatCard: {
    position: 'absolute',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  floatLeft: {
    width: 110,
    height: 140,
    top: 145,
    left: 6,
    transform: [{ rotate: '-4deg' }],
  },
  floatRight: {
    width: 95,
    height: 120,
    top: 180,
    right: 6,
    transform: [{ rotate: '3deg' }],
  },
  floatImg: {
    width: '100%',
    height: '100%',
  },
  floatCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(253,248,243,0.9)',
    padding: 6,
  },
  floatCardLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: COLORS.chocolate,
    letterSpacing: 0.1,
  },
  textWrap: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.86)',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  livePillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.chocolate,
    letterSpacing: 0.2,
  },
  headline: {
    fontFamily: FONTS.serif,
    fontSize: 38,
    fontWeight: '700',
    color: COLORS.chocolate,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  headlineAccent: {
    color: COLORS.pink,
  },
  subline: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 21,
    fontWeight: '300',
    maxWidth: 320,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  ctaPrimary: {
    flex: 1,
    backgroundColor: COLORS.chocolate,
    borderRadius: RADIUS.full,
    paddingVertical: 15,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  ctaPrimaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.cream,
    letterSpacing: 0.4,
  },
  ctaSecondary: {
    flex: 1,
    backgroundColor: COLORS.cream,
    borderRadius: RADIUS.full,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  ctaSecondaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.chocolate,
    letterSpacing: 0.3,
  },
})
