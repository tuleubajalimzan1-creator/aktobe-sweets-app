import { Tabs } from 'expo-router'
import CustomTabBar from '@/components/layout/CustomTabBar'

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"       options={{ title: 'Главная'    }} />
      <Tabs.Screen name="feed"        options={{ title: 'Лента'      }} />
      <Tabs.Screen name="build"       options={{ title: 'Конструктор' }} />
      <Tabs.Screen name="orders"      options={{ title: 'Заказы'     }} />
      <Tabs.Screen name="profile"     options={{ title: 'Профиль'    }} />
    </Tabs>
  )
}
