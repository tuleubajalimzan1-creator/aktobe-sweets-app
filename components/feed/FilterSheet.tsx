import React, { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  ScrollView, Animated,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'

const SORT_OPTIONS = [
  { id: 'popular',  label: 'Популярные',       icon: 'flame-outline'       },
  { id: 'new',      label: 'Новые',             icon: 'time-outline'        },
  { id: 'liked',    label: 'Больше всего лайков', icon: 'heart-outline'    },
  { id: 'repeated', label: 'Часто повторяют',   icon: 'repeat-outline'      },
  { id: 'price_asc', label: 'Дешевле сначала', icon: 'arrow-up-outline'    },
]

const OCCASION_FILTERS = ['Свадьба', 'День рождения', 'Корпоратив', 'Просто так', 'Бенто', 'Детский']

const TASTE_FILTERS = ['Шоколадный', 'Ягодный', 'Ванильный', 'Карамельный', 'Фруктовый']

interface Props {
  visible: boolean
  onClose: () => void
  activeFilter: string
  onFilterChange: (f: string) => void
}

export default function FilterSheet({ visible, onClose, activeFilter, onFilterChange }: Props) {
  const [sort, setSort] = useState('popular')
  const [occasions, setOccasions] = useState<string[]>([])
  const [tastes, setTastes] = useState<string[]>([])
  const [withDelivery, setWithDelivery] = useState(false)
  const [trending, setTrending] = useState(false)

  const toggleArr = (arr: string[], setArr: (a: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const handleApply = () => {
    if (occasions.length === 1) onFilterChange(occasions[0])
    else onFilterChange('Все')
    onClose()
  }

  const handleReset = () => {
    setSort('popular')
    setOccasions([])
    setTastes([])
    setWithDelivery(false)
    setTrending(false)
    onFilterChange('Все')
  }

  const activeCount = occasions.length + tastes.length + (withDelivery ? 1 : 0) + (trending ? 1 : 0)

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {/* Backdrop */}
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      {/* Sheet */}
      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Фильтры</Text>
          {activeCount > 0 && (
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.resetText}>Сбросить ({activeCount})</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color={COLORS.chocolate} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Sort */}
          <Text style={styles.sectionLabel}>Сортировка</Text>
          <View style={styles.sortList}>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.sortRow, sort === opt.id && styles.sortRowActive]}
                onPress={() => setSort(opt.id)}
              >
                <Ionicons
                  name={opt.icon as any}
                  size={16}
                  color={sort === opt.id ? COLORS.chocolate : COLORS.muted}
                />
                <Text style={[styles.sortLabel, sort === opt.id && styles.sortLabelActive]}>
                  {opt.label}
                </Text>
                {sort === opt.id && (
                  <Ionicons name="checkmark" size={16} color={COLORS.chocolate} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Occasion */}
          <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>Повод</Text>
          <View style={styles.chips}>
            {OCCASION_FILTERS.map(occ => {
              const active = occasions.includes(occ)
              return (
                <TouchableOpacity
                  key={occ}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => toggleArr(occasions, setOccasions, occ)}
                >
                  <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>{occ}</Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Taste */}
          <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>Вкус</Text>
          <View style={styles.chips}>
            {TASTE_FILTERS.map(t => {
              const active = tastes.includes(t)
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => toggleArr(tastes, setTastes, t)}
                >
                  <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>{t}</Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Toggles */}
          <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>Дополнительно</Text>
          <View style={styles.toggleCard}>
            <ToggleRow
              label="Только с доставкой"
              icon="bicycle-outline"
              value={withDelivery}
              onToggle={() => setWithDelivery(v => !v)}
            />
            <View style={styles.divider} />
            <ToggleRow
              label="Тренды недели"
              icon="flame-outline"
              value={trending}
              onToggle={() => setTrending(v => !v)}
            />
          </View>
        </ScrollView>

        {/* Apply button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.85}>
            <Text style={styles.applyTxt}>Применить{activeCount > 0 ? ` (${activeCount})` : ''}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

function ToggleRow({
  label, icon, value, onToggle,
}: { label: string; icon: string; value: boolean; onToggle: () => void }) {
  return (
    <View style={styles.toggleRow}>
      <Ionicons name={icon as any} size={18} color={COLORS.chocolate} />
      <Text style={styles.toggleLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.toggle, value && styles.toggleActive]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(44,24,16,0.38)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: '82%',
    paddingBottom: 34,
    ...SHADOWS.lg,
  },
  handle: {
    width: 36, height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  sheetTitle: {
    flex: 1,
    fontFamily: FONTS.serif,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.chocolate,
  },
  resetText: {
    fontSize: 13,
    color: COLORS.pink,
    fontWeight: '600',
  },
  closeBtn: {
    width: 32, height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cream,
    alignItems: 'center', justifyContent: 'center',
  },
  content: {
    padding: SPACING.md,
    paddingBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  sortList: {
    backgroundColor: COLORS.cream,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sortRowActive: {
    backgroundColor: '#fff',
  },
  sortLabel: { flex: 1, fontSize: 14, color: COLORS.muted, fontWeight: '400' },
  sortLabelActive: { color: COLORS.chocolate, fontWeight: '600' },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cream,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: COLORS.chocolate,
    borderColor: COLORS.chocolate,
  },
  chipTxt: { fontSize: 13, fontWeight: '500', color: COLORS.muted },
  chipTxtActive: { color: '#fff', fontWeight: '700' },
  toggleCard: {
    backgroundColor: COLORS.cream,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,
  },
  toggleLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.chocolate },
  toggle: {
    width: 46, height: 26, borderRadius: 13,
    backgroundColor: COLORS.border, padding: 3, justifyContent: 'center',
  },
  toggleActive: { backgroundColor: COLORS.chocolate },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  toggleThumbActive: { transform: [{ translateX: 20 }] },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.md },
  footer: {
    paddingHorizontal: SPACING.md,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  applyBtn: {
    backgroundColor: COLORS.chocolate,
    borderRadius: RADIUS.full,
    paddingVertical: 15,
    alignItems: 'center',
  },
  applyTxt: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
})
