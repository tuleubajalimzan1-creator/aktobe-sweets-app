import React, { useRef } from 'react'
import { ScrollView, StyleSheet, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import AppHeader       from '@/components/layout/AppHeader'
import HeroSection     from '@/components/home/HeroSection'
import QuickActions    from '@/components/home/QuickActions'
import SocialFeedPreview from '@/components/home/SocialFeedPreview'
import TrendsSection   from '@/components/home/TrendsSection'
import CategoriesGrid  from '@/components/home/CategoriesGrid'
import MostRepeated    from '@/components/home/MostRepeated'
import ChefOfWeek      from '@/components/home/ChefOfWeek'
import SmartPicks      from '@/components/home/SmartPicks'
import LiveActivity    from '@/components/home/LiveActivity'
import TrustSection    from '@/components/home/TrustSection'
import FinalCTA        from '@/components/home/FinalCTA'
import { COLORS } from '@/constants/theme'

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader scrollY={scrollY} notifCount={3} />

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <HeroSection />
        <QuickActions />
        <TrendsSection />
        <CategoriesGrid />
        <SocialFeedPreview />
        <MostRepeated />
        <ChefOfWeek />
        <SmartPicks />
        <LiveActivity />
        <TrustSection />
        <FinalCTA />
      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 100, // bottom nav clearance
  },
})
