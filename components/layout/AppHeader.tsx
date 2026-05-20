import React from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Platform, StatusBar,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, SHADOWS, SPACING, RADIUS } from '@/constants/theme'
import { useApp } from '@/context/AppContext'

interface AppHeaderProps {
  scrollY?: Animated.Value
  notifCount?: number
  onSearchFocus?: () => void
}

export default function AppHeader({
  scrollY,
  notifCount = 3,
  onSearchFocus,
}: AppHeaderProps) {
  const router = useRouter()
  const { savedPosts, cartCount } = useApp()
  const wishCount = savedPosts.size
  const HEADER_HEIGHT = 110

  const opacity = scrollY
    ? scrollY.interpolate({ inputRange: [0, 60], outputRange: [0, 1], extrapolate: 'clamp' })
    : new Animated.Value(1)

  const shadowOpacity = scrollY
    ? scrollY.interpolate({ inputRange: [0, 60], outputRange: [0, 0.1], extrapolate: 'clamp' })
    : new Animated.Value(0)

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { shadowOpacity },
      ]}
    >
      <Animated.View style={[styles.tint, { opacity }]} />

      <View style={styles.inner}>
        {/* Logo row */}
        <View style={styles.logoRow}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoMain}>Актобе</Text>
            <Text style={styles.logoDot}>.</Text>
            <View style={styles.logoSubWrap}>
              <Text style={styles.logoSub}>SWEETS</Text>
            </View>
          </View>

          <View style={styles.actions}>
            {/* Notifications */}
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.chocolate} />
              {notifCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notifCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Wishlist */}
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/wishlist')}>
              <Ionicons name="heart-outline" size={22} color={COLORS.chocolate} />
              {wishCount > 0 && (
                <View style={[styles.badge, { backgroundColor: COLORS.pink }]}>
                  <Text style={styles.badgeText}>{wishCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Cart */}
            <TouchableOpacity style={[styles.iconBtn, styles.cartBtn]} onPress={() => router.push('/(tabs)/orders')}>
              <Ionicons name="bag-outline" size={20} color="#fff" />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Avatar */}
            <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}>
              <Text style={styles.avatarText}>АН</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/search')}
          activeOpacity={0.85}
        >
          <Ionicons name="search-outline" size={16} color={COLORS.muted} style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Десерты, кондитеры, тренды...</Text>
          <View style={styles.searchFilter}>
            <Ionicons name="options-outline" size={15} color={COLORS.gold} />
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 50,
    shadowColor: COLORS.chocolate,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.cream,
  },
  inner: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },
  logoMain: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.chocolate,
    letterSpacing: -0.3,
  },
  logoDot: {
    fontFamily: FONTS.serif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.gold,
    lineHeight: 28,
  },
  logoSubWrap: {
    marginLeft: 4,
    marginBottom: 3,
  },
  logoSub: {
    fontSize: 8.5,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 3.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  cartBtn: {
    backgroundColor: COLORS.chocolate,
    borderColor: COLORS.chocolate,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.pink,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.cream,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#fff',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.pink,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    ...SHADOWS.sm,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 42,
    gap: 8,
    ...SHADOWS.sm,
  },
  searchIcon: {
    flexShrink: 0,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: COLORS.mutedLight,
    fontFamily: FONTS.sans,
    fontWeight: '400',
  },
  searchFilter: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: COLORS.pinkPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
