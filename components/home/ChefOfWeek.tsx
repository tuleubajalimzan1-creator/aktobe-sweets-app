import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  Image, Dimensions, Animated,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { CHEF_OF_WEEK } from '@/constants/mockData'

const { width: W } = Dimensions.get('window')

export default function ChefOfWeek() {
  const chef = CHEF_OF_WEEK
  const [followed, setFollowed] = useState(false)

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Кондитер недели</Text>
        <Text style={styles.title}>Мастер месяца</Text>
      </View>

      <View style={[styles.card, SHADOWS.lg]}>
        {/* Dark gradient header */}
        <LinearGradient
          colors={['#2c1810', '#52291a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardHeader}
        >
          {/* Ambient glow */}
          <View style={styles.glow} />

          {/* Badge */}
          <View style={styles.weekBadge}>
            <Text style={styles.weekBadgeText}>⭐ Кондитер недели</Text>
          </View>

          {/* Avatar + main info */}
          <View style={styles.chefRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>АН</Text>
              {/* Online indicator */}
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.chefInfo}>
              <Text style={styles.chefName}>{chef.name}</Text>
              <Text style={styles.chefSpecialty}>{chef.specialty}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingStars}>★ {chef.rating}</Text>
                <Text style={styles.ratingDivider}>·</Text>
                <Text style={styles.ordersText}>{chef.orders} заказов</Text>
                <Text style={styles.ratingDivider}>·</Text>
                <Text style={styles.followersText}>{chef.followers.toLocaleString()} подп.</Text>
              </View>
            </View>
          </View>

          {/* Bio */}
          <Text style={styles.bio} numberOfLines={2}>{chef.bio}</Text>

          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.followBtn, followed && styles.followBtnActive]}
              onPress={() => setFollowed(f => !f)}
              activeOpacity={0.85}
            >
              <Ionicons
                name={followed ? 'checkmark' : 'add'}
                size={14}
                color={followed ? COLORS.chocolate : '#fff'}
              />
              <Text style={[styles.followText, followed && styles.followTextActive]}>
                {followed ? 'Вы подписаны' : 'Подписаться'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileBtn} activeOpacity={0.85}>
              <Text style={styles.profileBtnText}>Профиль</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orderBtn} activeOpacity={0.85}>
              <Text style={styles.orderBtnText}>Заказать</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Works preview */}
        <View style={styles.worksSection}>
          <Text style={styles.worksLabel}>Работы</Text>
          <View style={styles.worksRow}>
            {chef.works.map((uri, i) => (
              <TouchableOpacity key={i} style={styles.workThumb} activeOpacity={0.85}>
                <Image source={{ uri }} style={styles.workImg} />
                {i === 2 && (
                  <View style={styles.workMore}>
                    <Text style={styles.workMoreText}>+12</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

const WORK_SZ = (W - SPACING.md * 2 - SPACING.md * 2 - 16) / 3

const styles = StyleSheet.create({
  section: {
    marginTop: SPACING.xl,
  },
  header: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: 6,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.chocolate,
  },
  card: {
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#fff',
  },
  cardHeader: {
    padding: SPACING.lg,
    gap: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(232,105,138,0.14)',
  },
  weekBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  weekBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  chefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: COLORS.pink,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    position: 'relative',
  },
  avatarText: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.green,
    borderWidth: 2.5,
    borderColor: COLORS.chocolate,
  },
  chefInfo: {
    flex: 1,
    gap: 4,
  },
  chefName: {
    fontFamily: FONTS.serif,
    fontSize: 21,
    fontWeight: '700',
    color: COLORS.cream,
  },
  chefSpecialty: {
    fontSize: 12.5,
    color: 'rgba(253,248,243,0.62)',
    fontWeight: '300',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  ratingStars: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: '700',
  },
  ratingDivider: {
    color: 'rgba(253,248,243,0.3)',
    fontSize: 12,
  },
  ordersText: {
    fontSize: 11.5,
    color: 'rgba(253,248,243,0.62)',
  },
  followersText: {
    fontSize: 11.5,
    color: 'rgba(253,248,243,0.62)',
  },
  bio: {
    fontSize: 13,
    color: 'rgba(253,248,243,0.58)',
    lineHeight: 19,
    fontWeight: '300',
    fontStyle: 'italic',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  followBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(253,248,243,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(253,248,243,0.2)',
  },
  followBtnActive: {
    backgroundColor: COLORS.cream,
  },
  followText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  followTextActive: {
    color: COLORS.chocolate,
  },
  profileBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(253,248,243,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(253,248,243,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(253,248,243,0.7)',
  },
  orderBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  worksSection: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  worksLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  worksRow: {
    flexDirection: 'row',
    gap: 8,
  },
  workThumb: {
    width: WORK_SZ,
    height: WORK_SZ,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
  },
  workImg: {
    width: '100%',
    height: '100%',
  },
  workMore: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(44,24,16,0.58)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workMoreText: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
})
