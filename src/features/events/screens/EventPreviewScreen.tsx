import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EventPreviewCard } from '@/components/ui/event-preview-card';
import { FeatureCheckItem } from '@/components/ui/feature-check-item';
import { Colors,  AccentColors, Spacing, Typography } from '@/constants/theme';
import { formatTime, getDayLabel, formatPrice } from '@/core/utils/locale';
import { getOrganizerDisplay } from '@/core/utils/user';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useEventCreationStore } from '@/features/creation/store/useEventCreationStore';
import { useAllSports } from '@/features/sports/hooks/useSports';
import { useQueryClient } from '@tanstack/react-query';
import { EventsApi } from '../api/events.api';

export function EventPreviewScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { user } = useAuth();

  // Zustand Store selectors
  const title = useEventCreationStore((state) => state.title);
  const description = useEventCreationStore((state) => state.description);
  const sportId = useEventCreationStore((state) => state.sportId);
  const startsAt = useEventCreationStore((state) => state.startsAt);
  const venueName = useEventCreationStore((state) => state.venueName);
  const capacity = useEventCreationStore((state) => state.capacity);
  const price = useEventCreationStore((state) => state.price);
  const coords = useEventCreationStore((state) => state.coords);
  const googlePlaceId = useEventCreationStore((state) => state.googlePlaceId);
  const city = useEventCreationStore((state) => state.city);
  const country = useEventCreationStore((state) => state.country);
  const resetStore = useEventCreationStore((state) => state.resetStore);

  // Load sports to match name and color
  const { data: sportsList = [] } = useAllSports();
  const selectedSport = sportsList.find((s) => s.id === sportId);

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // 1. Create the event
      const created = await EventsApi.createEvent({
        title,
        description: description || undefined,
        sportId,
        startsAt,
        venueName,
        capacity,
        price,
        coords,
        googlePlaceId,
        city,
        country,
      });

      // 2. Publish it immediately
      await EventsApi.publishEvent(created.id);

      // 3. Invalidate React Query events list cache to trigger refresh
      queryClient.invalidateQueries({ queryKey: ['events'] });

      // 4. Clean Zustand creation state
      resetStore();

      // 5. Navigate to SuccessScreen
      router.push('/creation/success' as any);
    } catch (err) {
      console.error('Erreur publication événement:', err);
      const message = err instanceof Error ? err.message : "Impossible de publier l'événement pour le moment. Veuillez réessayer.";
      Alert.alert(
        'Erreur de publication',
        message
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const { name: organizerName, initials: organizerInitials } = getOrganizerDisplay({
    firstName: user?.firstName || null,
    lastName: user?.lastName || null,
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()} disabled={isPublishing}>
          <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Aperçu</Text>

        <Text style={styles.stepText}>2/2</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Voilà ce que les sportifs verront dans le feed 👇
        </Text>

        <EventPreviewCard
          title={title}
          price={formatPrice(price)}
          time={formatTime(startsAt)}
          location={venueName}
          organizerInitials={organizerInitials}
          organizerName={organizerName}
          places={capacity ? `${capacity}` : 'illimité'}
          sportLabel={selectedSport?.labelFr || 'Sport'}
          sportColor={selectedSport?.color || Colors.light.text}
          dateLabel={getDayLabel(startsAt)}
          timeLabel={formatTime(startsAt)}
        />

        <View style={styles.featuresList}>
          <FeatureCheckItem label="Visible dans Explorer et sur la carte" />
          <FeatureCheckItem label={price > 0 ? `Paiement Mobile Money activé · ${formatPrice(price)}` : 'Gratuit pour tous les participants'} />
          <FeatureCheckItem label="Discussion de groupe créée automatiquement" />
        </View>
      </ScrollView>

      {/* BOTTOM ACTIONS */}
      <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
          disabled={isPublishing}
        >
          <Text style={styles.secondaryButtonText}>Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, isPublishing && styles.disabledButton]}
          activeOpacity={0.8}
          onPress={handlePublish}
          disabled={isPublishing}
        >
          {isPublishing ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.primaryButtonText}>Publier l'event 🚀</Text>
          )}
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#ffffff',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e3e3e1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  stepText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
  },
  scrollContent: {
    padding: Spacing.space20,
  },
  subtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: '#65625e',
    textAlign: 'center',
    marginBottom: Spacing.space20,
  },
  featuresList: {
    paddingHorizontal: Spacing.space8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space16,
    flexDirection: 'row',
    gap: Spacing.space12,
    backgroundColor: Colors.light.backgroundElement,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e3e3e1',
  },
  secondaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
  },
  primaryButton: {
    flex: 1.5,
    backgroundColor: AccentColors.bissap,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AccentColors.bissap,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
    backgroundColor: Colors.light.ink3,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: '#ffffff',
  },
});
