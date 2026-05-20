import React, { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'

const MOCK_COMMENTS = [
  {
    id: '1',
    author: 'Айгуль М.',
    initial: 'А',
    color: COLORS.pink,
    text: 'Очень красивый торт! Хочу такой же на день рождения дочки 🎂',
    time: '2 ч назад',
    likes: 12,
  },
  {
    id: '2',
    author: 'Нурлан К.',
    initial: 'Н',
    color: '#7c3aed',
    text: 'Заказал на прошлой неделе — всё как на фото, вкус просто космос ✨',
    time: '5 ч назад',
    likes: 8,
  },
]

export default function CommentsScreen() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [comments, setComments] = useState(MOCK_COMMENTS)
  const [liked, setLiked] = useState<Set<string>>(new Set())

  const handleSend = () => {
    if (!input.trim()) return
    const newComment = {
      id: String(Date.now()),
      author: 'Вы',
      initial: 'В',
      color: COLORS.gold,
      text: input.trim(),
      time: 'только что',
      likes: 0,
    }
    setComments(prev => [newComment, ...prev])
    setInput('')
  }

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Handle */}
      <View style={styles.handle} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Комментарии</Text>
        <Text style={styles.headerCount}>{comments.length}</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color={COLORS.chocolate} />
        </TouchableOpacity>
      </View>

      {/* Comments list */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {comments.map(c => (
          <View key={c.id} style={styles.comment}>
            <View style={[styles.avatar, { backgroundColor: c.color }]}>
              <Text style={styles.avatarText}>{c.initial}</Text>
            </View>
            <View style={styles.commentBody}>
              <View style={styles.commentTop}>
                <Text style={styles.commentAuthor}>{c.author}</Text>
                <Text style={styles.commentTime}>{c.time}</Text>
              </View>
              <Text style={styles.commentText}>{c.text}</Text>
              <TouchableOpacity style={styles.likeRow} onPress={() => toggleLike(c.id)}>
                <Ionicons
                  name={liked.has(c.id) ? 'heart' : 'heart-outline'}
                  size={13}
                  color={liked.has(c.id) ? COLORS.pink : COLORS.muted}
                />
                <Text style={[styles.likeCount, liked.has(c.id) && { color: COLORS.pink }]}>
                  {c.likes + (liked.has(c.id) ? 1 : 0)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputRow, SHADOWS.sm]}>
        <View style={styles.inputAvatar}>
          <Text style={styles.inputAvatarText}>В</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Написать комментарий..."
          placeholderTextColor={COLORS.muted}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={300}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!input.trim()}
        >
          <Ionicons name="send" size={16} color={input.trim() ? '#fff' : COLORS.muted} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  handle: {
    width: 36, height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: 12, marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: '#fff',
    gap: 8,
  },
  headerTitle: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.chocolate,
    flex: 1,
  },
  headerCount: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.muted,
  },
  closeBtn: {
    width: 32, height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cream,
    alignItems: 'center', justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.md,
    gap: 20,
  },
  comment: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 38, height: 38,
    borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 14, fontWeight: '700', color: '#fff',
  },
  commentBody: {
    flex: 1,
    gap: 4,
  },
  commentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentAuthor: {
    fontSize: 13, fontWeight: '700', color: COLORS.chocolate,
  },
  commentTime: {
    fontSize: 11, color: COLORS.muted,
  },
  commentText: {
    fontSize: 14, color: COLORS.chocolate, lineHeight: 20,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  likeCount: {
    fontSize: 12, color: COLORS.muted, fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: SPACING.md,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputAvatar: {
    width: 34, height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  inputAvatarText: {
    fontSize: 13, fontWeight: '700', color: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 38,
    maxHeight: 100,
    backgroundColor: COLORS.cream,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.chocolate,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendBtn: {
    width: 38, height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.chocolate,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
})
