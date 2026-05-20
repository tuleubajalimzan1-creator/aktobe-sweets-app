import React, { useEffect, useRef } from 'react'
import {
  View, Text, StyleSheet, Animated, Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'

const { width: W } = Dimensions.get('window')

const STATS = [
  { value: 500, suffix: '+', label: 'Заказов',        icon: '🎂' },
  { value: 4,   suffix: '.9⭐', label: 'Рейтинг',    icon: '⭐' },
  { value: 20,  suffix: '+', label: 'Кондитеров',     icon: '👨‍🍳' },
  { value: 60,  suffix: ' мин', label: 'Доставка',    icon: '🚀' },
]

const PAYMENTS = ['Kaspi Pay', 'Kaspi QR', 'Visa', 'MC']

function Counter({ value, suffix, label, icon, delay }: any) {
  const count = useRef(new Animated.Value(0)).current
  const [display, setDisplay] = React.useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(count, {
        toValue: value,
        duration: 1600,
        useNativeDriver: false,
      }).start()
    }, delay)

    const listener = count.addListener(({ value: v }) => setDisplay(Math.floor(v)))
    return () => {
      clearTimeout(timer)
      count.removeListener(listener)
    }
  }, [])

  return (
    <View style={styles.statItem}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{display}{suffix}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

export default function TrustSection() {
  return (
    <View style={styles.section}>
      <LinearGradient
        colors={['#160b06', '#2c1810', '#3d2215']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Ambient glows */}
        <View style={styles.glow1} />
        <View style={styles.glow2} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Нам доверяют</Text>
          <Text style={styles.title}>В цифрах</Text>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {STATS.map((s, i) => (
            <Counter key={s.label} {...s} delay={i * 120} />
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Payments */}
        <View style={styles.paymentsRow}>
          <Text style={styles.paymentsLabel}>Оплата:</Text>
          {PAYMENTS.map(p => (
            <View key={p} style={styles.paymentChip}>
              <Text style={styles.paymentText}>{p}</Text>
            </View>
          ))}
        </View>

        {/* Bottom guarantee */}
        <View style={styles.guarantee}>
          <Text style={styles.guaranteeText}>
            🛡️ Гарантия качества или полный возврат средств
          </Text>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  card: {
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.lg,
  },
  glow1: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(232,105,138,0.1)',
  },
  glow2: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(201,169,110,0.09)',
  },
  header: {
    marginBottom: SPACING.lg,
    gap: 5,
  },
  eyebrow: {
    fontSize: 9.5,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.cream,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(253,248,243,0.08)',
    borderRadius: RADIUS.lg,
    marginBottom: 4,
    backgroundColor: 'rgba(253,248,243,0.04)',
  },
  statIcon: { fontSize: 22 },
  statValue: {
    fontFamily: FONTS.serif,
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.cream,
    lineHeight: 34,
  },
  statLabel: {
    fontSize: 10.5,
    color: 'rgba(253,248,243,0.48)',
    fontWeight: '400',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(253,248,243,0.08)',
    marginVertical: SPACING.md,
  },
  paymentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  paymentsLabel: {
    fontSize: 11,
    color: 'rgba(253,248,243,0.42)',
    fontWeight: '400',
  },
  paymentChip: {
    backgroundColor: 'rgba(253,248,243,0.07)',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(253,248,243,0.1)',
  },
  paymentText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: 'rgba(253,248,243,0.52)',
  },
  guarantee: {
    marginTop: SPACING.md,
    backgroundColor: 'rgba(74,222,128,0.1)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.2)',
  },
  guaranteeText: {
    fontSize: 12,
    color: 'rgba(253,248,243,0.65)',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 17,
  },
})
