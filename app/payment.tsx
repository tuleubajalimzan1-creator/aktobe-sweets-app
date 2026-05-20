import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Modal,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { useUser, PaymentMethod } from '@/context/UserContext'

type MethodType = PaymentMethod['type']

const METHOD_META: Record<MethodType, { icon: string; color: string; bg: string; desc: string }> = {
  kaspi_pay: { icon: 'phone-portrait-outline', color: '#dc2626', bg: '#fef2f2', desc: 'Kaspi Pay' },
  kaspi_qr:  { icon: 'qr-code-outline',        color: '#dc2626', bg: '#fef2f2', desc: 'QR-код Kaspi' },
  visa:      { icon: 'card-outline',            color: '#1a56db', bg: '#eff6ff', desc: 'Visa' },
  mastercard:{ icon: 'card-outline',            color: '#f59e0b', bg: '#fffbeb', desc: 'Mastercard' },
  cash:      { icon: 'cash-outline',            color: '#059669', bg: '#ecfdf5', desc: 'Наличные' },
}

const AVAILABLE_METHODS: { type: MethodType; title: string }[] = [
  { type: 'kaspi_pay',  title: 'Kaspi Pay' },
  { type: 'kaspi_qr',  title: 'Kaspi QR' },
  { type: 'visa',      title: 'Visa' },
  { type: 'mastercard',title: 'Mastercard' },
  { type: 'cash',      title: 'Наличные при получении' },
]

export default function PaymentScreen() {
  const router  = useRouter()
  const insets  = useSafeAreaInsets()
  const { paymentMethods, addPaymentMethod, deletePaymentMethod, setDefaultPayment } = useUser()
  const [showPicker, setShowPicker] = useState(false)

  const handleAdd = (type: MethodType, title: string) => {
    const alreadyAdded = paymentMethods.some(m => m.type === type)
    if (alreadyAdded) {
      Alert.alert('Уже добавлено', 'Этот способ оплаты уже в вашем списке')
      return
    }
    addPaymentMethod({ type, title, isDefault: paymentMethods.length === 0 })
    setShowPicker(false)
  }

  const handleDelete = (m: PaymentMethod) => {
    if (m.isDefault && paymentMethods.length > 1) {
      Alert.alert('Нельзя удалить', 'Сначала выберите другой способ оплаты по умолчанию')
      return
    }
    Alert.alert('Удалить способ оплаты?', m.title, [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: () => deletePaymentMethod(m.id) },
    ])
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.handle} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={19} color={COLORS.chocolate} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Способы оплаты</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Ionicons name="add" size={24} color={COLORS.chocolate} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {paymentMethods.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💳</Text>
            <Text style={styles.emptyTitle}>Нет способов оплаты</Text>
            <Text style={styles.emptyText}>Добавьте удобный способ для быстрой оплаты</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setShowPicker(true)}>
              <Text style={styles.emptyBtnText}>Добавить способ</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {paymentMethods.map(m => {
              const meta = METHOD_META[m.type]
              return (
                <View key={m.id} style={[styles.card, SHADOWS.sm, m.isDefault && styles.cardDefault]}>
                  <View style={styles.cardTop}>
                    <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
                      <Ionicons name={meta.icon as any} size={22} color={meta.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{m.title}</Text>
                      {m.maskedDetails && <Text style={styles.cardSub}>{m.maskedDetails}</Text>}
                    </View>
                    {m.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Основной</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.cardActions}>
                    {!m.isDefault && (
                      <TouchableOpacity style={styles.actionBtn} onPress={() => setDefaultPayment(m.id)}>
                        <Text style={styles.actionText}>Сделать основным</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => handleDelete(m)}>
                      <Ionicons name="trash-outline" size={18} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })}
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowPicker(true)} activeOpacity={0.85}>
              <Ionicons name="add-circle-outline" size={18} color={COLORS.chocolate} />
              <Text style={styles.addBtnText}>Добавить способ оплаты</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.greenText} />
          <Text style={styles.infoText}>Все платёжные данные защищены шифрованием</Text>
        </View>
      </ScrollView>

      {/* Method picker modal */}
      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowPicker(false)} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Выберите способ оплаты</Text>
          {AVAILABLE_METHODS.map(({ type, title }) => {
            const meta   = METHOD_META[type]
            const added  = paymentMethods.some(m => m.type === type)
            return (
              <TouchableOpacity
                key={type}
                style={[styles.sheetRow, added && styles.sheetRowAdded]}
                onPress={() => handleAdd(type, title)}
                disabled={added}
                activeOpacity={0.75}
              >
                <View style={[styles.sheetIcon, { backgroundColor: meta.bg }]}>
                  <Ionicons name={meta.icon as any} size={20} color={meta.color} />
                </View>
                <Text style={[styles.sheetLabel, added && { color: COLORS.muted }]}>{title}</Text>
                {added && <Ionicons name="checkmark-circle" size={18} color={COLORS.muted} />}
              </TouchableOpacity>
            )
          })}
        </View>
      </Modal>
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
  emptyBtn: { backgroundColor: COLORS.chocolate, borderRadius: RADIUS.full, paddingHorizontal: 28, paddingVertical: 13 },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  list: { gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  cardDefault: { borderColor: COLORS.gold, borderWidth: 2 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  iconWrap: { width: 44, height: 44, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: COLORS.chocolate },
  cardSub: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  defaultBadge: { backgroundColor: '#fef3c7', borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: COLORS.gold },
  defaultBadgeText: { fontSize: 11, fontWeight: '700', color: '#92400e' },
  cardActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 12, color: COLORS.muted, fontWeight: '500' },

  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#fff', borderStyle: 'dashed' },
  addBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.chocolate },

  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f0fdf4', borderRadius: RADIUS.lg, padding: 14, borderWidth: 1, borderColor: '#bbf7d0' },
  infoText: { flex: 1, fontSize: 12, color: COLORS.greenText, fontWeight: '500' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.md, gap: 4 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.borderSolid, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontFamily: FONTS.serif, fontSize: 17, fontWeight: '700', color: COLORS.chocolate, marginBottom: 8 },
  sheetRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderRadius: RADIUS.lg, paddingHorizontal: 4 },
  sheetRowAdded: { opacity: 0.5 },
  sheetIcon: { width: 40, height: 40, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  sheetLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: COLORS.chocolate },
})
