import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors, Spacing, Typography } from '@/constants/theme';
import { ManageEventsCard } from '@/components/ui/manage-events-card';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ClubEventRow } from '@/components/ui/club-event-row';

export function AgendaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
      >
        <Text style={styles.pageTitle}>Mon agenda</Text>

        <ManageEventsCard count={3} onPress={() => router.push('/manage-events' as any)} />

        <SegmentedControl 
          options={['À venir', 'Passés']} 
          selectedIndex={selectedTab} 
          onChange={setSelectedTab} 
        />

        <Text style={styles.sectionTitle}>CETTE SEMAINE</Text>

        <ClubEventRow 
          dateDay="AUJ."
          dateTime="18h"
          title="Sunset Run · Corniche"
          location="Corniche Ouest"
          imageSource={require('@/assets/images/bg_home.jpeg')}
          onPress={() => router.push('/event/1')}
        />
        
        <ClubEventRow 
          dateDay="SAM"
          dateTime="07h"
          title="Yoga au lever du soleil"
          location="Plage de Yoff"
          imageSource={require('@/assets/images/onboarding_bg.png')}
          onPress={() => {}}
        />

        <ClubEventRow 
          dateDay="JEU"
          dateTime="20h"
          title="Foot à 5 du jeudi"
          location="Stade Iba Mar Diop"
          imageSource={require('@/assets/images/bg_home.jpeg')}
          onPress={() => {}}
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f4',
  },
  scrollContent: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space12,
  },
  pageTitle: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: Spacing.space24,
  },
  sectionTitle: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.space12,
    marginLeft: 4,
  },
});
