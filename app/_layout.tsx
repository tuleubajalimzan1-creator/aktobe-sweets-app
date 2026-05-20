import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AppProvider } from '@/context/AppContext'
import { SettingsProvider } from '@/context/SettingsContext'
import { UserProvider, useUser } from '@/context/UserContext'
import AuthScreen from '@/components/auth/AuthScreen'
import { COLORS } from '@/constants/theme'

function AuthGate() {
  const { isAuthenticated, isLoaded } = useUser()

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: COLORS.cream }} />
  }

  if (!isAuthenticated) {
    return <AuthScreen />
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="notifications" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="wishlist"      options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="search"        options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="product"       options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="chef"          options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="trends"        options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="comments"      options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="settings"      options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="profile-edit"  options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="addresses"     options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="payment"       options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="repeats"       options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="reviews"       options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="referral"      options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="support"       options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="faq"           options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </>
  )
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SettingsProvider>
        <UserProvider>
          <AppProvider>
            <AuthGate />
          </AppProvider>
        </UserProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({ root: { flex: 1 } })
