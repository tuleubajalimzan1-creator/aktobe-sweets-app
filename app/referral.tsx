import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { useUser } from '@/context/UserContext'

const HOW_ITEMS = [
  { step: '1', text: 'Поделитесь своим кодом с другом' },
  { step: '2', text: 'Друг регистрируется и делает первый заказ' },
  { step: '3', text: 'Вы получаете 500 ₸ на баланс' },
]

export default function ReferralScreen() {
  const router  = useRouter()
  const insets  = useSafeAreaInsets()
  const { referralCode, referralCount, referralBonus } = useUser()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Привет! Закажи торт в Aktobe Sweets по моему реферальному коду ${referralCode} и получи скидку на первый заказ 🎂\n\naktobe-sweets.kz`,
        title: 'Aktobe Sweets — приглашение',
      })
    } catch {}
  }

  const handleCopyCode = () => {
    handleCopy()
    Alert.alert('Скопировано', `Код ${referralCode} скопирован`)
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.handle} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={19} color={COLORS.chocolate} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Реферальная программа</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient colors={[COLORS.chocolate, '#5c3518']} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.heroEmoji}>🎁</Text>
          <Text style={styles.heroTitle}>Пригласи друга</Text>
          <Text style={styles.heroSub}>Получайте 500 ₸ за каждого нового пользователя</Text>
        </LinearGradient>

        {/* Stats */}
        <View style={[styles.statsRow, SHADOWS.sm]}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{referralCount}</Text>
            <Text style={styles.statLabel}>Приглашено</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{referralBonus} ₸</Text>
            <Text style={styles.statLabel}>Накоплено</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>500 ₸</Text>
            <Text style={styles.statLabel}>За друга</Text>
          </View>
        </View>

        {/* Code block */}
        <View style={[styles.codeCard, SHADOWS.sm]}>
          <Text style={styles.codeLabel}>Ваш реферальный код</Text>
          <TouchableOpacity style={styles.codeRow} onPress={handleCopyCode} activeOpacity={0.8}>
            <Text style={styles.codeText}>{referralCode}</Text>
            <View style={styles.copyBtn}>
              <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={18} color={copied ? COLORS.greenText : COLORS.chocolate} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Share button */}
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
          <Ionicons name="share-social-outline" size={18} color="#fff" />
          <Text style={styles.shareBtnText}>Поделиться</Text>
        </TouchableOpacity>

        {/* How it works */}
        <Text style={styles.sectionTitle}>Как это работает</Text>
        <View style={[styles.howCard, SHADOWS.sm]}>
          {HOW_ITEMS.map((item, i) => (
            <React.Fragment key={item.step}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.howRow}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNum}>{item.step}</Text>
                </View>
                <Text style={styles.howText}>{item.text}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Terms */}
        <View style={styles.termsBox}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.muted} />
          <Text style={styles.termsText}>
            Бонусы начисляются после того, как приглашённый друг сделает первый заказ на сумму от 2 000 ₸. Срок действия бонусов — 6 месяцев.
          </Text>
        </View>
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

  hero: { borderRadius: RADIUS.xl, padding: SPACING.lg, alignItems: 'center', gap: 8 },
  heroEmoji: { fontSize: 48 },
  heroTitle: { fontFamily: FONTS.serif, fontSize: 24, fontWeight: '700', color: '#fff' },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },

  statsRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontFamily: FONTS.serif, fontSize: 20, fontWeight: '700', color: COLORS.chocolate },
  statLabel: { fontSize: 11, color: COLORS.muted, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: 4 },

  codeCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, gap: 10 },
  codeLabel: { fontSize: 11, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.2 },
  codeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cream, borderRadius: RADIUS.lg, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  codeText: { flex: 1, fontFamily: FONTS.serif, fontSize: 22, fontWeight: '700', color: COLORS.chocolate, letterSpacing: 2 },
  copyBtn: { width: 36, height: 36, borderRadius: RADIUS.sm, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },

  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.chocolate, borderRadius: RADIUS.full, paddingVertical: 15 },
  shareBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  sectionTitle: { fontSize: 11, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5 },

  howCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  howRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: SPACING.md },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.chocolate, alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontSize: 14, fontWeight: '700', color: '#fff' },
  howText: { flex: 1, fontSize: 14, color: COLORS.chocolate, fontWeight: '500' },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.md + 32 + 14 },

  termsBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  termsText: { flex: 1, fontSize: 12, color: COLORS.muted, lineHeight: 18 },
})
