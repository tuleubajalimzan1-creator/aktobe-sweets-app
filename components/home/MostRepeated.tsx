import React from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Image, Dimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { MOST_REPEATED } from '@/constants/mockData'

const CARD_W = 260

export default function MostRepeated() {
  const router = useRouter()
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Чаще всего повторяют</Text>
          <Text style={styles.title}>Популярные дизайны</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Все →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_W + 14}
        snapToAlignment="start"
      >
        {MOST_REPEATED.map((design, i) => (
          <View key={design.id} style={[styles.card, SHADOWS.md]}>
            {/* Image */}
            <View style={styles.imgWrap}>
              <Image source={{ uri: design.image }} style={styles.img} />
              <LinearGradient
                colors={['transparent', 'rgba(44,24,16,0.7)']}
                style={styles.imgOverlay}
              />
              {/* Rank badge */}
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{i + 1}</Text>
              </View>
              {/* Repeat count */}
              <View style={styles.repeatBadge}>
                <Ionicons name="repeat" size={11} color={COLORS.gold} />
                <Text style={styles.repeatBadgeText}>Повторяли {design.repeats}</Text>
              </View>
            </View>

            {/* Info */}
            <View style={styles.info}>
              <View style={styles.infoTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name} numberOfLines={1}>{design.name}</Text>
                  <Text style={styles.author}>{design.author}</Text>
                </View>
                <Text style={styles.price}>{design.price.toLocaleString()} ₸</Text>
              </View>

              {/* Live stats */}
              <View style={styles.liveStats}>
                <View style={styles.liveStat}>
                  <View style={styles.liveOrb} />
                  <Text style={styles.liveStatText}>Заказали сегодня: <Text style={styles.liveStatValue}>{design.ordersToday}</Text></Text>
                </View>
                <View style={styles.savesStat}>
                  <Ionicons name="bookmark" size={11} color={COLORS.gold} />
                  <Text style={styles.savesText}>{design.saves} сохранений</Text>
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.btnRepeat} activeOpacity={0.85} onPress={() => router.push('/(tabs)/build')}>
                  <Ionicons name="color-wand-outline" size={13} color={COLORS.chocolate} />
                  <Text style={styles.btnRepeatText}>Повторить</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnOrder} activeOpacity={0.85} onPress={() => router.push({ pathname: '/product', params: { id: String(design.id) } })}>
                  <Text style={styles.btnOrderText}>Заказать</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnAuthor} onPress={() => router.push({ pathname: '/chef', params: { name: design.author } })}>
                  <Ionicons name="person-outline" size={14} color={COLORS.muted} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
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
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.chocolate,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: '500',
    marginBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: 14,
    paddingRight: SPACING.md + 8,
  },
  card: {
    width: CARD_W,
    backgroundColor: '#fff',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imgWrap: {
    height: 200,
    position: 'relative',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  imgOverlay: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0, top: '30%',
  },
  rankBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.chocolate,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  rankText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  repeatBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(253,248,243,0.92)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  repeatBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.chocolate,
  },
  info: {
    padding: SPACING.md,
    gap: 10,
  },
  infoTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  name: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.chocolate,
    lineHeight: 22,
  },
  author: {
    fontSize: 11.5,
    color: COLORS.muted,
    marginTop: 2,
  },
  price: {
    fontFamily: FONTS.serif,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.pink,
  },
  liveStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveOrb: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.green,
  },
  liveStatText: {
    fontSize: 11.5,
    color: COLORS.muted,
    fontWeight: '400',
  },
  liveStatValue: {
    fontWeight: '700',
    color: COLORS.chocolate,
  },
  savesStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  savesText: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: '500',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnRepeat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 11,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cream,
  },
  btnRepeatText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.chocolate,
  },
  btnOrder: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.pink,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.pink,
    shadowOpacity: 0.22,
    shadowRadius: 12,
  },
  btnOrderText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  btnAuthor: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cream,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
