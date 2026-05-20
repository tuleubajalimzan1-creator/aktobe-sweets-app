import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '@/constants/theme'

const NOTIFS = [
  { id: '1', type: 'like',   icon: 'heart',          color: COLORS.pink,  bg: '#fce8ed', text: 'Айгуль лайкнула ваш торт «Медовик»',        time: '2 мин назад' },
  { id: '2', type: 'save',   icon: 'bookmark',       color: COLORS.gold,  bg: '#fef9c3', text: 'Гульнур сохранила вашу публикацию',          time: '15 мин назад' },
  { id: '3', type: 'order',  icon: 'bag',            color: '#7c3aed',    bg: '#ede9fe', text: 'Новый заказ: Свадебный торт 3 кг на 12 июня', time: '1 час назад' },
  { id: '4', type: 'reply',  icon: 'chatbubble',     color: COLORS.green, bg: '#dcfce7', text: 'Кондитер Самал ответила на ваш вопрос',      time: '3 часа назад' },
  { id: '5', type: 'system', icon: 'notifications',  color: COLORS.muted, bg: '#f1f5f9', text: 'Ваш заказ №1284 готов к доставке!',          time: 'Вчера' },
  { id: '6', type: 'like',   icon: 'heart',          color: COLORS.pink,  bg: '#fce8ed', text: 'Бота и ещё 12 человек лайкнули ваш торт',    time: 'Вчера' },
]

export default function NotificationsScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Уведомления</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color={COLORS.chocolate} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={NOTIFS}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.item, SHADOWS.sm]} activeOpacity={0.8}>
            <View style={[styles.iconWrap, { backgroundColor: item.bg }]}>
              <Ionicons name={item.icon as any} size={18} color={item.color} />
            </View>
            <View style={styles.itemBody}>
              <Text style={styles.itemText}>{item.text}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
            <View style={styles.unreadDot} />
          </TouchableOpacity>
        )}
      />
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
  list: { padding: SPACING.md, gap: 10 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  iconWrap: {
    width: 42, height: 42, borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  itemBody: { flex: 1, gap: 3 },
  itemText: { fontSize: 13, color: COLORS.chocolate, fontWeight: '500', lineHeight: 18 },
  itemTime: { fontSize: 11, color: COLORS.muted },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.pink, flexShrink: 0,
  },
})
