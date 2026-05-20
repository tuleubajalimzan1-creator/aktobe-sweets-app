import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Modal, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { useUser, Address } from '@/context/UserContext'

const LABEL_ICONS: Record<string, string> = { home: 'home-outline', work: 'business-outline', other: 'location-outline' }
const LABEL_NAMES: Record<string, string> = { home: 'Дом', work: 'Работа', other: 'Другое' }

const EMPTY_FORM = { label: 'home' as Address['label'], city: 'Актобе', street: '', house: '', apartment: '', entrance: '', floor: '', comment: '' }

function AddressForm({ initial, onSave, onClose }: {
  initial?: Partial<typeof EMPTY_FORM>
  onSave: (data: typeof EMPTY_FORM) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial })
  const set = (k: keyof typeof EMPTY_FORM) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = () => {
    if (!form.street.trim()) { Alert.alert('Введите улицу'); return }
    if (!form.house.trim())  { Alert.alert('Введите дом');  return }
    onSave(form)
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={styles.formHandle} />
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>Адрес доставки</Text>
        <TouchableOpacity onPress={onClose} style={styles.formClose}>
          <Ionicons name="close" size={19} color={COLORS.chocolate} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Label chips */}
        <Text style={styles.formSectionLabel}>Название</Text>
        <View style={styles.labelChips}>
          {(['home', 'work', 'other'] as Address['label'][]).map(l => (
            <TouchableOpacity
              key={l}
              style={[styles.labelChip, form.label === l && styles.labelChipActive]}
              onPress={() => setForm(p => ({ ...p, label: l }))}
            >
              <Ionicons name={LABEL_ICONS[l] as any} size={14} color={form.label === l ? '#fff' : COLORS.muted} />
              <Text style={[styles.labelChipText, form.label === l && styles.labelChipTextActive]}>{LABEL_NAMES[l]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {[
          { label: 'Город',    key: 'city' as const,      placeholder: 'Актобе' },
          { label: 'Улица',    key: 'street' as const,    placeholder: 'ул. Абая' },
          { label: 'Дом',      key: 'house' as const,     placeholder: '15' },
          { label: 'Квартира', key: 'apartment' as const, placeholder: '3 (необязательно)' },
          { label: 'Подъезд',  key: 'entrance' as const,  placeholder: '2 (необязательно)' },
          { label: 'Этаж',     key: 'floor' as const,     placeholder: '5 (необязательно)' },
          { label: 'Комментарий курьеру', key: 'comment' as const, placeholder: 'Напр.: позвоните на 5 минут' },
        ].map(({ label, key, placeholder }) => (
          <View key={key} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
              style={styles.input}
              value={form[key]}
              onChangeText={set(key)}
              placeholder={placeholder}
              placeholderTextColor={COLORS.muted}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Сохранить адрес</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default function AddressesScreen() {
  const router  = useRouter()
  const insets  = useSafeAreaInsets()
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useUser()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<string | null>(null)

  const editingAddr = addresses.find(a => a.id === editing)

  const handleSave = (form: typeof EMPTY_FORM) => {
    if (editing) {
      updateAddress(editing, { ...form, isDefault: editingAddr?.isDefault ?? false })
    } else {
      addAddress({ ...form, isDefault: addresses.length === 0 })
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = (id: string) => {
    Alert.alert('Удалить адрес?', '', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: () => deleteAddress(id) },
    ])
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.handle} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={19} color={COLORS.chocolate} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Адреса доставки</Text>
        <TouchableOpacity onPress={() => { setEditing(null); setShowForm(true) }}>
          <Ionicons name="add" size={24} color={COLORS.chocolate} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        {addresses.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📍</Text>
            <Text style={styles.emptyTitle}>Нет адресов</Text>
            <Text style={styles.emptyText}>Добавьте адрес для быстрого оформления заказов</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setShowForm(true)}>
              <Text style={styles.emptyBtnText}>Добавить адрес</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {addresses.map(addr => (
              <View key={addr.id} style={[styles.addrCard, SHADOWS.sm, addr.isDefault && styles.addrCardDefault]}>
                <View style={styles.addrTop}>
                  <View style={[styles.addrIcon, addr.isDefault && styles.addrIconDefault]}>
                    <Ionicons name={LABEL_ICONS[addr.label] as any} size={18} color={addr.isDefault ? '#fff' : COLORS.chocolate} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.addrLabel}>{LABEL_NAMES[addr.label]}</Text>
                    <Text style={styles.addrText}>{addr.street}, {addr.house}{addr.apartment ? `, кв. ${addr.apartment}` : ''}</Text>
                    <Text style={styles.addrCity}>{addr.city}</Text>
                  </View>
                  {addr.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Основной</Text>
                    </View>
                  )}
                </View>
                <View style={styles.addrActions}>
                  {!addr.isDefault && (
                    <TouchableOpacity style={styles.addrActionBtn} onPress={() => setDefaultAddress(addr.id)}>
                      <Text style={styles.addrActionText}>Сделать основным</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.addrActionBtn} onPress={() => { setEditing(addr.id); setShowForm(true) }}>
                    <Ionicons name="pencil-outline" size={14} color={COLORS.muted} />
                    <Text style={styles.addrActionText}>Изменить</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(addr.id)}>
                    <Ionicons name="trash-outline" size={18} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.addBtn} onPress={() => { setEditing(null); setShowForm(true) }} activeOpacity={0.85}>
              <Ionicons name="add-circle-outline" size={18} color={COLORS.chocolate} />
              <Text style={styles.addBtnText}>Добавить новый адрес</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => { setShowForm(false); setEditing(null) }}>
        <AddressForm
          initial={editing && editingAddr ? { label: editingAddr.label, city: editingAddr.city, street: editingAddr.street, house: editingAddr.house, apartment: editingAddr.apartment ?? '', entrance: editingAddr.entrance ?? '', floor: editingAddr.floor ?? '', comment: editingAddr.comment ?? '' } : undefined}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
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
  content: { padding: SPACING.md },

  empty: { flex: 1, alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontFamily: FONTS.serif, fontSize: 20, fontWeight: '700', color: COLORS.chocolate },
  emptyText: { fontSize: 14, color: COLORS.muted, textAlign: 'center' },
  emptyBtn: { backgroundColor: COLORS.chocolate, borderRadius: RADIUS.full, paddingHorizontal: 28, paddingVertical: 13 },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  list: { gap: 12 },
  addrCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  addrCardDefault: { borderColor: COLORS.gold, borderWidth: 2 },
  addrTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 12 },
  addrIcon: { width: 38, height: 38, borderRadius: RADIUS.sm, backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center' },
  addrIconDefault: { backgroundColor: COLORS.chocolate },
  addrLabel: { fontSize: 12, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  addrText: { fontSize: 14, fontWeight: '600', color: COLORS.chocolate },
  addrCity: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  defaultBadge: { backgroundColor: '#fef3c7', borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: COLORS.gold },
  defaultBadgeText: { fontSize: 11, fontWeight: '700', color: '#92400e' },
  addrActions: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 },
  addrActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addrActionText: { fontSize: 12, color: COLORS.muted, fontWeight: '500' },

  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#fff', borderStyle: 'dashed' },
  addBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.chocolate },

  /* Form */
  formHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.borderSolid, alignSelf: 'center', marginTop: 12 },
  formHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  formTitle: { fontFamily: FONTS.serif, fontSize: 18, fontWeight: '700', color: COLORS.chocolate },
  formClose: { width: 32, height: 32, borderRadius: RADIUS.full, backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center' },
  formContent: { padding: SPACING.md, gap: 14, paddingBottom: 40 },
  formSectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5 },
  labelChips: { flexDirection: 'row', gap: 8 },
  labelChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#fff' },
  labelChipActive: { backgroundColor: COLORS.chocolate, borderColor: COLORS.chocolate },
  labelChipText: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  labelChipTextActive: { color: '#fff' },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.2 },
  input: { fontSize: 15, color: COLORS.chocolate, backgroundColor: '#fff', borderRadius: RADIUS.lg, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1.5, borderColor: COLORS.border },
  saveBtn: { backgroundColor: COLORS.chocolate, borderRadius: RADIUS.full, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
})
