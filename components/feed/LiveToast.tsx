import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'

const MESSAGES = [
  { icon: 'bookmark'  as const, color: COLORS.gold,    bg: '#fef9c3', text: 'Алия сохранила «Медовик с ягодами»'       },
  { icon: 'repeat'    as const, color: '#7c3aed',       bg: '#ede9fe', text: 'Гульнар повторяет «Торт с велюром»'        },
  { icon: 'bag'       as const, color: COLORS.pink,    bg: COLORS.pinkPale, text: 'Майра только что заказала торт 🎂'   },
  { icon: 'sparkles'  as const, color: COLORS.green,   bg: COLORS.greenBg, text: 'Айгуль опубликовала новую работу'      },
  { icon: 'heart'     as const, color: COLORS.pink,    bg: COLORS.pinkPale, text: '47 человек сохранили этот десерт'    },
  { icon: 'flame'     as const, color: '#ea580c',       bg: '#fff0e6', text: '«Бенто-торт» стал трендом дня 🔥'         },
]

let msgIndex = 0

export default function LiveToast() {
  const translateY = useRef(new Animated.Value(80)).current
  const opacity    = useRef(new Animated.Value(0)).current
  const [msg, setMsg] = useState(MESSAGES[0])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = () => {
      msgIndex = (msgIndex + 1) % MESSAGES.length
      setMsg(MESSAGES[msgIndex])
      setVisible(true)

      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 60, friction: 9 }),
        Animated.timing(opacity,    { toValue: 1, duration: 250,          useNativeDriver: true }),
      ]).start()

      setTimeout(hide, 3200)
    }

    const hide = () => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 80, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity,    { toValue: 0,  duration: 250, useNativeDriver: true }),
      ]).start(() => setVisible(false))
    }

    const delay = 2500 + Math.random() * 1000
    const timer = setTimeout(show, delay)
    const interval = setInterval(show, 8000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  if (!visible) return null

  return (
    <Animated.View
      style={[
        styles.toast,
        SHADOWS.md,
        { transform: [{ translateY }], opacity },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: msg.bg }]}>
        <Ionicons name={msg.icon} size={14} color={msg.color} />
      </View>
      <Text style={styles.text} numberOfLines={1}>{msg.text}</Text>
      <View style={[styles.dot, { backgroundColor: msg.color }]} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 24,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconWrap: {
    width: 28, height: 28,
    borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '500',
    color: COLORS.chocolate,
  },
  dot: {
    width: 7, height: 7,
    borderRadius: 3.5,
    flexShrink: 0,
  },
})
