import React, { useRef, useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, TextInput, Dimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '@/constants/theme'
import CakePreview, { CakeConfig } from '@/components/builder/CakePreview'

const { width: W } = Dimensions.get('window')

/* ── Data ── */
const BASES = [
  { id: 'vanilla',    label: 'Ванильный',   emoji: '🍦', desc: 'Воздушный классический',   price: 0    },
  { id: 'chocolate',  label: 'Шоколадный',  emoji: '🍫', desc: 'Насыщенный какао',          price: 300  },
  { id: 'red_velvet', label: 'Ред Велвет',  emoji: '❤️', desc: 'Бархатный с какао',         price: 500  },
  { id: 'honey',      label: 'Медовый',     emoji: '🍯', desc: 'С натуральным мёдом',       price: 400  },
  { id: 'carrot',     label: 'Морковный',   emoji: '🥕', desc: 'Пряный с орехами',          price: 350  },
  { id: 'pistachio',  label: 'Фисташковый', emoji: '🌿', desc: 'Экзотический и нежный',     price: 600  },
]

const FILLINGS = [
  { id: 'cream',      label: 'Сливочный',   emoji: '🤍', desc: 'Нежный масляный крем',      price: 0    },
  { id: 'berry',      label: 'Ягодный',     emoji: '🫐', desc: 'Малина, черника, клубника',  price: 400  },
  { id: 'chocolate',  label: 'Шоколадный',  emoji: '🍫', desc: 'Ганаш и трюфель',           price: 300  },
  { id: 'caramel',    label: 'Карамельный', emoji: '🍮', desc: 'Солёная карамель',           price: 350  },
  { id: 'strawberry', label: 'Клубничный',  emoji: '🍓', desc: 'Свежая клубника в креме',   price: 450  },
  { id: 'mango',      label: 'Манговый',    emoji: '🥭', desc: 'Тропический экзотический',  price: 500  },
]

const SIZES = [
  { id: 'xs', label: '0.5 кг', sub: 'до 3 чел',  scale: 0.65, price: 2000  },
  { id: 'sm', label: '1 кг',   sub: 'до 6 чел',  scale: 0.80, price: 3500  },
  { id: 'md', label: '1.5 кг', sub: 'до 10 чел', scale: 1.00, price: 5500  },
  { id: 'lg', label: '2 кг',   sub: 'до 15 чел', scale: 1.18, price: 7500  },
  { id: 'xl', label: '3 кг',   sub: 'до 25 чел', scale: 1.35, price: 11000 },
]

const SHAPES = [
  { id: 'round',      label: 'Круглый',      emoji: '⭕', desc: 'Классика',       price: 0    },
  { id: 'square',     label: 'Квадратный',   emoji: '⬜', desc: 'Современный',   price: 300  },
  { id: 'heart',      label: 'Сердце',       emoji: '❤️', desc: 'Романтичный',   price: 500  },
  { id: 'bento',      label: 'Бенто',        emoji: '🎁', desc: 'Мини-торт',     price: 200  },
  { id: 'two_tier',   label: 'Двухъярусный', emoji: '🎂', desc: 'Торжественный', price: 1500 },
  { id: 'three_tier', label: 'Трёхъярусный', emoji: '👑', desc: 'Королевский',   price: 3000 },
]

const DECORS = [
  { id: 'berries',   label: 'Ягоды',      emoji: '🍓', price: 800  },
  { id: 'flowers',   label: 'Цветы',      emoji: '🌸', price: 1200 },
  { id: 'candles',   label: 'Свечи',      emoji: '🕯️', price: 300  },
  { id: 'macarons',  label: 'Макарон',    emoji: '🍬', price: 1500 },
  { id: 'chocolate', label: 'Шоко-декор', emoji: '🍫', price: 600  },
  { id: 'gold',      label: 'Золото',     emoji: '✨', price: 900  },
  { id: 'sprinkles', label: 'Посыпка',    emoji: '🎊', price: 200  },
  { id: 'ribbons',   label: 'Ленты',      emoji: '🎀', price: 400  },
  { id: 'topper',    label: 'Топпер',     emoji: '🏆', price: 700  },
  { id: 'drip',      label: 'Потёки',     emoji: '🍯', price: 500  },
]

const EXTRAS = [
  { id: 'box',      label: 'Коробка',     emoji: '📦', price: 500  },
  { id: 'card',     label: 'Открытка',    emoji: '💌', price: 300  },
  { id: 'balloon',  label: 'Шарики',      emoji: '🎈', price: 800  },
  { id: 'sparkler', label: 'Бенгалки',    emoji: '🎆', price: 400  },
  { id: 'photo',    label: 'Фото-печать', emoji: '🖼️', price: 900  },
  { id: 'delivery', label: 'Доставка',    emoji: '🛵', price: 1500 },
]

const TEXT_COLORS = [
  { id: 'white',     label: 'Белый',   color: '#ffffff', border: '#cccccc' },
  { id: 'gold',      label: 'Золотой', color: '#c9a96e', border: '#c9a96e' },
  { id: 'pink',      label: 'Розовый', color: '#e8698a', border: '#e8698a' },
  { id: 'chocolate', label: 'Шоко',    color: '#2c1810', border: '#2c1810' },
]

const TEXT_FONTS = [
  { id: 'sans',   label: 'Современный'  },
  { id: 'serif',  label: 'Классический' },
  { id: 'script', label: 'Рукопись'     },
]

const STEPS = [
  { id: 0, key: 'base',    label: 'Основа',  icon: '🍰', hint: 'Основа определяет вкус и текстуру торта' },
  { id: 1, key: 'filling', label: 'Крем',    icon: '🤍', hint: 'Крем — сердце торта, выбирай с душой' },
  { id: 2, key: 'size',    label: 'Размер',  icon: '⚖️', hint: 'Рассчитай на количество гостей' },
  { id: 3, key: 'shape',   label: 'Форма',   icon: '🔮', hint: 'Форма задаёт характер торта' },
  { id: 4, key: 'decor',   label: 'Декор',   icon: '🌸', hint: 'Можно выбрать несколько элементов' },
  { id: 5, key: 'text',    label: 'Надпись', icon: '✍️', hint: 'Персонализируй свой торт' },
  { id: 6, key: 'extras',  label: 'Допы',    icon: '✨', hint: 'Завершающие штрихи к заказу' },
]

/* ── Option card subcomponents ── */
function FlavorCard({
  item, selected, onPress,
}: { item: typeof BASES[0]; selected: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current
  const press = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 80, bounciness: 20 }),
      Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 50, bounciness: 12 }),
    ]).start()
    onPress()
  }
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.flavorCard, selected && styles.flavorCardSelected]}
        onPress={press}
        activeOpacity={0.9}
      >
        <Text style={styles.flavorEmoji}>{item.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.flavorLabel, selected && styles.flavorLabelSel]}>{item.label}</Text>
          <Text style={styles.flavorDesc}>{item.desc}</Text>
        </View>
        <Text style={[styles.flavorPrice, selected && styles.flavorPriceSel]}>
          {item.price === 0 ? 'В цене' : `+${item.price} ₸`}
        </Text>
        {selected && <View style={styles.checkDot}><Ionicons name="checkmark" size={11} color="#fff" /></View>}
      </TouchableOpacity>
    </Animated.View>
  )
}

