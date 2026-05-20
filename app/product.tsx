import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, SafeAreaView, Dimensions,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { FEED_POSTS } from '@/constants/mockData'
import { useApp } from '@/context/AppContext'

const { width: W } = Dimensions.get('window')

export default function ProductScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { isLiked, toggleLike, isSaved, toggleSave, addToCart } = useApp()
  const [ordered, setOrdered] = useState(false)

  const post = FEED_POSTS.find(p => p.id === id) ?? FEED_POSTS[0]
  const liked = isLiked(post.id)
  const saved = isSaved(post.id)

  const handleOrder = () => {
    addToCart()
    setOrdered(true)
    setTimeout(() => setOrdered(false), 2000)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Image */}
        <View style={styles.imgWrap}>
          <Image source={{ uri: post.image }} style={styles.img} />
          <LinearGradient colors={['rgba(0,0,0,0.3)', 'transparent']} style={styles.imgTop} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.imgActions}>
            <TouchableOpacity style={styles.imgActionBtn} onPress={() => toggleLike(post.id)}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? COLORS.pink : '#fff'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.imgActionBtn} onPress={() => toggleSave(post.id)}>
              <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={saved ? COLORS.gold : '#fff'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Occasion + price */}
          <View style={styles.topRow}>
            <View style={styles.occasionBadge}>
              <Text>{post.occasionIcon}</Text>
              <Text style={styles.occasionText}>{post.occasion}</Text>
            </View>
            <Text style={styles.price}>{post.price.toLocaleString()} ₸</Text>
          </View>

          <Text style={styles.title}>{post.description}</Text>

          {/* Author */}
          <TouchableOpacity
            style={styles.authorRow}
            onPress={() => router.push({ pathname: '/chef', params: { name: post.author } })}
          >
            <View style={styles.authorAvatar}>
              <Text style={styles.authorInitial}>{post.author.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.authorName}>{post.author}</Text>
              <Text style={styles.authorRating}>⭐ {post.authorRating} · Кондитер</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { icon: 'heart', val: post.likes, color: COLORS.pink },
              { icon: 'repeat', val: post.repeats, color: COLORS.gold },
              { icon: 'bookmark', val: post.saves, color: '#7c3aed' },
            ].map((s, i) => (
              <View key={i} style={styles.statItem}>
                <Ionicons name={s.icon as any} size={16} color={s.color} />
                <Text style={styles.statVal}>{s.val}</Text>
              </View>
            ))}
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {post.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>О заказе</Text>
            {[
              ['Вес', '2 кг'],
              ['Порций', 'до 12 человек'],
              ['Срок изготовления', '2–3 дня'],
              ['Доставка', 'от 990 ₸'],
            ].map(([k, v]) => (
              <View key={k} style={styles.detailRow}>
                <Text style={styles.detailKey}>{k}</Text>
                <Text style={styles.detailVal}>{v}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.btnRepeat}
          onPress={() => router.push('/(tabs)/build')}
        >
          <Ionicons name="color-wand-outline" size={16} color={COLORS.chocolate} />
          <Text style={styles.btnRepeatText}>Повторить</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnOrder, ordered && styles.btnOrdered]}
          onPress={handleOrder}
        >
          <Ionicons name={ordered ? 'checkmark' : 'bag-outline'} size={16} color="#fff" />
          <Text style={styles.btnOrderText}>{ordered ? 'Добавлено!' : 'Заказать'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  imgWrap: { position: 'relative', height: 320 },
  img: { width: W, height: 320 },
  imgTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 100 },
  backBtn: {
    position: 'absolute', top: 16, left: 16,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center',
  },
  imgActions: {
    position: 'absolute', top: 16, right: 16, gap: 8,
  },
  imgActionBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: SPACING.md, gap: SPACING.md },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  occasionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.cream, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: COLORS.border,
  },
  occasionText: { fontSize: 12, fontWeight: '600', color: COLORS.chocolate },
  price: { fontFamily: FONTS.serif, fontSize: 22, fontWeight: '700', color: COLORS.pink },
  title: { fontFamily: FONTS.serif, fontSize: 22, fontWeight: '700', color: COLORS.chocolate, lineHeight: 28 },
  authorRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  authorAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.pink, alignItems: 'center', justifyContent: 'center',
  },
  authorInitial: { fontSize: 16, fontWeight: '700', color: '#fff' },
  authorName: { fontSize: 14, fontWeight: '700', color: COLORS.chocolate },
  authorRating: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  statsRow: {
    flexDirection: 'row', gap: 20,
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statVal: { fontSize: 14, fontWeight: '600', color: COLORS.chocolate },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: COLORS.cream, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.border,
  },
  tagText: { fontSize: 12, color: COLORS.muted, fontWeight: '500' },
  detailsCard: {
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, gap: 12,
  },
  detailsTitle: { fontSize: 14, fontWeight: '700', color: COLORS.chocolate, marginBottom: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailKey: { fontSize: 13, color: COLORS.muted },
  detailVal: { fontSize: 13, fontWeight: '600', color: COLORS.chocolate },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 10,
    padding: SPACING.md, paddingBottom: 32,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  btnRepeat: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: RADIUS.full,
    backgroundColor: COLORS.cream, borderWidth: 1.5, borderColor: COLORS.border,
  },
  btnRepeatText: { fontSize: 14, fontWeight: '600', color: COLORS.chocolate },
  btnOrder: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: RADIUS.full, backgroundColor: COLORS.chocolate,
  },
  btnOrdered: { backgroundColor: '#059669' },
  btnOrderText: { fontSize: 14, fontWeight: '700', color: '#fff' },
})
