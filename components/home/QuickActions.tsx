import React, { useRef } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'

const { width: W } = Dimensions.get('window')
const CARD_W = (W - SPACING.md * 2 - SPACING.xs * 3) / 4

const ACTIONS = [
  {
    label: 'Каталог',
    sub: '180+ десертов',
    icon: 'storefront-outline' as const,
    gradient: ['#fce8ed', '#f5d0de'] as [string, string],
    iconColor: '#e8698a',
    route: '/(tabs)/feed' as const,
  },
  {
    label: 'Конструктор',
    sub: 'Собери сам',
    icon: 'construct-outline' as const,
    gradient: ['#fef9c3', '#fde68a'] as [string, string],
    iconColor: '#a16207',
    route: '/(tabs)/build' as const,
  },
  {
    label: 'Тренды',
    sub: 'Что в моде',
    icon: 'flame-outline' as const,
    gradient: ['#ffedd5', '#fed7aa'] as [string, string],
    iconColor: '#c2410c',
    route: '/(tabs)/feed' as const,
  },
  {
    label: 'Лента',
    sub: 'Вдохновение',
    icon: 'grid-outline' as const,
    gradient: ['#ede9fe', '#ddd6fe'] as [string, string],
    iconColor: '#7c3aed',
    route: '/(tabs)/feed' as const,
  },
]

export default function QuickActions() {
  const router = useRouter()
  const scales = useRef(ACTIONS.map(() => new Animated.Value(1))).current

  const handlePressIn = (i: number) =>
    Animated.spring(scales[i], { toValue: 0.93, useNativeDriver: true, speed: 80 }).start()

  const handlePressOut = (i: number, route: string) => {
    Animated.spring(scales[i], { toValue: 1, useNativeDriver: true, speed: 50 }).start()
    router.navigate(route as any)
  }

  return (
    <View style={styles.container}>
      {ACTIONS.map((action, i) => (
        <Animated.View key={action.label} style={{ transform: [{ scale: scales[i] }] }}>
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={() => handlePressIn(i)}
            onPressOut={() => handlePressOut(i, action.route)}
          >
            <LinearGradient
              colors={action.gradient}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
                <Ionicons name={action.icon} size={22} color={action.iconColor} />
              </View>
              <Text style={styles.label}>{action.label}</Text>
              <Text style={styles.sub}>{action.sub}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
    marginTop: SPACING.lg,
  },
  card: {
    width: CARD_W,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    gap: 6,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  label: {
    fontFamily: FONTS.serif,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.chocolate,
    lineHeight: 16,
  },
  sub: {
    fontSize: 9.5,
    color: COLORS.muted,
    fontWeight: '400',
    lineHeight: 13,
  },
})
