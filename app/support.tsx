import React, { useState, useRef } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import { useUser } from '@/context/UserContext'

interface Message {
  id: string
  from: 'user' | 'support'
  text: string
  time: string
}

const QUICK_TOPICS = [
  { icon: 'time-outline',       label: 'Где мой заказ?' },
  { icon: 'refresh-outline',    label: 'Отменить заказ' },
  { icon: 'card-outline',       label: 'Проблема с оплатой' },
  { icon: 'star-outline',       label: 'Оставить жалобу' },
]

const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    from: 'support',
    text: 'Здравствуйте! Я Арузан, ваш персональный менеджер Aktobe Sweets 🎂\nЧем могу помочь?',
    time: formatTime(new Date()),
  },
]

function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const SUPPORT_REPLIES: Record<string, string> = {
  'Где мой заказ?': 'Ваш заказ сейчас готовится. Ожидаемое время доставки — в течение 2–3 часов. Курьер свяжется с вами за 15 минут до прибытия.',
  'Отменить заказ': 'Чтобы отменить заказ, уточните его номер или дату. Мы можем отменить заказ до начала приготовления.',
  'Проблема с оплатой': 'Пожалуйста, опишите проблему подробнее. Мы проверим статус платежа и свяжемся с вами в течение 15 минут.',
  'Оставить жалобу': 'Нам жаль, что что-то пошло не так. Расскажите подробнее, и мы обязательно разберёмся и улучшим сервис.',
}

const FALLBACK = 'Спасибо за ваше сообщение! Мы обработаем его в ближайшее время. Наш менеджер ответит вам в течение 5–10 минут.'

export default function SupportScreen() {
  const router  = useRouter()
  const insets  = useSafeAreaInsets()
  const { profile } = useUser()
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const scrollRef = useRef<ScrollView>(null)

  const send = (text: string) => {
    if (!text.trim()) return
    const now = new Date()
    const userMsg: Message = { id: String(Date.now()), from: 'user', text: text.trim(), time: formatTime(now) }
    const reply = SUPPORT_REPLIES[text.trim()] ?? FALLBACK
    const supportMsg: Message = {
      id: String(Date.now() + 1),
      from: 'support',
      text: reply,
      time: formatTime(new Date(now.getTime() + 2000)),
    }
    setMessages(prev => [...prev, userMsg, supportMsg])
    setInput('')
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={19} color={COLORS.chocolate} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.headerTitle}>Поддержка</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Арузан онлайн</Text>
            </View>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {/* Quick topics */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicsScroll}
          style={styles.topicsBar}
        >
          {QUICK_TOPICS.map(t => (
            <TouchableOpacity key={t.label} style={styles.topicChip} onPress={() => send(t.label)} activeOpacity={0.8}>
              <Ionicons name={t.icon as any} size={13} color={COLORS.chocolate} />
              <Text style={styles.topicLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          contentContainerStyle={[styles.chatContent, { paddingBottom: 8 }]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map(m => (
            <View key={m.id} style={[styles.bubble, m.from === 'user' ? styles.bubbleUser : styles.bubbleSupport]}>
              {m.from === 'support' && (
                <View style={styles.supportAvatar}>
                  <Text style={styles.supportAvatarText}>А</Text>
                </View>
              )}
              <View style={[styles.bubbleInner, m.from === 'user' ? styles.bubbleInnerUser : styles.bubbleInnerSupport]}>
                <Text style={[styles.bubbleText, m.from === 'user' && styles.bubbleTextUser]}>{m.text}</Text>
                <Text style={[styles.bubbleTime, m.from === 'user' && styles.bubbleTimeUser]}>{m.time}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Напишите сообщение..."
            placeholderTextColor={COLORS.muted}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => send(input)}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => send(input)}
            disabled={!input.trim()}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.cream },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.borderSolid, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: '#fff' },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  headerTitle: { fontFamily: FONTS.serif, fontSize: 16, fontWeight: '700', color: COLORS.chocolate },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' },
  onlineText: { fontSize: 11, color: '#22c55e', fontWeight: '500' },

  topicsBar: { maxHeight: 56, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: '#fff' },
  topicsScroll: { paddingHorizontal: SPACING.md, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  topicChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: RADIUS.full, backgroundColor: COLORS.cream, borderWidth: 1, borderColor: COLORS.border },
  topicLabel: { fontSize: 12, fontWeight: '600', color: COLORS.chocolate },

  chatArea: { flex: 1 },
  chatContent: { padding: SPACING.md, gap: 12 },

  bubble: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubbleUser: { flexDirection: 'row-reverse' },
  bubbleSupport: {},
  supportAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.chocolate, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  supportAvatarText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  bubbleInner: { maxWidth: '78%', borderRadius: 16, padding: 12, gap: 4 },
  bubbleInnerSupport: { backgroundColor: '#fff', borderBottomLeftRadius: 4, ...SHADOWS.sm },
  bubbleInnerUser: { backgroundColor: COLORS.chocolate, borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, color: COLORS.chocolate, lineHeight: 20 },
  bubbleTextUser: { color: '#fff' },
  bubbleTime: { fontSize: 10, color: COLORS.muted, alignSelf: 'flex-end' },
  bubbleTimeUser: { color: 'rgba(255,255,255,0.6)' },

  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: SPACING.md, paddingTop: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: COLORS.border },
  textInput: { flex: 1, fontSize: 14, color: COLORS.chocolate, backgroundColor: COLORS.cream, borderRadius: RADIUS.lg, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.chocolate, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: COLORS.muted },
})
