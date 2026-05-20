import React from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { useUser, Review } from '@/context/UserContext'

function Stars({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={13}
          color={i <= rating ? COLORS.gold : COLORS.border}
        />
      ))}
    </View>
  )
}

function ReviewCard({ review, onDelete }: { review: Review; onDelete: () => void }) {
  return (
    <View style={[styles.card, SHADOWS.sm]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.chefName}>{review.chefName}</Text>
          <Text style={styles.productName}>{review.productName}</Text>
        </View>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={18} color="#dc2626" />
        </TouchableOpacity>
      </View>
      <View style={styles.ratingRow}>
        <Stars rating={review.rating} />
        <Text style={styles.dateText}>{review.date}</Text>
      </View>
      {review.text ? (
        <Text style={styles.reviewText}>{review.text}</Text>
      ) : null}
    </View>
  )
}

export default function ReviewsScreen() {
  const router  = useRouter()
  const insets  = useSafeAreaInsets()
  const { reviews, deleteReview } = useUser()

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const handleDelete = (id: string) => {
    Alert.alert('Удалить отзыв?', 'Это действие нельзя отменить', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: () => deleteReview(id) },
    ])
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.handle} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={19} color={COLORS.chocolate} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Мои отзывы</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {reviews.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>⭐</Text>
            <Text style={styles.emptyTitle}>Отзывов нет</Text>
            <Text style={styles.emptyText}>После заказа вы сможете оставить отзыв кондитеру</Text>
          </View>
        ) : (
          <>
            {avgRating && (
              <View style={[styles.statsCard, SHADOWS.sm]}>
                <Text style={styles.statsRating}>{avgRating}</Text>
                <Stars rating={Math.round(Number(avgRating))} />
                <Text style={styles.statsLabel}>Средняя оценка · {reviews.length} {reviews.length === 1 ? 'отзыв' : 'отзывов'}</Text>
              </View>
            )}
            <View style={styles.list}>
              {reviews.map(r => (
                <ReviewCard key={r.id} review={r} onDelete={() => handleDelete(r.id)} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.cream },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.borderSolid, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: '#fff' },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  headerTitle: { fontFamily: FONTS.serif, fontSize: 18, fontWeight: '700', color: COLORS.chocolate },
  content: { padding: SPACING.md, gap: SPACING.md },

  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontFamily: FONTS.serif, fontSize: 20, fontWeight: '700', color: COLORS.chocolate },
  emptyText: { fontSize: 14, color: COLORS.muted, textAlign: 'center' },

  statsCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: COLORS.border },
  statsRating: { fontFamily: FONTS.serif, fontSize: 40, fontWeight: '700', color: COLORS.chocolate },
  statsLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2 },

  list: { gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, gap: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  chefName: { fontSize: 15, fontWeight: '700', color: COLORS.chocolate },
  productName: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateText: { fontSize: 11, color: COLORS.muted },
  reviewText: { fontSize: 14, color: COLORS.chocolate, lineHeight: 20 },
})
