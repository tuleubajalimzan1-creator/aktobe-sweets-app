import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'

function SkeletonBox({ w, h, r = 8 }: { w: number | string; h: number; r?: number }) {
  const shimmer = useRef(new Animated.Value(0.5)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1,   duration: 750, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0.5, duration: 750, useNativeDriver: true }),
      ])
    ).start()
  }, [])

  return (
    <Animated.View
      style={{
        width: w as any,
        height: h,
        borderRadius: r,
        backgroundColor: '#e8d5bc',
        opacity: shimmer,
      }}
    />
  )
}

interface Props {
  width: number
  imgHeight?: number
}

export default function SkeletonCard({ width, imgHeight = 260 }: Props) {
  return (
    <View style={[styles.card, SHADOWS.sm, { width }]}>
      {/* Image placeholder */}
      <SkeletonBox w="100%" h={imgHeight} r={0} />

      {/* Body */}
      <View style={styles.body}>
        {/* Title lines */}
        <SkeletonBox w="90%" h={13} r={6} />
        <SkeletonBox w="65%" h={13} r={6} />

        {/* Tags */}
        <View style={styles.row}>
          <SkeletonBox w={52} h={20} r={10} />
          <SkeletonBox w={60} h={20} r={10} />
          <SkeletonBox w={48} h={20} r={10} />
        </View>

        {/* Stats */}
        <View style={styles.row}>
          <SkeletonBox w={38} h={14} r={6} />
          <SkeletonBox w={32} h={14} r={6} />
          <SkeletonBox w={32} h={14} r={6} />
        </View>

        {/* Buttons */}
        <View style={styles.row}>
          <SkeletonBox w="47%" h={34} r={17} />
          <SkeletonBox w="47%" h={34} r={17} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  body: {
    padding: SPACING.sm,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
})
