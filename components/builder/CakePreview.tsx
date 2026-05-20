import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const { width: SW } = Dimensions.get('window')

/* ── Color tables ── */
const BASE_PALETTE: Record<string, [string, string, string]> = {
  chocolate:  ['#2a1209', '#5c3220', '#7a4530'],
  vanilla:    ['#cdb870', '#f5e6c8', '#fffaf0'],
  red_velvet: ['#7f1d1d', '#b91c1c', '#ef4444'],
  honey:      ['#78350f', '#b45309', '#d97706'],
  carrot:     ['#7c2d12', '#c2410c', '#ea580c'],
  pistachio:  ['#14532d', '#166534', '#22c55e'],
}

const FROSTING_PALETTE: Record<string, { top: [string, string]; stripe: string }> = {
  berry:      { top: ['#f9a8d4', '#fce7f3'], stripe: '#f472b6' },
  cream:      { top: ['#fdf8f3', '#ffffff'], stripe: '#f0e8d8' },
  chocolate:  { top: ['#92400e', '#c07840'], stripe: '#78350f' },
  caramel:    { top: ['#fbbf24', '#fef3c7'], stripe: '#d97706' },
  strawberry: { top: ['#f472b6', '#fce7f3'], stripe: '#ec4899' },
  mango:      { top: ['#fbbf24', '#fef9c3'], stripe: '#f59e0b' },
}

const DECOR_MAP: Record<string, { x: number; y: number; e: string; s: number }[]> = {
  berries:   [{ x: .24, y: .32, e: '🍓', s: 14 }, { x: .62, y: .25, e: '🍓', s: 12 }, { x: .45, y: .62, e: '🫐', s: 12 }],
  flowers:   [{ x: .28, y: .28, e: '🌸', s: 16 }, { x: .64, y: .44, e: '🌸', s: 14 }, { x: .48, y: .66, e: '🌸', s: 13 }],
  candles:   [{ x: .28, y: .35, e: '🕯️', s: 18 }, { x: .54, y: .28, e: '🕯️', s: 18 }, { x: .7,  y: .5,  e: '🕯️', s: 18 }],
  macarons:  [{ x: .18, y: .48, e: '🍬', s: 14 }, { x: .5, y: .18, e: '🍬', s: 14 }, { x: .76, y: .45, e: '🍬', s: 14 }, { x: .5, y: .74, e: '🍬', s: 14 }],
  chocolate: [{ x: .3, y: .38, e: '🍫', s: 14 }, { x: .64, y: .3, e: '🍫', s: 12 }],
  gold:      [{ x: .28, y: .28, e: '✨', s: 16 }, { x: .62, y: .52, e: '✨', s: 14 }, { x: .46, y: .66, e: '⭐', s: 15 }],
  sprinkles: [{ x: .2, y: .24, e: '🎊', s: 14 }, { x: .7, y: .3, e: '🎉', s: 14 }, { x: .42, y: .66, e: '🎊', s: 13 }, { x: .58, y: .48, e: '🎉', s: 12 }],
  ribbons:   [{ x: .5, y: .38, e: '🎀', s: 24 }],
  topper:    [{ x: .5, y: .44, e: '🏆', s: 28 }],
  drip:      [{ x: .2, y: .82, e: '🍯', s: 13 }, { x: .5, y: .88, e: '🍯', s: 13 }, { x: .78, y: .82, e: '🍯', s: 13 }],
}

export interface CakeConfig {
  base:       { id: string }
  filling:    { id: string }
  size:       { scale: number }
  shape:      { id: string }
  decor:      string[]
  text:       string
  textColor:  string
  textFont:   string
}

interface Props {
  config: CakeConfig
}

function CakeTier({
  w, sideH, topH, baseId, fillingId, isRound, isTop = true,
}: {
  w: number; sideH: number; topH: number
  baseId: string; fillingId: string; isRound: boolean; isTop?: boolean
}) {
  const [dark, main, light] = BASE_PALETTE[baseId] ?? BASE_PALETTE.vanilla
  const frosting = FROSTING_PALETTE[fillingId] ?? FROSTING_PALETTE.cream

  const borderR = isRound
    ? { borderBottomLeftRadius: w * 0.06, borderBottomRightRadius: w * 0.06 }
    : { borderRadius: 10 }

  const topBorderR = isRound ? w / 2 : 10

  return (
    <View style={{ width: w, height: sideH + topH / 2 }}>
      {/* Side body */}
      <LinearGradient
        colors={[dark, main, light, main, dark]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[{
          position: 'absolute',
          top: topH / 2,
          width: w,
          height: sideH,
        }, borderR]}
      >
        {/* Filling stripes */}
        {[0.28, 0.55, 0.78].map((pos, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              top: sideH * pos,
              left: 0, right: 0,
              height: 5,
              backgroundColor: frosting.stripe,
              opacity: 0.55,
            }}
          />
        ))}
        {/* Top frosting band */}
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 7,
          backgroundColor: frosting.top[0],
          opacity: 0.7,
        }} />
      </LinearGradient>

      {/* Top oval cap */}
      {isTop && (
        <LinearGradient
          colors={frosting.top}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            width: w,
            height: topH,
            borderRadius: topBorderR,
            zIndex: 2,
          }}
        />
      )}
    </View>
  )
}

