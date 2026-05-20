import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { useUser, Gender } from '@/context/UserContext'

function Field({
  label, value, onChangeText, placeholder, keyboardType, autoCapitalize,
}: {
  label: string; value: string; onChangeText: (v: string) => void
  placeholder?: string
  keyboardType?: 'default' | 'phone-pad' | 'email-address'
  autoCapitalize?: 'none' | 'sentences' | 'words'
}) {
  const [focused, setFocused] = useState(false)
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, focused && styles.fieldInputFocused]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? ''}
        placeholderTextColor={COLORS.muted}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  )
}

export default function ProfileEditScreen() {
  const router  = useRouter()
  const insets  = useSafeAreaInsets()
  const { profile, updateProfile } = useUser()

  const [fullName,   setFullName]   = useState(profile?.fullName  ?? '')
  const [email,      setEmail]      = useState(profile?.email     ?? '')
  const [birthDate,  setBirthDate]  = useState(profile?.birthDate ?? '')
  const [gender,     setGender]     = useState<Gender>(profile?.gender ?? null)

  const initial = profile?.fullName.trim().charAt(0).toUpperCase() ?? '?'

  const handleSave = () => {
    if (!fullName.trim()) { Alert.alert('Введите имя'); return }
    updateProfile({ fullName: fullName.trim(), email: email.trim(), birthDate: birthDate.trim(), gender })
    Alert.alert('Готово', 'Данные обновлены', [{ text: 'OK', onPress: () => router.back() }])
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={19} color={COLORS.chocolate} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Личные данные</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveLink}>Сохранить</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <LinearGradient colors={[COLORS.pink, COLORS.gold]} style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </LinearGradient>
            <TouchableOpacity style={styles.changeAvatarBtn}>
              <Text style={styles.changeAvatarText}>Изменить фото</Text>
            </TouchableOpacity>
          </View>

          {/* Phone (read-only) */}
          <View style={styles.phoneRow}>
            <Ionicons name="call-outline" size={16} color={COLORS.muted} />
            <Text style={styles.phoneText}>
              {profile?.phone
                ? `+7 ${profile.phone.slice(0,3)} ${profile.phone.slice(3,6)}-${profile.phone.slice(6,8)}-${profile.phone.slice(8)}`
                : 'Телефон не указан'}
            </Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={13} color={COLORS.greenText} />
              <Text style={styles.verifiedText}>Подтверждён</Text>
            </View>
          </View>

          {/* Fields */}
          <View style={styles.fieldsCard}>
            <Field label="Имя и фамилия" value={fullName} onChangeText={setFullName} placeholder="Алима Сейткали" autoCapitalize="words" />
            <View style={styles.divider} />
            <Field label="Email" value={email} onChangeText={setEmail} placeholder="email@example.com" keyboardType="email-address" autoCapitalize="none" />
            <View style={styles.divider} />
            <Field label="Дата рождения" value={birthDate} onChangeText={setBirthDate} placeholder="ДД.ММ.ГГГГ" />
          </View>

          {/* Gender */}
          <Text style={styles.sectionLabel}>Пол</Text>
          <View style={styles.genderRow}>
            {([['male', 'Мужской'], ['female', 'Женский'], [null, 'Не указано']] as [Gender, string][]).map(([val, lbl]) => (
              <TouchableOpacity
                key={String(val)}
                style={[styles.genderChip, gender === val && styles.genderChipActive]}
                onPress={() => setGender(val)}
              >
                <Text style={[styles.genderChipText, gender === val && styles.genderChipTextActive]}>{lbl}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Save button */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>Сохранить изменения</Text>
          </TouchableOpacity>

          {/* Delete account */}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => Alert.alert('Удалить аккаунт?', 'Это действие нельзя отменить', [
              { text: 'Отмена', style: 'cancel' },
              { text: 'Удалить', style: 'destructive', onPress: () => {} },
            ])}
          >
            <Text style={styles.deleteText}>Удалить аккаунт</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.cream },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.borderSolid, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: '#fff' },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  headerTitle: { fontFamily: FONTS.serif, fontSize: 18, fontWeight: '700', color: COLORS.chocolate },
  saveLink: { fontSize: 14, fontWeight: '700', color: COLORS.chocolate },
  content: { padding: SPACING.md, gap: SPACING.md },

  avatarSection: { alignItems: 'center', gap: 10, paddingVertical: SPACING.md },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: FONTS.serif, fontSize: 32, fontWeight: '700', color: '#fff' },
  changeAvatarBtn: {},
  changeAvatarText: { fontSize: 13, fontWeight: '600', color: COLORS.chocolate },

  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  phoneText: { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.chocolate },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { fontSize: 11, color: COLORS.greenText, fontWeight: '600' },

  fieldsCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  fieldWrap: { paddingHorizontal: SPACING.md, paddingVertical: 12 },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 },
  fieldInput: { fontSize: 15, color: COLORS.chocolate, backgroundColor: COLORS.cream, borderRadius: RADIUS.sm, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border },
  fieldInputFocused: { borderColor: COLORS.chocolate, backgroundColor: '#fdf5ee' },
  divider: { height: 1, backgroundColor: COLORS.border },

  sectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5 },
  genderRow: { flexDirection: 'row', gap: 8 },
  genderChip: { flex: 1, paddingVertical: 11, borderRadius: RADIUS.full, backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center' },
  genderChipActive: { backgroundColor: COLORS.chocolate, borderColor: COLORS.chocolate },
  genderChipText: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  genderChipTextActive: { color: '#fff' },

  saveBtn: { backgroundColor: COLORS.chocolate, borderRadius: RADIUS.full, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  deleteBtn: { alignItems: 'center', paddingVertical: 12 },
  deleteText: { fontSize: 13, color: '#dc2626', fontWeight: '500' },
})
