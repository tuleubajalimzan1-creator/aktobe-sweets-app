export interface FeedPost {
  id: string
  image: string
  author: string
  authorAvatar: string
  authorRating: number
  occasion: string
  occasionIcon: string
  tags: string[]
  likes: number
  saves: number
  repeats: number
  comments: number
  price: number
  description: string
  height?: number
  badge?: 'trending' | 'editor' | 'repeated'
}

export interface TrendItem {
  id: string
  label: string
  emoji: string
  count: number
  hot?: boolean
}

export interface Category {
  id: string
  label: string
  image: string
  count: number
  gradient: [string, string]
}

export interface RepeatedDesign {
  id: string
  image: string
  name: string
  author: string
  price: number
  repeats: number
  ordersToday: number
  saves: number
}

export interface Chef {
  id: string
  name: string
  specialty: string
  avatar: string
  rating: number
  orders: number
  followers: number
  bio: string
  works: string[]
  badge?: string
}

export interface SmartPick {
  id: string
  label: string
  emoji: string
  gradient: [string, string]
}

export interface LiveEvent {
  id: string
  avatar: string
  name: string
  action: string
  target: string
  time: string
  type: 'save' | 'order' | 'repeat' | 'new'
}

export const FEED_POSTS: FeedPost[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=85',
    author: 'Айгуль Нурова',
    authorAvatar: '',
    authorRating: 4.9,
    occasion: 'Свадьба',
    occasionIcon: '💍',
    tags: ['минимализм', 'белый', 'ягоды'],
    likes: 847,
    saves: 312,
    repeats: 28,
    comments: 94,
    price: 18500,
    description: 'Свадебный трёхъярусный с живыми цветами',
    height: 310,
    badge: 'editor',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&q=85',
    author: 'Гульнар Мухамед.',
    authorAvatar: '',
    authorRating: 4.9,
    occasion: 'День рождения',
    occasionIcon: '🎂',
    tags: ['ягодный', 'розовый', 'бенто'],
    likes: 523,
    saves: 198,
    repeats: 41,
    comments: 61,
    price: 6500,
    description: 'Бенто-торт с розовым велюром',
    height: 240,
    badge: 'trending',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=600&q=85',
    author: 'Самал Карина',
    authorAvatar: '',
    authorRating: 4.8,
    occasion: 'Просто так',
    occasionIcon: '🌸',
    tags: ['наполеон', 'классика', 'карамель'],
    likes: 389,
    saves: 156,
    repeats: 19,
    comments: 42,
    price: 5200,
    description: 'Наполеон с карамельной прослойкой',
    height: 270,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=85',
    author: 'Роза Бекова',
    authorAvatar: '',
    authorRating: 4.7,
    occasion: 'Корпоратив',
    occasionIcon: '🏢',
    tags: ['тирамису', 'кофе', 'итальянский'],
    likes: 671,
    saves: 244,
    repeats: 33,
    comments: 78,
    price: 5800,
    description: 'Тирамису с маскарпоне без выпечки',
    height: 250,
    badge: 'repeated',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=85',
    author: 'Айгуль Нурова',
    authorAvatar: '',
    authorRating: 4.9,
    occasion: 'Годовщина',
    occasionIcon: '💕',
    tags: ['ягодный', 'клубника', 'летний'],
    likes: 902,
    saves: 387,
    repeats: 56,
    comments: 113,
    price: 6500,
    description: 'Торт с клубникой и черникой, сливочный крем',
    height: 290,
    badge: 'trending',
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=85',
    author: 'Дина Омарова',
    authorAvatar: '',
    authorRating: 4.8,
    occasion: 'Просто так',
    occasionIcon: '🌸',
    tags: ['чизкейк', 'нью-йорк', 'сливочный'],
    likes: 445,
    saves: 189,
    repeats: 24,
    comments: 55,
    price: 3800,
    description: 'Чизкейк Нью-Йорк на песочной основе',
    height: 230,
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=85',
    author: 'Зарина Асылова',
    authorAvatar: '',
    authorRating: 4.8,
    occasion: 'День рождения',
    occasionIcon: '🎂',
    tags: ['детский', 'радуга', 'яркий'],
    likes: 312,
    saves: 141,
    repeats: 22,
    comments: 38,
    price: 7200,
    description: 'Радужный торт для детского праздника',
    height: 260,
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&q=85',
    author: 'Камила Жаксыбек',
    authorAvatar: '',
    authorRating: 4.9,
    occasion: 'Корпоратив',
    occasionIcon: '🏢',
    tags: ['шоколадный', 'трюфель', 'тёмный'],
    likes: 788,
    saves: 301,
    repeats: 44,
    comments: 89,
    price: 8900,
    description: 'Шоколадный трюфельный с декором из какао',
    height: 300,
    badge: 'editor',
  },
  {
    id: '9',
    image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&q=85',
    author: 'Мадина Сейт.',
    authorAvatar: '',
    authorRating: 4.7,
    occasion: 'Свадьба',
    occasionIcon: '💍',
    tags: ['свадебный', 'золотой', 'минимализм'],
    likes: 634,
    saves: 259,
    repeats: 37,
    comments: 72,
    price: 22000,
    description: 'Свадебный торт с золотыми акцентами',
    height: 270,
  },
  {
    id: '10',
    image: 'https://images.unsplash.com/photo-1557925923-33b27b2c1816?w=600&q=85',
    author: 'Гульнар Мухамед.',
    authorAvatar: '',
    authorRating: 4.9,
    occasion: 'Просто так',
    occasionIcon: '🌸',
    tags: ['бенто', 'матча', 'японский'],
    likes: 491,
    saves: 203,
    repeats: 31,
    comments: 58,
    price: 5500,
    description: 'Бенто с кремом матча и белым шоколадом',
    height: 240,
    badge: 'trending',
  },
  {
    id: '11',
    image: 'https://images.unsplash.com/photo-1549312166-3b7cf6f1d5ef?w=600&q=85',
    author: 'Самал Карина',
    authorAvatar: '',
    authorRating: 4.8,
    occasion: 'Просто так',
    occasionIcon: '🌸',
    tags: ['ягодный', 'черника', 'нежный'],
    likes: 567,
    saves: 234,
    repeats: 29,
    comments: 66,
    price: 5900,
    description: 'Нежный торт с черничным компоте',
    height: 280,
  },
  {
    id: '12',
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&q=85',
    author: 'Роза Бекова',
    authorAvatar: '',
    authorRating: 4.7,
    occasion: 'День рождения',
    occasionIcon: '🎂',
    tags: ['минимализм', 'пастель', 'цветы'],
    likes: 423,
    saves: 178,
    repeats: 18,
    comments: 47,
    price: 4200,
    description: 'Минималистичный торт с цветочным декором',
    height: 250,
    badge: 'repeated',
  },
]

