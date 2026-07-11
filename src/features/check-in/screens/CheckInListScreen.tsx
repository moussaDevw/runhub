import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors,  AccentColors, Spacing, Typography } from '@/constants/theme';
import { CheckInProgress } from '@/components/ui/check-in-progress';
import { ParticipantRow, ParticipantStatus } from '@/components/ui/participant-row';

const mockParticipants = [
  { id: '1', name: 'Aïssatou Diallo', initials: 'AD', color: '#f2784f', payment: 'Payé · 2 000 F', status: 'Arrivé' },
  { id: '2', name: 'Moussa Sow', initials: 'MS', color: '#2f6b4d', payment: 'Payé · 2 000 F', status: 'Arrivé' },
  { id: '3', name: 'Fatou Ndiaye', initials: 'FN', color: '#b8324f', payment: 'Payé · 2 000 F', status: 'À venir' },
  { id: '4', name: 'Khadim Ba', initials: 'KB', color: '#8a5c9f', payment: 'Payé · 2 000 F', status: 'À venir' },
  { id: '5', name: 'Ousmane Sy', initials: 'OS', color: '#d98b2b', payment: 'Payé · 2 000 F', status: 'Arrivé' },
  { id: '6', name: 'Ramatoulaye C.', initials: 'RC', color: '#e06d3d', payment: 'Invité', status: 'À venir' },
];

export function CheckInListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>Foot à 5 du jeudi</Text>
          <Text style={styles.headerSubtitle}>Check-in · JEU 20:00</Text>
        </View>

        <View style={styles.orgaBadge}>
          <Text style={styles.orgaText}>ORGA</Text>
        </View>
      </View>

      {/* PROGRESS SECTION */}
      <CheckInProgress current={3} total={6} />

      {/* PARTICIPANTS LIST */}
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]} // Space for floating button
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>PARTICIPANTS</Text>
        
        {mockParticipants.map((p) => (
          <ParticipantRow 
            key={p.id}
            name={p.name}
            initials={p.initials}
            avatarColor={p.color}
            paymentStatus={p.payment}
            status={p.status as ParticipantStatus}
            onCheckInToggle={() => {}}
          />
        ))}
      </ScrollView>

      {/* FLOATING BUTTON */}
      <View style={[styles.floatingButtonContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity 
          style={styles.floatingButton} 
          activeOpacity={0.8}
          onPress={() => router.push('/scan' as any)}
        >
          <Ionicons name="scan-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.floatingButtonText}>Scanner les billets</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f4', // Overall light grey background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.space16,
    paddingBottom: Spacing.space16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: '#65625e',
    marginTop: 2,
  },
  orgaBadge: {
    borderWidth: 1,
    borderColor: AccentColors.bissap,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  orgaText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 8,
    color: AccentColors.bissap,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space16,
  },
  sectionTitle: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.space12,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.space20,
  },
  floatingButton: {
    backgroundColor: AccentColors.bissap,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    shadowColor: AccentColors.bissap,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  floatingButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: '#ffffff',
  },
});
