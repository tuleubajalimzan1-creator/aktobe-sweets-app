import React from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, Image, Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'

const { width: W } = Dimensions.get('window')

export default function FinalCTA() {
  return (
    <View style={styles.section}>
      <LinearGradient
        colors={['#2c1810', '#52291a', '#3d1f14']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Ambient glow */}
        <View style={styles.glow} />

        {/* Floating dessert images */}
        <View style={styles.imgWrap}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80' }}
            style={[styles.floatImg, styles.floatImg1]}
          />
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=300&q=80' }}
            style={[styles.floatImg, styles.floatImg2]}
          />
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&q=80' }}
            style={[styles.floatImg, styles.floatImg3]}
          />
        </View>

        {/* Text */}
        <View style={styles.textWrap}>
          <Text style={styles.eyebrow}>Создай что-то своё</Text>
          <Text style={styles.title}>
            Создай десерт,{'\n'}который станет{'\n'}
            <Text style={styles.titleAccent}>следующим трендом</Text>
          </Text>
          <Text style={styles.sub}>
            Тысячи людей уже делятся своими работами. Стань частью сообщества кондитеров Актобе.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.85}>
            <Text style={styles.btnPrimaryText}>✨ Собрать торт</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.85}>
            <Text style={styles.btnSecondaryText}>Смотреть ленту</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  card: {
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    overflow: 'hidden',
    position: 'relative',
    gap: SPACING.lg,
    ...SHADOWS.lg,
  },
  glow: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(232,105,138,0.18)',
  },
  imgWrap: {
    height: 160,
    position: 'relative',
  },
  floatImg: {
    position: 'absolute',
    borderRadius: RADIUS.lg,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  floatImg1: {
    width: 110,
    height: 140,
    left: 0,
    top: 10,
    transform: [{ rotate: '-4deg' }],
  },
  floatImg2: {
    width: 100,
    height: 128,
    left: '35%',
    top: 0,
    transform: [{ rotate: '2deg' }],
  },
  floatImg3: {
    width: 90,
    height: 115,
    right: 0,
    top: 20,
    transform: [{ rotate: '-2deg' }],
  },
  textWrap: {
    gap: 10,
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
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.cream,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  titleAccent: {
    color: COLORS.pink,
  },
  sub: {
    fontSize: 13.5,
    color: 'rgba(253,248,243,0.5)',
    lineHeight: 20,
    fontWeight: '300',
  },
  btnRow: {
    gap: 10,
  },
  btnPrimary: {
    backgroundColor: COLORS.pink,
    borderRadius: RADIUS.full,
    paddingVertical: 16,
    alignItems: 'center',
    ...SHADOWS.pink,
    shadowOpacity: 0.35,
    shadowRadius: 18,
  },
  btnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  btnSecondary: {
    backgroundColor: 'rgba(253,248,243,0.1)',
    borderRadius: RADIUS.full,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(253,248,243,0.2)',
  },
  btnSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(253,248,243,0.75)',
    letterSpacing: 0.3,
  },
})
