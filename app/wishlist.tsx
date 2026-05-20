import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '@/constants/theme'
import { useApp } from '@/context/AppContext'
import { FEED_POSTS } from '@/constants/mockData'

export default function WishlistScreen() {
  const router = useRouter()
  const { savedPosts, toggleSave } = useApp()

  const saved = FEED_POSTS.filter(p => savedPosts.has(p.id))

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Избранное</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color={COLORS.chocolate} />
        </TouchableOpacity>
      </View>

      {saved.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔖</Text>
          <Text style={styles.emptyTitle}>Пока ничего нет</Text>
          <Text style={styles.emptyText}>Сохраняй понравившиеся десерты — они появятся здесь</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => { router.back(); }}>
            <Text style={styles.emptyBtnText}>Открыть ленту</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={p => p.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, SHADOWS.sm]}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/product', params: { id: item.id } })}
            >
              <Image source={{ uri: item.image }} style={styles.img} />
              <TouchableOpacity
                style={styles.unsaveBtn}
                onPress={() => toggleSave(item.id)}
              >
                <Ionicons name="bookmark" size={16} color={COLORS.gold} />
              </TouchableOpacity>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.cardPrice}>{item.price.toLocaleString()} ₸</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  title: { fontFamily: FONTS.serif, fontSize: 24, fontWeight: '700', color: COLORS.chocolate },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: SPACING.lg },
  emptyIcon: { fontSize: 56 },
  emptyTitle: { fontFamily: FONTS.serif, fontSize: 22, fontWeight: '700', color: COLORS.chocolate },
  emptyText: { fontSize: 14, color: COLORS.muted, textAlign: 'center' },
  emptyBtn: {
    marginTop: 8, paddingVertical: 14, paddingHorizontal: 32,
    borderRadius: RADIUS.full, backgroundColor: COLORS.chocolate,
  },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.cream },
  list: { padding: SPACING.md, paddingBottom: 40 },
  row: { gap: 10, marginBottom: 10 },
  card: {
    flex: 1, backgroundColor: '#fff', borderRadius: RADIUS.lg,
    overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border,
  },
  img: { width: '100%', height: 130 },
  unsaveBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center',
  },
  cardBody: { padding: 10, gap: 4 },
  cardTitle: { fontSize: 12, fontWeight: '600', color: COLORS.chocolate, lineHeight: 16 },
  cardPrice: { fontSize: 13, fontWeight: '700', color: COLORS.pink },
})