export default function CakePreview({ config }: Props) {
  const fadeAnim  = useRef(new Animated.Value(1)).current
  const scaleAnim = useRef(new Animated.Value(1)).current
  const prevConfigRef = useRef(config)

  useEffect(() => {
    if (prevConfigRef.current === config) return
    prevConfigRef.current = config

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 0.6, duration: 80,  useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 0.97, speed: 60,    useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1,   duration: 200, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, speed: 30, bounciness: 10, useNativeDriver: true }),
      ]),
    ]).start()
  }, [config])

  const scale    = config.size.scale
  const BASE_W   = 190
  const SIDE_H   = 88
  const TOP_H    = 38

  const cakeW    = Math.round(BASE_W * scale)
  const sideH    = Math.round(SIDE_H * scale)
  const topH     = TOP_H

  const isRound  = config.shape.id !== 'square' && config.shape.id !== 'bento'
  const isBento  = config.shape.id === 'bento'
  const numTiers = config.shape.id === 'three_tier' ? 3 : config.shape.id === 'two_tier' ? 2 : 1

  const tierScales = numTiers === 3 ? [1, 0.7, 0.48] : numTiers === 2 ? [1, 0.68] : [1]
  const tierHeightFactors = numTiers === 3 ? [1, 0.8, 0.68] : numTiers === 2 ? [1, 0.8] : [1]

  const frosting = FROSTING_PALETTE[config.filling.id] ?? FROSTING_PALETTE.cream

  /* Decoration and text items on top face */
  const topW = isBento ? cakeW * 0.55 : cakeW
  const topFaceH = isBento ? topW : topH

  const decorItems: React.ReactNode[] = []
  config.decor.forEach(id => {
    const placements = DECOR_MAP[id] ?? []
    placements.forEach((p, i) => {
      decorItems.push(
        <Text
          key={`${id}_${i}`}
          style={{
            position: 'absolute',
            left: topW * p.x - p.s / 2,
            top: topFaceH * p.y - p.s / 2,
            fontSize: p.s,
          }}
        >
          {p.e}
        </Text>
      )
    })
  })

  const totalH = tierScales.reduce((acc, ts, i) => {
    return acc + Math.round(sideH * tierHeightFactors[i] * ts) + topH / 2
  }, 0) + topH / 2 + 20

  return (
    <View style={styles.container}>
      {/* Ambient glow */}
      <LinearGradient
        colors={['rgba(201,169,110,0.08)', 'rgba(253,248,243,0)']}
        style={styles.glow}
      />

      <Animated.View style={[
        styles.cakeWrap,
        { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
      ]}>
        {/* Shadow */}
        <View style={[styles.shadow, { width: cakeW * 0.82 }]} />

        {/* Tiers (bottom to top in visual stacking → render bottom first) */}
        <View style={{ alignItems: 'center', gap: 0 }}>
          {[...tierScales].reverse().map((ts, ri) => {
            const i = tierScales.length - 1 - ri
            const tw = Math.round((isBento ? cakeW * 0.55 : cakeW) * ts)
            const th = Math.round(sideH * tierHeightFactors[i])
            const isTopTier = i === tierScales.length - 1

            return (
              <View key={i} style={{ marginTop: i === 0 ? 0 : -(topH / 2 + 2), zIndex: tierScales.length - i }}>
                <CakeTier
                  w={tw}
                  sideH={th}
                  topH={topH}
                  baseId={config.base.id}
                  fillingId={config.filling.id}
                  isRound={isRound && !isBento}
                  isTop={isTopTier}
                />

                {/* Decor + text on top tier only */}
                {isTopTier && (
                  <View style={[{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: tw,
                    height: topH,
                    zIndex: 10,
                  }]}>
                    {decorItems}
                    {config.text.length > 0 && (
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.cakeText,
                          {
                            color: config.textColor === 'gold' ? '#c9a96e'
                              : config.textColor === 'pink' ? '#e8698a'
                              : config.textColor === 'chocolate' ? '#2c1810'
                              : '#ffffff',
                            fontFamily: config.textFont === 'serif' ? 'serif' : undefined,
                            maxWidth: tw - 12,
                          },
                        ]}
                      >
                        {config.text}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            )
          })}
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: SW,
    height: '100%',
  },
  cakeWrap: {
    alignItems: 'center',
  },
  shadow: {
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(44,24,16,0.18)',
    marginBottom: -7,
    alignSelf: 'center',
  },
  cakeText: {
    position: 'absolute',
    bottom: 6,
    alignSelf: 'center',
    fontSize: 11,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
})
