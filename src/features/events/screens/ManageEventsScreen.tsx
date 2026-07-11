import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ManagedEventCard } from '@/components/ui/managed-event-card';
import { Colors,  AccentColors, Spacing, Typography } from '@/constants/theme';

export function ManageEventsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Mes events créés</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(tabs)/creer' as any)}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ManagedEventCard
          status="EN COURS"
          dateDay="JEU"
          dateTime="20:00"
          title="Foot à 5 du jeudi"
          location="Stade Iba Mar Diop"
          imageSource={require('@/assets/images/bg_home.jpeg')}
          inscribedCount={9}
          maxCapacity={10}
          revenue={18000}
          isFree={false}
          onCheckInPress={() => router.push('/check-in/1' as any)}
        />

        <ManagedEventCard
          status="À VENIR"
          dateDay="MAR"
          dateTime="18:30"
          title="Sunset Run · Corniche"
          location="Corniche Ouest"
          imageSource={require('@/assets/images/onboarding_bg.png')}
          inscribedCount={32}
          maxCapacity={40}
          isFree={true}
        />

        <ManagedEventCard
          status="TERMINÉ"
          dateDay="DIM"
          dateTime="19:00"
          title="Playground 3v3"
          location="Terrain Médina"
          imageSource={require('@/assets/images/bg_home.jpeg')}
          inscribedCount={12}
          maxCapacity={18}
          isFree={true}
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundElement,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space16,
    paddingBottom: Spacing.space16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AccentColors.bissap,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.space20,
    paddingBottom: 60,
  },
});
