import React, { useEffect } from 'react'
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { LIVE_ACTIVITY, LiveEvent } from '@/constants/mockData'

const TYPE_CONFIG = {
  save:   { icon: 'bookmark'    as const, color: COLORS.gold,  bg: '#fef9c3' },
  order:  { icon: 'bag'         as const, color: COLORS.pink,  bg: COLORS.pinkPale },
  repeat: { icon: 'repeat'      as const, color: '#7c3aed',    bg: '#ede9fe' },
  new:    { icon: 'sparkles'    as const, color: COLORS.green, bg: COLORS.greenBg },
}

function ActivityItem({ event, delay }: { event: LiveEvent; delay: number }) {
  const router = useRouter()
  const opacity = React.useRef(new Animated.Value(0)).current
  const x = React.useRef(new Animated.Value(-20)).current

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(opacity, { toValue: 1, useNativeDriver: true, speed: 30 }),
        Animated.spring(x, { toValue: 0, useNativeDriver: true, tension: 60, friction: 8 }),
      ]).start()
    }, delay)
    return () => clearTimeout(timer)
  }, [])

  const cfg = TYPE_CONFIG[event.type]

  return (
    <Animated.View style={[styles.item, { opacity, transform: [{ translateX: x }] }]}>
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        onPress={() => router.push({ pathname: '/product', params: { id: String(event.id) } })}
        activeOpacity={0.85}
      />
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: cfg.bg }]}>
        <Ionicons name={cfg.icon} size={14} color={cfg.color} />
      </View>
      {/* Text */}
      <View style={{ flex: 1 }}>
        <Text style={styles.itemText} numberOfLines={1}>
          <Text style={styles.nameText}>{event.name}</Text>
          {' '}{event.action}{' '}
          <Text style={styles.targetText}>{event.target}</Text>
        </Text>
        <Text style={styles.timeText}>{event.time} назад</Text>
      </View>
      {/* Live indicator */}
      <View style={[styles.liveOrb, { backgroundColor: cfg.color }]} />
    </Animated.View>
  )
}

export default function LiveActivity() {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Сейчас в приложении</Text>
          </View>
          <Text style={styles.title}>Активность</Text>
        </View>
        <Text style={styles.onlineCount}>128 онлайн</Text>
      </View>

      <View style={[styles.card, SHADOWS.sm]}>
        {LIVE_ACTIVITY.map((event, i) => (
          <View key={event.id}>
            <ActivityItem event={event} delay={i * 150} />
            {i < LIVE_ACTIVITY.length - 1 && <View style={styles.divider} />}
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
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: COLORS.greenBg,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.green,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.greenText,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.chocolate,
  },
  onlineCount: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '400',
    marginBottom: 4,
  },
  card: {
    marginHorizontal: SPACING.md,
    backgroundColor: '#fff',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemText: {
    fontSize: 13,
    color: COLORS.chocolate,
    lineHeight: 17,
  },
  nameText: {
    fontWeight: '700',
  },
  targetText: {
    color: COLORS.pink,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 10.5,
    color: COLORS.mutedLight,
    marginTop: 2,
  },
  liveOrb: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.md + 36 + 12,
  },
})
