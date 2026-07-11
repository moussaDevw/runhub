import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/avatar';
import { ClubEventRow } from '@/components/ui/club-event-row';
import { IconButton } from '@/components/ui/icon-button';
import { Colors,  AccentColors, BackgroundThemes, Spacing, Typography } from '@/constants/theme';

export function ClubDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER IMAGE SECTION */}
        <View style={styles.headerImageContainer}>
          <Image
            source={require('@/assets/images/bg_home.jpeg')}
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
            <Avatar initials="DA" size={64} backgroundColor="#f2784f" />
          </View>

          {/* Club Info */}
          <View style={styles.titleRow}>
            <Text style={styles.clubName}>Dakar Runners</Text>
            <Ionicons name="checkmark-circle" size={18} color="#3b82f6" style={{ marginLeft: 4 }} />
          </View>

          <Text style={styles.description}>
            Club de running communautaire · Dakar. On court ensemble 3 fois par semaine, tous niveaux bienvenus.
          </Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1 240</Text>
              <Text style={styles.statLabel}>membres</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>86</Text>
              <Text style={styles.statLabel}>events</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>★ 4,9</Text>
              <Text style={styles.statLabel}>note</Text>
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

          {/* EVENTS SECTION */}
          <Text style={styles.sectionTitle}>Ses prochains events</Text>

          <ClubEventRow
            dateDay="AUJ."
            dateTime="18h"
            title="Sunset Run · Corniche"
            location="Corniche Ouest"
            imageSource={require('@/assets/images/bg_home.jpeg')}
            onPress={() => router.push('/event/1')}
          />
          <ClubEventRow
            dateDay="DIM"
            dateTime="07h"
            title="Trail des Mamelles"
            location="Plage de Yoff"
            imageSource={require('@/assets/images/bg_home.jpeg')}
          />
          <ClubEventRow
            dateDay="LUN"
            dateTime="20h"
            title="Run récup · easy 5k"
            location="Stade Iba Mar Diop"
            imageSource={require('@/assets/images/bg_home.jpeg')}
          />

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