function SizeCard({
  item, selected, onPress,
}: { item: typeof SIZES[0]; selected: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current
  const press = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 80, bounciness: 20 }),
      Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 50, bounciness: 12 }),
    ]).start()
    onPress()
  }
  const barW = Math.max(0, Math.min(1, (item.scale - 0.6) / 0.8))
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.sizeCard, selected && styles.sizeCardSelected]}
        onPress={press}
        activeOpacity={0.9}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.sizeTopRow}>
            <Text style={[styles.sizeLabel, selected && styles.sizeLabelSel]}>{item.label}</Text>
            <Text style={styles.sizeSub}>{item.sub}</Text>
          </View>
          <View style={styles.sizeBarBg}>
            <View style={[styles.sizeBarFill, { width: `${barW * 100}%` as any }]} />
          </View>
        </View>
        <Text style={[styles.sizePrice, selected && styles.sizePriceSel]}>
          {item.price.toLocaleString()} ₸
        </Text>
        {selected && <View style={styles.checkDot}><Ionicons name="checkmark" size={11} color="#fff" /></View>}
      </TouchableOpacity>
    </Animated.View>
  )
}

function ShapeCard({
  item, selected, onPress,
}: { item: typeof SHAPES[0]; selected: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current
  const press = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 80, bounciness: 20 }),
      Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 50, bounciness: 12 }),
    ]).start()
    onPress()
  }
  const cardW = (W - SPACING.md * 2 - 10) / 2
  return (
    <Animated.View style={[{ transform: [{ scale }] }, { width: cardW }]}>
      <TouchableOpacity
        style={[styles.shapeCard, selected && styles.shapeCardSelected]}
        onPress={press}
        activeOpacity={0.9}
      >
        <Text style={styles.shapeEmoji}>{item.emoji}</Text>
        <Text style={[styles.shapeLabel, selected && styles.shapeLabelSel]}>{item.label}</Text>
        <Text style={styles.shapeDesc}>{item.desc}</Text>
        {item.price > 0 && <Text style={styles.shapePrice}>+{item.price} ₸</Text>}
        {selected && <View style={styles.checkDot}><Ionicons name="checkmark" size={11} color="#fff" /></View>}
      </TouchableOpacity>
    </Animated.View>
  )
}

