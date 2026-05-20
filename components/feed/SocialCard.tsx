import React, { useRef, useState } from 'react'
import {
  View, Text, Image, TouchableOpacity, StyleSheet, Animated,
} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { FeedPost } from '@/constants/mockData'

const BADGE_CONFIG = {
  trending: { label: '🔥 Тренд',          bg: '#fff0e6', color: '#ea580c' },
  editor:   { label: '⭐ Выбор редакции', bg: '#fef9c3', color: '#a16207' },
  repeated: { label: '👑 Популярный',     bg: '#ede9fe', color: '#6d28d9' },
}

function formatK(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

const AVATAR_COLORS = [
  COLORS.pink, '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626',
]
function avatarColor(name: string) {
  const i = name.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[i]
}

interface Props {
  post: FeedPost
  width: number
}

export default function SocialCard({ post, width }: Props) {
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [reposted, setReposted] = useState(false)
  const [likeCt, setLikeCt] = useState(post.likes)
  const [repostCt, setRepostCt] = useState(post.repeats)

  const heartScale = useRef(new Animated.Value(1)).current
  const bookmarkScale = useRef(new Animated.Value(1)).current
  const repostScale = useRef(new Animated.Value(1)).current
  const cardScale = useRef(new Animated.Value(1)).current

  const bounce = (val: Animated.Value) => {
    Animated.sequence([
      Animated.spring(val, { toValue: 1.45, useNativeDriver: true, speed: 90, bounciness: 22 }),
      Animated.spring(val, { toValue: 1,    useNativeDriver: true, speed: 60 }),
    ]).start()
  }

  const handleLike = () => {
    bounce(heartScale)
    setLiked(p => !p)
    setLikeCt(p => liked ? p - 1 : p + 1)
  }
  const handleSave = () => {
    bounce(bookmarkScale)
    setSaved(p => !p)
  }
  const handleRepost = () => {
    bounce(repostScale)
    setReposted(p => !p)
    setRepostCt(p => reposted ? p - 1 : p + 1)
  }

  const onPressIn = () =>
    Animated.spring(cardScale, { toValue: 0.97, useNativeDriver: true, speed: 100 }).start()
  const onPressOut = () =>
    Animated.spring(cardScale, { toValue: 1, useNativeDriver: true, speed: 60 }).start()

  const IMG_H = post.height ?? 260
  const badge = post.badge ? BADGE_CONFIG[post.badge] : null

  return (
    <Animated.View style={[styles.card, SHADOWS.md, { width, transform: [{ scale: cardScale }] }]}>
      {/* ── IMAGE ── */}
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => router.push({ pathname: '/product', params: { id: post.id } })}
      >
        <View style={[styles.imgWrap, { height: IMG_H }]}>
          <Image source={{ uri: post.image }} style={styles.img} resizeMode="cover" />

          {/* Dark gradient at bottom */}
          <LinearGradient
            colors={['transparent', 'rgba(20,8,4,0.72)']}
            style={styles.imgGrad}
          />

          {/* Occasion badge */}
          <View style={styles.occasionBadge}>
            <Text style={styles.occasionIcon}>{post.occasionIcon}</Text>
            <Text style={styles.occasionText}>{post.occasion}</Text>
          </View>

          {/* Trending / editor badge */}
          {badge && (
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
            </View>
          )}

          {/* Bookmark */}
          <Animated.View style={[styles.bookmarkWrap, { transform: [{ scale: bookmarkScale }] }]}>
            <TouchableOpacity
              onPress={handleSave}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={[styles.bookmarkBtn, saved && styles.bookmarkBtnActive]}
            >
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={17}
                color={saved ? COLORS.gold : '#fff'}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Author row — glassmorphism at bottom of image */}
          <TouchableOpacity
            style={styles.authorRow}
            onPress={() => router.push({ pathname: '/chef', params: { name: post.author } })}
            activeOpacity={0.85}
          >
            <View style={[styles.authorAvatar, { backgroundColor: avatarColor(post.author) }]}>
              <Text style={styles.authorInitial}>{post.author.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.authorName} numberOfLines={1}>{post.author}</Text>
              <Text style={styles.authorRating}>⭐ {post.authorRating}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>{post.price.toLocaleString()} ₸</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* ── BODY ── */}
      <View style={styles.body}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>{post.description}</Text>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {post.tags.slice(0, 3).map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <TouchableOpacity style={styles.stat} onPress={handleLike}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={15}
                color={liked ? COLORS.pink : COLORS.muted}
              />
              <Text style={[styles.statTxt, liked && { color: COLORS.pink }]}>
                {formatK(likeCt)}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: repostScale }] }}>
            <TouchableOpacity style={styles.stat} onPress={handleRepost}>
              <Ionicons
                name={reposted ? 'repeat' : 'repeat-outline'}
                size={15}
                color={reposted ? '#7c3aed' : COLORS.muted}
              />
              <Text style={[styles.statTxt, reposted && { color: '#7c3aed' }]}>
                {repostCt}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.stat}
            onPress={() => router.push({ pathname: '/comments', params: { postId: post.id } })}
          >
            <Ionicons name="chatbubble-outline" size={14} color={COLORS.muted} />
            <Text style={styles.statTxt}>{formatK(post.comments)}</Text>
          </TouchableOpacity>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnRepeat}
            activeOpacity={0.82}
            onPress={() => router.push('/(tabs)/build')}
          >
            <Ionicons name="color-wand-outline" size={12} color={COLORS.chocolate} />
            <Text style={styles.btnRepeatTxt}>Повторить</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnOrder}
            activeOpacity={0.82}
            onPress={() => router.push({ pathname: '/product', params: { id: post.id } })}
          >
            <Text style={styles.btnOrderTxt}>Заказать</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
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
  imgWrap: {
    position: 'relative',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  imgGrad: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: '65%',
  },
  occasionBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(253,248,243,0.92)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  occasionIcon: { fontSize: 11 },
  occasionText: { fontSize: 9.5, fontWeight: '700', color: COLORS.chocolate },

  badge: {
    position: 'absolute',
    bottom: 52,
    left: 10,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 9, fontWeight: '700' },

  bookmarkWrap: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  bookmarkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  bookmarkBtnActive: {
    backgroundColor: 'rgba(253,248,243,0.9)',
  },

  authorRow: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(253,248,243,0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  authorAvatar: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#fff',
  },
  authorInitial: { fontSize: 11, fontWeight: '800', color: '#fff' },
  authorName: { fontSize: 11, fontWeight: '600', color: COLORS.chocolate, lineHeight: 14 },
  authorRating: { fontSize: 9.5, color: COLORS.muted },
  priceTag: {
    backgroundColor: COLORS.chocolate,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  priceText: { fontSize: 10.5, fontWeight: '700', color: COLORS.gold },

  body: {
    padding: SPACING.sm,
    gap: 8,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.chocolate,
    lineHeight: 19,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  tag: {
    backgroundColor: COLORS.cream,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: { fontSize: 9.5, color: COLORS.muted, fontWeight: '500' },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statTxt: { fontSize: 11.5, color: COLORS.muted, fontWeight: '500' },

  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  btnRepeat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cream,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  btnRepeatTxt: { fontSize: 10.5, fontWeight: '600', color: COLORS.chocolate },
  btnOrder: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.pink,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.pink,
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  btnOrderTxt: { fontSize: 10.5, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },
})
