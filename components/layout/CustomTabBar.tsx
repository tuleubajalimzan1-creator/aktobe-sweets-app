import React, { useRef } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Platform, Dimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, SHADOWS, RADIUS } from '@/constants/theme'

const { width: SCREEN_W } = Dimensions.get('window')

interface TabItem {
  name: string
  label: string
  icon: keyof typeof Ionicons.glyphMap
  iconActive: keyof typeof Ionicons.glyphMap
}

const TABS: TabItem[] = [
  { name: 'index',       label: 'Главная',     icon: 'home-outline',         iconActive: 'home'           },
  { name: 'feed',        label: 'Лента',       icon: 'grid-outline',         iconActive: 'grid'           },
  { name: 'build',       label: 'Торт',        icon: 'add-circle-outline',   iconActive: 'add-circle'     },
  { name: 'orders',      label: 'Заказы',      icon: 'receipt-outline',      iconActive: 'receipt'        },
  { name: 'profile',     label: 'Профиль',     icon: 'person-outline',       iconActive: 'person'         },
]

interface CustomTabBarProps {
  state: any
  navigation: any
}

export default function CustomTabBar({ state, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets()
  const scales = useRef(TABS.map(() => new Animated.Value(1))).current

  const handlePress = (index: number, routeName: string) => {
    const isFocused = state.index === index

    Animated.sequence([
      Animated.spring(scales[index], { toValue: 0.82, useNativeDriver: true, speed: 50 }),
      Animated.spring(scales[index], { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start()

    if (!isFocused) {
      navigation.navigate(routeName)
    }
  }

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.tint} />
      <View style={styles.border} />

      <View style={styles.inner}>
        {TABS.map((tab, index) => {
          const isFocused = state.index === index
          const isConstructor = tab.name === 'constructor'

          if (isConstructor) {
            return (
              <Animated.View
                key={tab.name}
                style={[styles.tabItem, { transform: [{ scale: scales[index] }] }]}
              >
                <TouchableOpacity
                  onPress={() => handlePress(index, tab.name)}
                  style={styles.constructorBtn}
                  activeOpacity={0.85}
                >
                  <View style={styles.constructorInner}>
                    <Ionicons
                      name={isFocused ? tab.iconActive : tab.icon}
                      size={26}
                      color="#fff"
                    />
                  </View>
                  <Text style={[styles.label, styles.constructorLabel]}>Торт</Text>
                </TouchableOpacity>
              </Animated.View>
            )
          }

          return (
            <Animated.View
              key={tab.name}
              style={[styles.tabItem, { transform: [{ scale: scales[index] }] }]}
            >
              <TouchableOpacity
                onPress={() => handlePress(index, tab.name)}
                style={styles.tabBtn}
                activeOpacity={0.75}
              >
                <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                  <Ionicons
                    name={isFocused ? tab.iconActive : tab.icon}
                    size={22}
                    color={isFocused ? COLORS.pink : COLORS.muted}
                  />
                </View>
                <Text
                  style={[
                    styles.label,
                    isFocused ? styles.labelActive : styles.labelInactive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    ...SHADOWS.md,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(253,248,243,0.92)',
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: COLORS.border,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabBtn: {
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  iconWrap: {
    width: 42,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  iconWrapActive: {
    backgroundColor: COLORS.pinkPale,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  labelActive: {
    color: COLORS.pink,
    fontWeight: '700',
  },
  labelInactive: {
    color: COLORS.mutedLight,
  },
  constructorBtn: {
    alignItems: 'center',
    gap: 3,
    marginTop: -20,
  },
  constructorInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.chocolate,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3.5,
    borderColor: COLORS.cream,
    ...SHADOWS.pink,
    shadowColor: COLORS.chocolate,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  constructorLabel: {
    color: COLORS.chocolate,
    fontWeight: '700',
    fontSize: 9.5,
  },
})