/* ── Summary panel ── */
function SummaryPanel({
  config, totalPrice, onClose, onOrder, onPublish,
}: {
  config: CakeConfig; totalPrice: number
  onClose: () => void; onOrder: () => void; onPublish: () => void
}) {
  const translateY = useRef(new Animated.Value(700)).current

  React.useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0, useNativeDriver: true, tension: 50, friction: 9,
    }).start()
  }, [])

  const close = () => {
    Animated.timing(translateY, { toValue: 700, duration: 260, useNativeDriver: true })
      .start(onClose)
  }

  const baseLabel   = BASES.find(b => b.id === config.base.id)?.label ?? ''
  const fillLabel   = FILLINGS.find(f => f.id === config.filling.id)?.label ?? ''
  const sizeLabel   = SIZES.find(s => Math.abs(s.scale - config.size.scale) < 0.01)?.label ?? ''
  const shapeLabel  = SHAPES.find(s => s.id === config.shape.id)?.label ?? ''
  const decorLabels = config.decor.map(d => DECORS.find(x => x.id === d)?.label ?? '').filter(Boolean)

  const rows = [
    { label: 'Основа',  value: baseLabel  },
    { label: 'Крем',    value: fillLabel   },
    { label: 'Размер',  value: sizeLabel   },
    { label: 'Форма',   value: shapeLabel  },
    { label: 'Декор',   value: decorLabels.join(', ') || 'Без декора' },
    ...(config.text ? [{ label: 'Надпись', value: `«${config.text}»` }] : []),
  ]

  return (
    <View style={styles.summaryOverlay}>
      <TouchableOpacity style={styles.summaryBackdrop} activeOpacity={1} onPress={close} />
      <Animated.View style={[styles.summarySheet, { transform: [{ translateY }] }]}>
        <View style={styles.summaryHandle} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.summaryContent}>
          <Text style={styles.summaryTitle}>Ваш торт</Text>

          <View style={styles.summaryPreviewWrap}>
            <CakePreview config={config} />
          </View>

          <View style={styles.compositionCard}>
            <Text style={styles.compositionTitle}>Состав заказа</Text>
            {rows.map(row => (
              <View key={row.label} style={styles.compositionRow}>
                <Text style={styles.compositionLabel}>{row.label}</Text>
                <Text style={styles.compositionValue} numberOfLines={1}>{row.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Итого</Text>
            <Text style={styles.totalPrice}>{totalPrice.toLocaleString()} ₸</Text>
          </View>

          <TouchableOpacity style={styles.btnOrder} onPress={onOrder} activeOpacity={0.85}>
            <Ionicons name="bag-outline" size={18} color="#fff" />
            <Text style={styles.btnOrderText}>Заказать торт</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnPublish} onPress={onPublish} activeOpacity={0.85}>
            <Ionicons name="share-social-outline" size={18} color={COLORS.chocolate} />
            <Text style={styles.btnPublishText}>Поделиться в ленте</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  )
}

/* ── Main Screen ── */
export default function BuildScreen() {
  const insets = useSafeAreaInsets()

  const [step, setStep]                     = useState(0)
  const [selectedBase, setSelectedBase]     = useState('vanilla')
  const [selectedFilling, setSelectedFilling] = useState('cream')
  const [selectedSize, setSelectedSize]     = useState(SIZES[2])
  const [selectedShape, setSelectedShape]   = useState('round')
  const [selectedDecor, setSelectedDecor]   = useState<string[]>([])
  const [cakeText, setCakeText]             = useState('')
  const [textColor, setTextColor]           = useState('white')
  const [textFont, setTextFont]             = useState('sans')
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [showSummary, setShowSummary]       = useState(false)

  const slideAnim   = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(1)).current
  const priceScale  = useRef(new Animated.Value(1)).current

  const config: CakeConfig = {
    base:     { id: selectedBase },
    filling:  { id: selectedFilling },
    size:     { scale: selectedSize.scale },
    shape:    { id: selectedShape },
    decor:    selectedDecor,
    text:     cakeText,
    textColor,
    textFont,
  }

  const basePrice   = BASES.find(b => b.id === selectedBase)?.price ?? 0
  const fillPrice   = FILLINGS.find(f => f.id === selectedFilling)?.price ?? 0
  const sizePrice   = selectedSize.price
  const shapePrice  = SHAPES.find(s => s.id === selectedShape)?.price ?? 0
  const decorPrice  = selectedDecor.reduce((s, id) => s + (DECORS.find(d => d.id === id)?.price ?? 0), 0)
  const extrasPrice = selectedExtras.reduce((s, id) => s + (EXTRAS.find(e => e.id === id)?.price ?? 0), 0)
  const totalPrice  = basePrice + fillPrice + sizePrice + shapePrice + decorPrice + extrasPrice

  const animateStep = (next: number) => {
    const dir = next > step ? -40 : 40
    Animated.parallel([
      Animated.timing(slideAnim,   { toValue: dir, duration: 120, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0,   duration: 100, useNativeDriver: true }),
    ]).start(() => {
      setStep(next)
      slideAnim.setValue(-dir)
      Animated.parallel([
        Animated.spring(slideAnim,   { toValue: 0, useNativeDriver: true, tension: 80, friction: 9 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start()
    })
  }

  const bouncePrice = () => {
    Animated.sequence([
      Animated.spring(priceScale, { toValue: 1.18, useNativeDriver: true, speed: 60, bounciness: 15 }),
      Animated.spring(priceScale, { toValue: 1,    useNativeDriver: true, speed: 40 }),
    ]).start()
  }

  const stepInfo = STEPS[step]

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return BASES.map(b => (
          <FlavorCard key={b.id} item={b} selected={selectedBase === b.id}
            onPress={() => { setSelectedBase(b.id); bouncePrice() }} />
        ))
      case 1:
        return FILLINGS.map(f => (
          <FlavorCard key={f.id} item={f} selected={selectedFilling === f.id}
            onPress={() => { setSelectedFilling(f.id); bouncePrice() }} />
        ))
      case 2:
        return SIZES.map(s => (
          <SizeCard key={s.id} item={s} selected={selectedSize.id === s.id}
            onPress={() => { setSelectedSize(s); bouncePrice() }} />
        ))
      case 3:
        return (
          <View style={styles.shapeGrid}>
            {SHAPES.map(s => (
              <ShapeCard key={s.id} item={s} selected={selectedShape === s.id}
                onPress={() => { setSelectedShape(s.id); bouncePrice() }} />
            ))}
          </View>
        )
      case 4:
        return (
          <View style={styles.decorGrid}>
            {DECORS.map(d => {
              const sel = selectedDecor.includes(d.id)
              return (
                <TouchableOpacity
                  key={d.id}
                  style={[styles.decorChip, sel && styles.decorChipSel]}
                  onPress={() => {
                    setSelectedDecor(prev => sel ? prev.filter(x => x !== d.id) : [...prev, d.id])
                    bouncePrice()
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.decorEmoji}>{d.emoji}</Text>
                  <Text style={[styles.decorLabel, sel && styles.decorLabelSel]}>{d.label}</Text>
                  <Text style={styles.decorPrice}>+{d.price} ₸</Text>
                  {sel && <View style={styles.decorCheck}><Ionicons name="checkmark" size={9} color="#fff" /></View>}
                </TouchableOpacity>
              )
            })}
          </View>
        )
      case 5:
        return (
          <View style={styles.textStep}>
            <View style={styles.textInputWrap}>
              <TextInput
                style={styles.textInput}
                placeholder="Например: С днём рождения! 🎂"
                placeholderTextColor={COLORS.muted}
                value={cakeText}
                onChangeText={setCakeText}
                maxLength={30}
                returnKeyType="done"
              />
              <Text style={styles.textCounter}>{cakeText.length}/30</Text>
            </View>
            <Text style={styles.subLabel}>Цвет надписи</Text>
            <View style={styles.colorRow}>
              {TEXT_COLORS.map(c => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.colorDot, { backgroundColor: c.color, borderColor: c.border },
                    textColor === c.id && styles.colorDotSel]}
                  onPress={() => setTextColor(c.id)}
                >
                  {textColor === c.id && (
                    <Ionicons name="checkmark" size={13} color={c.id === 'white' ? '#333' : '#fff'} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.subLabel}>Шрифт</Text>
            <View style={styles.fontRow}>
              {TEXT_FONTS.map(f => (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.fontChip, textFont === f.id && styles.fontChipSel]}
                  onPress={() => setTextFont(f.id)}
                >
                  <Text style={[styles.fontChipLabel, textFont === f.id && styles.fontChipLabelSel]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )
      case 6:
        return EXTRAS.map(e => {
          const sel = selectedExtras.includes(e.id)
          return (
            <TouchableOpacity
              key={e.id}
              style={[styles.extraRow, sel && styles.extraRowSel]}
              onPress={() => {
                setSelectedExtras(prev => sel ? prev.filter(x => x !== e.id) : [...prev, e.id])
                bouncePrice()
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.extraEmoji}>{e.emoji}</Text>
              <Text style={[styles.extraLabel, sel && styles.extraLabelSel]}>{e.label}</Text>
              <Text style={styles.extraPrice}>+{e.price} ₸</Text>
              <View style={[styles.extraCheck, sel && styles.extraCheckActive]}>
                {sel && <Ionicons name="checkmark" size={13} color="#fff" />}
              </View>
            </TouchableOpacity>
          )
        })
      default:
        return null
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>КОНСТРУКТОР</Text>
          <Text style={styles.headerTitle}>Собери торт</Text>
        </View>
        <Animated.View style={{ transform: [{ scale: priceScale }] }}>
          <View style={styles.priceChip}>
            <Text style={styles.priceChipLabel}>Цена</Text>
            <Text style={styles.priceChipValue}>{totalPrice.toLocaleString()} ₸</Text>
          </View>
        </Animated.View>
      </View>

      {/* ── PREVIEW ── */}
      <View style={styles.previewWrap}>
        <CakePreview config={config} />
      </View>

      {/* ── STEP TABS ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.stepScroll}
        contentContainerStyle={styles.stepScrollContent}
      >
        {STEPS.map((s, i) => {
          const done = (
            i === 0 ? !!selectedBase :
            i === 1 ? !!selectedFilling :
            i === 2 ? !!selectedSize :
            i === 3 ? !!selectedShape :
            i === 4 ? selectedDecor.length > 0 :
            i === 5 ? cakeText.length > 0 :
            selectedExtras.length > 0
          )
          const active = i === step
          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.stepTab, active && styles.stepTabActive, done && !active && styles.stepTabDone]}
              onPress={() => animateStep(i)}
            >
              <Text style={styles.stepTabIcon}>{s.icon}</Text>
              <Text style={[styles.stepTabLabel, active && styles.stepTabLabelActive]}>{s.label}</Text>
              {done && !active && <Ionicons name="checkmark-circle" size={12} color={COLORS.green} />}
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* ── STEP CONTENT ── */}
      <Animated.ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ transform: [{ translateY: slideAnim }], opacity: opacityAnim }}>
          <Text style={styles.stepTitle}>{stepInfo.icon} {stepInfo.label}</Text>
          <Text style={styles.stepHint}>{stepInfo.hint}</Text>
          <View style={styles.stepContent}>
            {renderStepContent()}
          </View>
        </Animated.View>
      </Animated.ScrollView>

      {/* ── BOTTOM NAV ── */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
        {step > 0 ? (
          <TouchableOpacity style={styles.btnBack} onPress={() => animateStep(step - 1)}>
            <Ionicons name="arrow-back" size={20} color={COLORS.chocolate} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 46 }} />
        )}

        <View style={styles.dotsRow}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>

        {step < STEPS.length - 1 ? (
          <TouchableOpacity
            style={[styles.btnNext, styles.btnNextDisabled]}
            onPress={() => animateStep(step + 1)}
            activeOpacity={0.85}
          >
            <Text style={styles.btnNextText}>Далее</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.btnFinish}
            onPress={() => setShowSummary(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="sparkles" size={16} color="#fff" />
            <Text style={styles.btnFinishText}>Готово</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── SUMMARY PANEL ── */}
      {showSummary && (
        <SummaryPanel
          config={config}
          totalPrice={totalPrice}
          onClose={() => setShowSummary(false)}
          onOrder={() => setShowSummary(false)}
          onPublish={() => setShowSummary(false)}
        />
      )}
    </View>
  )
}

/* ── Styles ── */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.cream },

  /* Header */
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  eyebrow: {
    fontSize: 9.5, fontWeight: '700', color: COLORS.gold,
    letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 2,
  },
  headerTitle: { fontFamily: FONTS.serif, fontSize: 22, fontWeight: '700', color: COLORS.chocolate },
  priceChip: {
    backgroundColor: COLORS.chocolate, borderRadius: RADIUS.lg,
    paddingHorizontal: 14, paddingVertical: 8, alignItems: 'flex-end',
  },
  priceChipLabel: { fontSize: 9, fontWeight: '600', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1 },
  priceChipValue: { fontSize: 17, fontWeight: '700', color: '#fff' },

  /* Preview */
  previewWrap: { backgroundColor: '#fdf8f3', borderBottomWidth: 1, borderBottomColor: COLORS.border },

  /* Step tabs */
  stepScroll: { flexGrow: 0, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  stepScrollContent: { paddingHorizontal: SPACING.md, paddingVertical: 10, gap: 8 },
  stepTab: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.cream, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  stepTabActive: { backgroundColor: COLORS.chocolate, borderColor: COLORS.chocolate },
  stepTabDone: { borderColor: COLORS.green },
  stepTabIcon: { fontSize: 13 },
  stepTabLabel: { fontSize: 11.5, fontWeight: '600', color: COLORS.muted },
  stepTabLabelActive: { color: '#fff' },

  /* Content */
  contentScroll: { flex: 1 },
  contentInner: { padding: SPACING.md, paddingBottom: 24 },
  stepTitle: { fontFamily: FONTS.serif, fontSize: 20, fontWeight: '700', color: COLORS.chocolate, marginBottom: 3 },
  stepHint: { fontSize: 12.5, color: COLORS.muted, marginBottom: 14, lineHeight: 18 },
  stepContent: { gap: 10 },

  /* Flavor card */
  flavorCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border, position: 'relative',
  },
  flavorCardSelected: { borderColor: COLORS.chocolate, backgroundColor: '#fdf5ee' },
  flavorEmoji: { fontSize: 28 },
  flavorLabel: { fontSize: 15, fontWeight: '600', color: COLORS.chocolate },
  flavorLabelSel: { color: COLORS.chocolate },
  flavorDesc: { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  flavorPrice: { fontSize: 12, color: COLORS.muted, fontWeight: '500' },
  flavorPriceSel: { color: COLORS.gold, fontWeight: '700' },

  /* Size card */
  sizeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border, position: 'relative',
  },
  sizeCardSelected: { borderColor: COLORS.chocolate, backgroundColor: '#fdf5ee' },
  sizeTopRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 6 },
  sizeLabel: { fontSize: 16, fontWeight: '700', color: COLORS.chocolate },
  sizeLabelSel: { color: COLORS.chocolate },
  sizeSub: { fontSize: 12, color: COLORS.muted },
  sizeBarBg: { height: 6, backgroundColor: COLORS.border, borderRadius: 3 },
  sizeBarFill: { height: 6, backgroundColor: COLORS.gold, borderRadius: 3 },
  sizePrice: { fontSize: 14, fontWeight: '700', color: COLORS.muted },
  sizePriceSel: { color: COLORS.chocolate },

  /* Shape grid */
  shapeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  shapeCard: {
    alignItems: 'center', gap: 4,
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    padding: 14, borderWidth: 1.5, borderColor: COLORS.border, position: 'relative',
  },
  shapeCardSelected: { borderColor: COLORS.chocolate, backgroundColor: '#fdf5ee' },
  shapeEmoji: { fontSize: 32, marginBottom: 4 },
  shapeLabel: { fontSize: 13, fontWeight: '700', color: COLORS.chocolate },
  shapeLabelSel: { color: COLORS.chocolate },
  shapeDesc: { fontSize: 11, color: COLORS.muted },
  shapePrice: { fontSize: 11, color: COLORS.gold, fontWeight: '600', marginTop: 2 },

  /* Decor grid */
  decorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  decorChip: {
    alignItems: 'center', gap: 3,
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    padding: 12, borderWidth: 1.5, borderColor: COLORS.border,
    width: (W - SPACING.md * 2 - 16) / 3,
    position: 'relative',
  },
  decorChipSel: { borderColor: COLORS.chocolate, backgroundColor: '#fdf5ee' },
  decorEmoji: { fontSize: 26 },
  decorLabel: { fontSize: 11, fontWeight: '600', color: COLORS.chocolate, textAlign: 'center' },
  decorLabelSel: { color: COLORS.chocolate },
  decorPrice: { fontSize: 10, color: COLORS.muted },
  decorCheck: {
    position: 'absolute', top: 6, right: 6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: COLORS.chocolate,
    alignItems: 'center', justifyContent: 'center',
  },

  /* Text step */
  textStep: { gap: 12 },
  textInputWrap: {
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.border,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingRight: 8,
  },
  textInput: { flex: 1, fontSize: 15, color: COLORS.chocolate, paddingVertical: 14 },
  textCounter: { fontSize: 11, color: COLORS.muted },
  subLabel: { fontSize: 11, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5 },
  colorRow: { flexDirection: 'row', gap: 12 },
  colorDot: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 2.5,
    alignItems: 'center', justifyContent: 'center',
  },
  colorDotSel: { transform: [{ scale: 1.18 }] },
  fontRow: { flexDirection: 'row', gap: 8 },
  fontChip: {
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: '#fff',
  },
  fontChipSel: { borderColor: COLORS.chocolate, backgroundColor: '#fdf5ee' },
  fontChipLabel: { fontSize: 13, fontWeight: '500', color: COLORS.muted },
  fontChipLabelSel: { color: COLORS.chocolate, fontWeight: '700' },

  /* Extras */
  extraRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border,
  },
  extraRowSel: { borderColor: COLORS.chocolate, backgroundColor: '#fdf5ee' },
  extraEmoji: { fontSize: 24 },
  extraLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.chocolate },
  extraLabelSel: { color: COLORS.chocolate },
  extraPrice: { fontSize: 12, color: COLORS.muted },
  extraCheck: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
  },
  extraCheckActive: { backgroundColor: COLORS.chocolate, borderColor: COLORS.chocolate },

  /* Shared check dot */
  checkDot: {
    position: 'absolute', top: 10, right: 10,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: COLORS.chocolate,
    alignItems: 'center', justifyContent: 'center',
  },

  /* Bottom nav */
  bottomNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: '#fff',
  },
  btnBack: {
    width: 46, height: 46, borderRadius: RADIUS.full,
    backgroundColor: COLORS.cream, borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
  dotActive: { backgroundColor: COLORS.chocolate, width: 18 },
  btnNext: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 13, paddingHorizontal: 22,
    borderRadius: RADIUS.full, backgroundColor: COLORS.chocolate,
  },
  btnNextDisabled: { opacity: 1 },
  btnNextText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  btnFinish: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 13, paddingHorizontal: 22,
    borderRadius: RADIUS.full, backgroundColor: COLORS.pink,
  },
  btnFinishText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  /* Summary */
  summaryOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 200 },
  summaryBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(44,24,16,0.45)' },
  summarySheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl,
    maxHeight: '90%',
    ...SHADOWS.lg,
  },
  summaryHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginTop: 12 },
  summaryContent: { padding: SPACING.md, paddingBottom: 40 },
  summaryTitle: { fontFamily: FONTS.serif, fontSize: 24, fontWeight: '700', color: COLORS.chocolate, textAlign: 'center', marginBottom: 12 },
  summaryPreviewWrap: { marginBottom: 16, backgroundColor: '#fdf8f3', borderRadius: RADIUS.xl, overflow: 'hidden' },
  compositionCard: {
    backgroundColor: COLORS.cream, borderRadius: RADIUS.lg,
    padding: SPACING.md, gap: 8, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  compositionTitle: { fontSize: 11, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  compositionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  compositionLabel: { fontSize: 13, color: COLORS.muted },
  compositionValue: { fontSize: 13, fontWeight: '600', color: COLORS.chocolate, maxWidth: '55%', textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: COLORS.muted },
  totalPrice: { fontFamily: FONTS.serif, fontSize: 28, fontWeight: '700', color: COLORS.chocolate },
  btnOrder: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.chocolate, borderRadius: RADIUS.full,
    paddingVertical: 15, marginBottom: 10,
  },
  btnOrderText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  btnPublish: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: RADIUS.full,
    paddingVertical: 14, borderWidth: 1.5, borderColor: COLORS.border,
  },
  btnPublishText: { fontSize: 14, fontWeight: '600', color: COLORS.chocolate },
})
