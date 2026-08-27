import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/avatar';

import { IconButton } from '@/components/ui/icon-button';
import { Colors,  AccentColors, BackgroundThemes, Spacing, Typography } from '@/constants/theme';
import { useClubDetails } from '../hooks/useClubDetails';

export function ClubDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const [isSubscribed, setIsSubscribed] = useState(false);

  const { data: club, isLoading, isError } = useClubDetails(id);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={AccentColors.bissap} />
      </View>
    );
  }

  if (isError || !club) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.light.text, fontFamily: Typography.corps.fontFamily }}>Impossible de charger le club.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: AccentColors.bissap, fontFamily: Typography.corpsGras.fontFamily }}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER IMAGE SECTION */}
        <View style={styles.headerImageContainer}>
          <Image
            source={club.coverUrl ? { uri: club.coverUrl } : require('@/assets/images/bg_home.jpeg')}
            style={styles.headerImage}
            contentFit="cover"
          />

          <View style={[styles.backButtonContainer, { top: Math.max(insets.top, 20) }]}>
            <IconButton iconName="chevron-back" variant="glass" onPress={() => router.back()} />
          </View>
        </View>

        {/* OVERLAPPING CONTENT CARD */}
        <View style={styles.contentCard}>
          {/* Avatar over the border */}
          <View style={styles.avatarWrapper}>
            {club.logoUrl ? (
              <Image source={{ uri: club.logoUrl }} style={{ width: 64, height: 64, borderRadius: 32 }} />
            ) : (
              <Avatar initials={club.name.substring(0, 2).toUpperCase()} size={64} backgroundColor="#f2784f" />
            )}
          </View>

          {/* Club Info */}
          <View style={styles.titleRow}>
            <Text style={styles.clubName}>{club.name}</Text>
            <Ionicons name="checkmark-circle" size={18} color="#3b82f6" style={{ marginLeft: 4 }} />
          </View>

          <Text style={styles.description}>
            {club.bio || 'Aucune description fournie pour ce club.'}
          </Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{club._count?.members || 0}</Text>
              <Text style={styles.statLabel}>membres</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{club._count?.events || 0}</Text>
              <Text style={styles.statLabel}>events</Text>
            </View>

          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.followButton, isSubscribed && styles.subscribedButton]}
              onPress={() => setIsSubscribed(!isSubscribed)}
            >
              {isSubscribed ? (
                <Text style={styles.subscribedText}>✓ Abonné</Text>
              ) : (
                <Text style={styles.followButtonText}>Suivre le club</Text>
              )}
            </TouchableOpacity>
            <View style={{ width: Spacing.space12 }} />
          </View>



        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundThemes.Ivoire,
  },
  headerImageContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  backButtonContainer: {
    position: 'absolute',
    left: Spacing.space20,
    zIndex: 10,
  },
  contentCard: {
    backgroundColor: BackgroundThemes.Ivoire,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.space20,
    paddingBottom: 40,
    marginTop: -24,
    position: 'relative',
  },
  avatarWrapper: {
    marginTop: -32,
    marginBottom: Spacing.space12,
    borderWidth: 4,
    borderColor: BackgroundThemes.Ivoire,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space8,
  },
  clubName: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 24,
    color: Colors.light.text,
  },
  description: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: '#65625e',
    lineHeight: 20,
    marginBottom: Spacing.space20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.space24,
  },
  statItem: {
    marginRight: Spacing.space32,
  },
  statValue: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space32,
  },
  followButton: {
    flex: 1,
    backgroundColor: AccentColors.bissap,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#ffffff',
  },
  subscribedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.backgroundElement,
  },
  subscribedText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  sectionTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: Spacing.space16,
  },
});