export const TRENDS: TrendItem[] = [
  { id: '1', label: 'Бенто-торт',    emoji: '🎁', count: 234, hot: true },
  { id: '2', label: 'Минимализм',    emoji: '🤍', count: 189, hot: true },
  { id: '3', label: 'Медовик',       emoji: '🍯', count: 312 },
  { id: '4', label: 'Ягодный',       emoji: '🍓', count: 278, hot: true },
  { id: '5', label: 'Велюр',         emoji: '✨', count: 156 },
  { id: '6', label: 'Свадебный',     emoji: '💍', count: 98  },
  { id: '7', label: 'Шоколадный',    emoji: '🍫', count: 201 },
  { id: '8', label: 'Без мастики',   emoji: '🌸', count: 134 },
  { id: '9', label: 'Кофейный',      emoji: '☕', count: 167 },
]

export const CATEGORIES: Category[] = [
  { id: 'cakes',    label: 'Торты',           image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', count: 142, gradient: ['#fce8ed', '#f5c6d4'] },
  { id: 'pastry',   label: 'Десерты',         image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&q=80', count: 87,  gradient: ['#fef9c3', '#fde68a'] },
  { id: 'bakery',   label: 'Выпечка',         image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&q=80', count: 64,  gradient: ['#dcfce7', '#bbf7d0'] },
  { id: 'gifts',    label: 'Подарки',         image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80', count: 38,  gradient: ['#ede9fe', '#ddd6fe'] },
  { id: 'author',   label: 'Авторские',       image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80', count: 56,  gradient: ['#ffedd5', '#fed7aa'] },
  { id: 'custom',   label: 'На заказ',        image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&q=80', count: 29,  gradient: ['#dbeafe', '#bfdbfe'] },
]

export const MOST_REPEATED: RepeatedDesign[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=85',
    name: 'Торт с ягодами',
    author: 'Айгуль Нурова',
    price: 6500,
    repeats: 56,
    ordersToday: 8,
    saves: 387,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500&q=85',
    name: 'Нежный розовый',
    author: 'Гульнар М.',
    price: 6500,
    repeats: 41,
    ordersToday: 6,
    saves: 198,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=85',
    name: 'Медовик классик',
    author: 'Самал Карина',
    price: 4500,
    repeats: 38,
    ordersToday: 5,
    saves: 221,
  },
]

export const CHEF_OF_WEEK: Chef = {
  id: '1',
  name: 'Айгуль Нурова',
  specialty: 'Свадебные и авторские торты',
  avatar: '',
  rating: 4.9,
  orders: 234,
  followers: 1820,
  bio: 'Создаю торты, которые становятся воспоминаниями. 8 лет в кондитерском искусстве — каждый заказ как произведение.',
  works: [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80',
    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&q=80',
    'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=300&q=80',
  ],
  badge: 'Кондитер недели',
}

export const SMART_PICKS: SmartPick[] = [
  { id: '1', label: 'До 5 000 ₸',    emoji: '💚', gradient: ['#dcfce7', '#bbf7d0'] },
  { id: '2', label: 'Детский',        emoji: '🎈', gradient: ['#dbeafe', '#bfdbfe'] },
  { id: '3', label: 'На свадьбу',     emoji: '💍', gradient: ['#fce8ed', '#f5d0de'] },
  { id: '4', label: 'Без мастики',    emoji: '🌸', gradient: ['#fef9c3', '#fde68a'] },
  { id: '5', label: 'Шоколадные',     emoji: '🍫', gradient: ['#ffedd5', '#fed7aa'] },
  { id: '6', label: 'Срочно',         emoji: '⚡', gradient: ['#ede9fe', '#ddd6fe'] },
  { id: '7', label: 'Ягодные',        emoji: '🍓', gradient: ['#fce8ed', '#f5d0de'] },
  { id: '8', label: 'Веганские',      emoji: '🌿', gradient: ['#dcfce7', '#bbf7d0'] },
]

export const LIVE_ACTIVITY: LiveEvent[] = [
  { id: '1', avatar: '', name: 'Алия',    action: 'сохранила',   target: '"Медовик с ягодами"',    time: '2 мин',  type: 'save'   },
  { id: '2', avatar: '', name: 'Гульнар', action: 'повторяет',   target: 'Торт с велюром',          time: '5 мин',  type: 'repeat' },
  { id: '3', avatar: '', name: 'Айгуль',  action: 'опубликовала', target: 'новую работу',            time: '12 мин', type: 'new'    },
  { id: '4', avatar: '', name: 'Майра',   action: 'заказала',    target: '"Свадебный трёхъярус."',  time: '18 мин', type: 'order'  },
]
