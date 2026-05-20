import React, { useState } from 'react'
import {
  View, Text, StyleSheet, TextInput, FlatList,
  TouchableOpacity, SafeAreaView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SPACING } from '@/constants/theme'
import { FEED_POSTS } from '@/constants/mockData'

const SUGGESTIONS = ['Медовик', 'Бенто-торт', 'Свадебный', 'Шоколадный', 'Чизкейк', 'Наполеон', 'Тирамису']
const POPULAR_TAGS = ['#ягодный', '#минимализм', '#розовый', '#бенто', '#свадьба', '#шоколад']

export default function SearchScreen() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const results = query.length > 1
    ? FEED_POSTS.filter(p =>
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : []

  return (
    <SafeAreaView style={styles.container}>
      {/* Search bar */}
      <View style={styles.header}>
        <View style={styles.inputWrap}>
          <Ionicons name="search-outline" size={18} color={COLORS.muted} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Десерты, кондитеры, теги..."
            placeholderTextColor={COLORS.muted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.muted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Отмена</Text>
        </TouchableOpacity>
      </View>

      {query.length === 0 ? (
        <View style={styles.suggestions}>
          <Text style={styles.sectionTitle}>Популярные запросы</Text>
          <View style={styles.chips}>
            {SUGGESTIONS.map(s => (
              <TouchableOpacity key={s} style={styles.chip} onPress={() => setQuery(s)}>
                <Ionicons name="trending-up-outline" size={13} color={COLORS.gold} />
                <Text style={styles.chipText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>Теги</Text>
          <View style={styles.chips}>
            {POPULAR_TAGS.map(t => (
              <TouchableOpacity key={t} style={[styles.chip, styles.tagChip]} onPress={() => setQuery(t.replace('#', ''))}>
                <Text style={styles.tagChipText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Ничего не найдено</Text>
          <Text style={styles.emptyText}>Попробуй другой запрос или тег</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={p => p.id}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => router.push({ pathname: '/product', params: { id: item.id } })}
              activeOpacity={0.8}
            >
              <View style={styles.resultAvatar}>
                <Text style={styles.resultAvatarText}>{item.occasionIcon}</Text>
              </View>
              <View style={styles.resultBody}>
                <Text style={styles.resultTitle} numberOfLines={1}>{item.description}</Text>
                <Text style={styles.resultSub}>{item.author} · {item.price.toLocaleString()} ₸</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.border} />
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
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md, height: 44,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  searchIcon: { flexShrink: 0 },
  input: { flex: 1, fontSize: 14, color: COLORS.chocolate, fontWeight: '400' },
  cancelBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  cancelText: { fontSize: 14, color: COLORS.pink, fontWeight: '600' },
  suggestions: { padding: SPACING.md },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: COLORS.muted,
    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: SPACING.sm,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff', borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  chipText: { fontSize: 13, fontWeight: '500', color: COLORS.chocolate },
  tagChip: { backgroundColor: COLORS.cream, borderColor: COLORS.border },
  tagChipText: { fontSize: 13, fontWeight: '500', color: COLORS.muted },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontFamily: FONTS.serif, fontSize: 20, fontWeight: '700', color: COLORS.chocolate },
  emptyText: { fontSize: 14, color: COLORS.muted },
  resultsList: { padding: SPACING.md, gap: 2 },
  resultItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: RADIUS.md,
    padding: SPACING.md, marginBottom: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  resultAvatar: {
    width: 40, height: 40, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center',
  },
  resultAvatarText: { fontSize: 20 },
  resultBody: { flex: 1 },
  resultTitle: { fontSize: 14, fontWeight: '600', color: COLORS.chocolate },
  resultSub: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
})
