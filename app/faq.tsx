import React, { useState, useRef } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'

interface FaqItem { q: string; a: string }
interface FaqSection { title: string; icon: string; items: FaqItem[] }

const FAQ_DATA: FaqSection[] = [
  {
    title: 'Заказ и доставка',
    icon: 'bicycle-outline',
    items: [
      {
        q: 'Сколько времени занимает приготовление?',
        a: 'Стандартные торты готовятся 1–2 дня. Индивидуальные заказы с декором — 2–4 дня. Точные сроки указывает кондитер при подтверждении заказа.',
      },
      {
        q: 'Как осуществляется доставка?',
        a: 'Доставка осуществляется нашими курьерами в специальных термоконтейнерах. Зона доставки — весь Актобе. Минимальная сумма заказа для доставки — 3 000 ₸.',
      },
      {
        q: 'Можно ли забрать самовывозом?',
        a: 'Да, самовывоз доступен из точки кондитера. Адрес уточняется в чате при оформлении заказа.',
      },
    ],
  },
  {
    title: 'Оплата',
    icon: 'card-outline',
    items: [
      {
        q: 'Какие способы оплаты доступны?',
        a: 'Мы принимаем Kaspi Pay, Kaspi QR, банковские карты Visa и Mastercard, а также наличные при получении.',
      },
      {
        q: 'Когда списываются деньги?',
        a: 'Оплата производится при подтверждении заказа кондитером. До этого момента средства не списываются.',
      },
      {
        q: 'Как получить чек?',
        a: 'Электронный чек отправляется на email или через push-уведомление сразу после оплаты.',
      },
    ],
  },
  {
    title: 'Возврат и отмена',
    icon: 'return-down-back-outline',
    items: [
      {
        q: 'Можно ли отменить заказ?',
        a: 'Заказ можно отменить до начала приготовления. После начала работы над тортом отмена невозможна — свяжитесь с поддержкой для уточнения.',
      },
      {
        q: 'Что делать, если заказ привезли повреждённым?',
        a: 'Сфотографируйте торт сразу при получении и напишите в поддержку. Мы рассмотрим ситуацию и компенсируем ущерб.',
      },
    ],
  },
  {
    title: 'Повторные заказы',
    icon: 'repeat-outline',
    items: [
      {
        q: 'Что такое "Повторения"?',
        a: 'В разделе "Мои повторения" вы сохраняете понравившиеся конфигурации тортов из конструктора. Можно быстро заказать тот же торт снова.',
      },
      {
        q: 'Можно ли изменить сохранённый торт?',
        a: 'Да, откройте повторение в конструкторе и измените любые параметры перед заказом.',
      },
    ],
  },
  {
    title: 'Кондитеры и рецепты',
    icon: 'ribbon-outline',
    items: [
      {
        q: 'Как выбрать кондитера?',
        a: 'Изучайте профили кондитеров: рейтинг, отзывы, портфолио работ. Каждый кондитер проходит верификацию перед выходом на платформу.',
      },
      {
        q: 'Гарантируется ли качество ингредиентов?',
        a: 'Да, все кондитеры соблюдают наши стандарты качества. Состав и аллергены указаны в карточке каждого изделия.',
      },
    ],
  },
]

function AccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)
  const anim = useRef(new Animated.Value(0)).current

  const toggle = () => {
    Animated.spring(anim, { toValue: open ? 0 : 1, useNativeDriver: true, speed: 20, bounciness: 0 }).start()
    setOpen(v => !v)
  }

  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })

  return (
    <View style={styles.accordItem}>
      <TouchableOpacity style={styles.accordHeader} onPress={toggle} activeOpacity={0.75}>
        <Text style={styles.accordQ}>{item.q}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-down" size={16} color={COLORS.muted} />
        </Animated.View>
      </TouchableOpacity>
      {open && (
        <View style={styles.accordBody}>
          <Text style={styles.accordA}>{item.a}</Text>
        </View>
      )}
    </View>
  )
}

function FaqSection({ section }: { section: FaqSection }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Ionicons name={section.icon as any} size={16} color={COLORS.chocolate} />
        </View>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
      <View style={[styles.card, SHADOWS.sm]}>
        {section.items.map((item, i) => (
          <React.Fragment key={item.q}>
            {i > 0 && <View style={styles.divider} />}
            <AccordionItem item={item} />
          </React.Fragment>
        ))}
      </View>
    </View>
  )
}

export default function FaqScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.handle} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={19} color={COLORS.chocolate} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Text style={styles.introTitle}>Часто задаваемые вопросы</Text>
          <Text style={styles.introSub}>Не нашли ответ? Напишите нам в чат поддержки</Text>
        </View>

        {FAQ_DATA.map(s => <FaqSection key={s.title} section={s} />)}

        <TouchableOpacity
          style={styles.supportBtn}
          onPress={() => router.push('/support')}
          activeOpacity={0.85}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={COLORS.chocolate} />
          <Text style={styles.supportBtnText}>Написать в поддержку</Text>
        </TouchableOpacity>
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
  content: { padding: SPACING.md, gap: SPACING.lg },

  intro: { alignItems: 'center', gap: 6, paddingVertical: SPACING.sm },
  introTitle: { fontFamily: FONTS.serif, fontSize: 20, fontWeight: '700', color: COLORS.chocolate },
  introSub: { fontSize: 13, color: COLORS.muted, textAlign: 'center' },

  section: { gap: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionIcon: { width: 30, height: 30, borderRadius: RADIUS.sm, backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.chocolate },

  card: { backgroundColor: '#fff', borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  divider: { height: 1, backgroundColor: COLORS.border },

  accordItem: {},
  accordHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: SPACING.md },
  accordQ: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.chocolate, lineHeight: 20 },
  accordBody: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  accordA: { fontSize: 14, color: COLORS.muted, lineHeight: 21 },

  supportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.chocolate, backgroundColor: '#fff' },
  supportBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.chocolate },
})
