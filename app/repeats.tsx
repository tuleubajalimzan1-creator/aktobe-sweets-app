import React from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { useUser, Repeat } from '@/context/UserContext'

const STATUS_META: Record<Repeat['status'], { label: string; color: string; bg: string }> = {
  draft:     { label: 'Черновик',  color: '#78350f', bg: '#fef3c7' },
  ordered:   { label: 'Заказан',   color: '#065f46', bg: '#d1fae5' },
  saved:     { label: 'Сохранён',  color: '#1e40af', bg: '#dbeafe' },
  published: { label: 'Опубликован', color: '#581c87', bg: '#f3e8ff' },
}

function RepeatCard({ repeat, onDelete }: { repeat: Repeat; onDelete: () => void }) {
  const router = useRouter()
  const meta   = STATUS_META[repeat.status]

  return (
    <View style={[styles.card, SHADOWS.sm]}>
      <View style={styles.cardTop}>
        <View style={styles.emoji}>
          <Text style={styles.emojiText}>{repeat.previewEmoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>{repeat.title}</Text>
          <Text style={styles.cardDate}>{repeat.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
          <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.openBtn}
          onPress={() => router.push('/build' as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="repeat-outline" size={14} color={COLORS.chocolate} />
          <Text style={styles.openBtnText}>Открыть в конструкторе</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={18} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function RepeatsScreen() {
  const router  = useRouter()
  const insets  = useSafeAreaInsets()
  const { repeats, deleteRepeat } = useUser()

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Удалить повторение?', title, [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: () => deleteRepeat(id) },
    ])
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.handle} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={19} color={COLORS.chocolate} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Мои повторения</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {repeats.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔁</Text>
            <Text style={styles.emptyTitle}>Повторений нет</Text>
            <Text style={styles.emptyText}>
              Когда вы повторите заказ или сохраните конфигурацию в конструкторе, она появится здесь
            </Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/build' as any)}>
              <Text style={styles.emptyBtnText}>Открыть конструктор</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {repeats.map(r => (
              <RepeatCard
                key={r.id}
                repeat={r}
                onDelete={() => handleDelete(r.id, r.title)}
              />
            ))}
          </View>
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
  content: { padding: SPACING.md },

  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontFamily: FONTS.serif, fontSize: 20, fontWeight: '700', color: COLORS.chocolate },
  emptyText: { fontSize: 14, color: COLORS.muted, textAlign: 'center', lineHeight: 20 },
  emptyBtn: { backgroundColor: COLORS.chocolate, borderRadius: RADIUS.full, paddingHorizontal: 28, paddingVertical: 13, marginTop: 4 },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  list: { gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  emoji: { width: 48, height: 48, borderRadius: RADIUS.sm, backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center' },
  emojiText: { fontSize: 26 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: COLORS.chocolate },
  cardDate: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  statusBadge: { borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 },
  openBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  openBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.chocolate },
})
