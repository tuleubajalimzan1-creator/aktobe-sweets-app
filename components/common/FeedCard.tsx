import React, { useRef, useState } from 'react'
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  Animated, Dimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { FeedPost } from '@/constants/mockData'

const { width: W } = Dimensions.get('window')

function formatK(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

interface FeedCardProps {
  post: FeedPost
  width?: number
  compact?: boolean
}

export default function FeedCard({ post, width = W - 32, compact = false }: FeedCardProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [reposted, setReposted] = useState(false)
  const [likeCt, setLikeCt] = useState(post.likes)
  const [saveCt, setSaveCt] = useState(post.saves)
  const [repostCt, setRepostCt] = useState(post.repeats)
  const [commentCt] = useState(post.comments)

  const heartScale = useRef(new Animated.Value(1)).current
  const bookmarkScale = useRef(new Animated.Value(1)).current
  const repostScale = useRef(new Animated.Value(1)).current

  const bounce = (val: Animated.Value) => {
    Animated.sequence([
      Animated.spring(val, { toValue: 1.38, useNativeDriver: true, speed: 80, bounciness: 18 }),
      Animated.spring(val, { toValue: 1, useNativeDriver: true, speed: 60 }),
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
    setSaveCt(p => saved ? p - 1 : p + 1)
  }

  const handleRepost = () => {
    bounce(repostScale)
    setReposted(p => !p)
    setRepostCt(p => reposted ? p - 1 : p + 1)
  }

  const IMG_H = compact ? 180 : post.height ?? 260

  return (
    <TouchableOpacity
      style={[styles.card, { width }, SHADOWS.md]}
      activeOpacity={0.97}
      onPress={() => router.push({ pathname: '/product', params: { id: post.id } })}
    >
      {/* Image */}
      <View style={[styles.imgWrap, { height: IMG_H }]}>
        <Image source={{ uri: post.image }} style={styles.img} />
        <LinearGradient
          colors={['transparent', 'rgba(44,24,16,0.62)']}
          style={styles.imgGradient}
        />

        {/* Occasion badge */}
        <View style={styles.occasionBadge}>
          <Text style={styles.occasionIcon}>{post.occasionIcon}</Text>
          <Text style={styles.occasionText}>{post.occasion}</Text>
        </View>

        {/* Save button */}
        <Animated.View style={[styles.saveBtn, { transform: [{ scale: bookmarkScale }] }]}>
          <TouchableOpacity onPress={handleSave} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={saved ? COLORS.gold : '#fff'}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Author row (bottom of image) */}
        <TouchableOpacity
          style={styles.authorRow}
          onPress={() => router.push({ pathname: '/chef', params: { name: post.author } })}
          activeOpacity={0.85}
        >
          <View style={styles.authorAvatar}>
            <Text style={styles.authorInitial}>{post.author.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.authorName} numberOfLines={1}>{post.author}</Text>
            <Text style={styles.authorRating}>⭐ {post.authorRating}</Text>
          </View>
          <View style={styles.priceChip}>
            <Text style={styles.priceText}>{post.price.toLocaleString()} ₸</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.desc} numberOfLines={2}>{post.description}</Text>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {post.tags.slice(0, 3).map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <TouchableOpacity style={styles.statBtn} onPress={handleLike}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={17}
                color={liked ? COLORS.pink : COLORS.muted}
              />
              <Text style={[styles.statText, liked && { color: COLORS.pink }]}>
                {formatK(likeCt)}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: repostScale }] }}>
            <TouchableOpacity style={styles.statBtn} onPress={handleRepost}>
              <Ionicons
                name={reposted ? 'repeat' : 'repeat-outline'}
                size={17}
                color={reposted ? '#7c3aed' : COLORS.muted}
              />
              <Text style={[styles.statText, reposted && { color: '#7c3aed' }]}>{repostCt}</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.statBtn}
            onPress={() => router.push({ pathname: '/comments', params: { postId: post.id } })}
          >
            <Ionicons name="chatbubble-outline" size={16} color={COLORS.muted} />
            <Text style={styles.statText}>{commentCt}</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />
          <Text style={styles.repeatHint}>🔄 Повторяли {post.repeats}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.btnRepeat}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/build')}
          >
            <Ionicons name="color-wand-outline" size={13} color={COLORS.chocolate} />
            <Text style={styles.btnRepeatText} numberOfLines={1}>Повторить</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnOrder}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/product', params: { id: post.id } })}
          >
            <Text style={styles.btnOrderText} numberOfLines={1}>Заказать</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imgWrap: {
    position: 'relative',
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  imgGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '65%',
  },
  occasionBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(253,248,243,0.92)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  occasionIcon: {
    fontSize: 12,
  },
  occasionText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: COLORS.chocolate,
  },
  saveBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  authorRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.pink,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  authorInitial: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  authorName: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 14,
  },
  authorRating: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 13,
  },
  priceChip: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  body: {
    padding: SPACING.md,
    gap: 10,
  },
  desc: {
    fontFamily: FONTS.serif,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.chocolate,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: COLORS.cream,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    fontSize: 10,
    color: COLORS.muted,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '500',
  },
  repeatHint: {
    fontSize: 9.5,
    color: COLORS.gold,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  btnRepeat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cream,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    minWidth: 0,
  },
  btnRepeatText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.chocolate,
    flexShrink: 1,
  },
  btnOrder: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.chocolate,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  btnOrderText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cream,
  },
})
