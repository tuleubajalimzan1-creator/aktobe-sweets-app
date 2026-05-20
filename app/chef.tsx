import React from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, SafeAreaView,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { useApp } from '@/context/AppContext'
import { FEED_POSTS } from '@/constants/mockData'

export default function ChefScreen() {
  const router = useRouter()
  const { name } = useLocalSearchParams<{ name: string }>()
  const { isFollowed, toggleFollow } = useApp()

  const chefName = name ?? 'Айгуль'
  const followed = isFollowed(chefName)
  const works = FEED_POSTS.filter(p => p.author.startsWith(chefName.slice(0, 3)))

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <LinearGradient colors={[COLORS.chocolate, '#5c3518']} style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{chefName.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{chefName}</Text>
          <Text style={styles.sub}>Кондитер · Актобе</Text>

          <View style={styles.statsRow}>
            {[
              { label: 'Работ', val: '84' },
              { label: 'Заказов', val: '312' },
              { label: 'Рейтинг', val: '4.9 ★' },
            ].map(s => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statVal}>{s.val}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.followBtn, followed && styles.followBtnActive]}
            onPress={() => toggleFollow(chefName)}
          >
            <Ionicons name={followed ? 'checkmark' : 'add'} size={16} color={followed ? '#fff' : COLORS.chocolate} />
            <Text style={[styles.followBtnText, followed && styles.followBtnTextActive]}>
              {followed ? 'Вы подписаны' : 'Подписаться'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.orderBtn}
            onPress={() => router.push({ pathname: '/product', params: { id: FEED_POSTS[0].id } })}
          >
            <Text style={styles.orderBtnText}>Заказать</Text>
          </TouchableOpacity>
        </View>

        {/* Bio */}
        <View style={styles.bio}>
          <Text style={styles.bioText}>
            Специализируюсь на свадебных и праздничных тортах. Использую только натуральные ингредиенты. Работаю на заказ от 3 дней.
          </Text>
        </View>

        {/* Works */}
        <View style={styles.worksSection}>
          <Text style={styles.worksTitle}>Работы</Text>
          {FEED_POSTS.slice(0, 4).map(post => (
            <TouchableOpacity
              key={post.id}
              style={[styles.workCard, SHADOWS.sm]}
              onPress={() => router.push({ pathname: '/product', params: { id: post.id } })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: post.image }} style={styles.workImg} />
              <View style={styles.workBody}>
                <Text style={styles.workTitle} numberOfLines={2}>{post.description}</Text>
                <Text style={styles.workPrice}>{post.price.toLocaleString()} ₸</Text>
                <View style={styles.workStats}>
                  <Ionicons name="heart" size={12} color={COLORS.pink} />
                  <Text style={styles.workStat}>{post.likes}</Text>
                  <Ionicons name="repeat" size={12} color={COLORS.gold} style={{ marginLeft: 8 }} />
                  <Text style={styles.workStat}>{post.repeats}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    paddingTop: SPACING.lg, paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.md, alignItems: 'center', gap: 6,
  },
  backBtn: {
    position: 'absolute', top: SPACING.lg, left: SPACING.md,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.pink, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)', marginBottom: 4,
  },
  avatarText: { fontFamily: FONTS.serif, fontSize: 32, fontWeight: '700', color: '#fff' },
  name: { fontFamily: FONTS.serif, fontSize: 22, fontWeight: '700', color: '#fff' },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  statsRow: {
    flexDirection: 'row', marginTop: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: RADIUS.lg,
    paddingVertical: 14, paddingHorizontal: 24, gap: 24,
  },
  statItem: { alignItems: 'center', gap: 2 },
  statVal: { fontSize: 18, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)' },
  actions: {
    flexDirection: 'row', gap: 10, padding: SPACING.md,
  },
  followBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 13, borderRadius: RADIUS.full,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.border,
  },
  followBtnActive: { backgroundColor: COLORS.chocolate, borderColor: COLORS.chocolate },
  followBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.chocolate },
  followBtnTextActive: { color: '#fff' },
  orderBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 13, borderRadius: RADIUS.full, backgroundColor: COLORS.pink,
  },
  orderBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  bio: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  bioText: { fontSize: 14, color: COLORS.muted, lineHeight: 21 },
  worksSection: { paddingHorizontal: SPACING.md, gap: 10 },
  worksTitle: { fontFamily: FONTS.serif, fontSize: 20, fontWeight: '700', color: COLORS.chocolate, marginBottom: 4 },
  workCard: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: RADIUS.lg,
    overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border,
  },
  workImg: { width: 90, height: 90 },
  workBody: { flex: 1, padding: 12, gap: 4, justifyContent: 'center' },
  workTitle: { fontSize: 13, fontWeight: '600', color: COLORS.chocolate, lineHeight: 18 },
  workPrice: { fontSize: 14, fontWeight: '700', color: COLORS.pink },
  workStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  workStat: { fontSize: 11, color: COLORS.muted, fontWeight: '500' },
})
