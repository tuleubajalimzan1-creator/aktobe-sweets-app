import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import { AppProvider } from '@/context/AppContext'
import { SettingsProvider } from '@/context/SettingsContext'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SettingsProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="notifications" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="wishlist"       options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="search"         options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="product"        options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="chef"           options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="trends"         options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="comments"       options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="settings"       options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        </Stack>
      </AppProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
})
