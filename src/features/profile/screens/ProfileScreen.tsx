import { TabSwitcher } from '@/components/ui/strava-tabs';
import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { useMyClubs } from '@/features/clubs/hooks/useMyClubs';
import { FitnessStatsCard, HealthConnectModal, useHealthData } from '@/features/health';
import { registerForPushNotificationsAsync } from '@/features/notifications/services/push-notifications.service';
import { ProfileAgendaTab, ProfileHeaderCard, SettingsRow } from '@/features/profile/components';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { SPORT_ICONS } from '@/features/sports/components';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { HStack, Screen, Spacer } from '@/components/layout';
import { useTheme } from '@/hooks/use-theme';

export function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeProfileTab, setActiveProfileTab] = useState<'agenda' | 'settings'>(
    tab === 'settings' ? 'settings' : 'agenda'
  );
  const [showHealthModal, setShowHealthModal] = useState(false);
  const { provider, data: healthData } = useHealthData();
  const {
    user,
    fullName,
    displayUsername,
    displayEmail,
    initials,
    notificationsEnabled,
    setNotificationsEnabled,
    locationEnabled,
    setLocationEnabled,
    ecoModeEnabled,
    setEcoModeEnabled,
    updateLanguage,
    handleLogout,
    isLoggingOut,
    handleDeleteAccount,
    isDeletingAccount,
    handleRemoveSport,
    deletingSportId,
    router,
  } = useProfile();

  const { data: myClubs, isLoading: isLoadingClubs } = useMyClubs();

  const handleContactSupport = () => {
    Linking.openURL('mailto:contact@musatech.tech?subject=Support%20RunHub').catch((err) => {
      console.warn('Impossible d’ouvrir le client mail:', err);
    });
  };

  const handleOpenPrivacy = () => {
    WebBrowser.openBrowserAsync('https://musatech.tech/privacy').catch((err) => {
      console.warn('Impossible d’ouvrir le navigateur:', err);
    });
  };

  return (
    <Screen
      safeTop
      safeBottom={false}
      scrollable
      contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
    >
      {/* Top Navigation Bar with Back Button */}
      <HStack align="center" justify="space-between" style={styles.navBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)/explorer');
            }
          }}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: theme.text }]}>Mon profil</Text>
        <View style={{ width: 36 }} />
      </HStack>

      <Spacer size={Spacing.space8} />

      <ProfileHeaderCard
        name={fullName}
        username={displayUsername}
        email={displayEmail}
        initials={initials}
        avatarColor={AccentColors.bissap}
        avatarUrl={user?.avatarUrl}
        onPress={() => router.push('/edit-profile' as any)}
      />

      <Spacer size={Spacing.space16} />

      {/* FITNESS & HEALTH STATS */}
      <FitnessStatsCard onPressConnect={() => setShowHealthModal(true)} />

      <Spacer size={Spacing.space16} />

      {/* TAB SWITCHER */}
      <TabSwitcher
        options={[
          t('profile.tabAgenda', { defaultValue: 'Mon agenda' }),
          t('profile.tabSettings', { defaultValue: 'Clubs & Réglages' }),
        ]}
        selectedIndex={activeProfileTab === 'agenda' ? 0 : 1}
        onChange={(index) => setActiveProfileTab(index === 0 ? 'agenda' : 'settings')}
      />

      {activeProfileTab === 'agenda' ? (
        <ProfileAgendaTab />
      ) : (
        <View style={{ marginTop: Spacing.space16 }}>
          {/* MES SPORTS */}
          <HStack align="center" justify="space-between" style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionHeader, { color: theme.ink3 }]}>{t('profile.mySports')}</Text>
            <TouchableOpacity onPress={() => router.push('/sports' as any)} hitSlop={8} accessibilityRole="button">
              <Text style={styles.editSportsText}>{t('profile.modify')}</Text>
            </TouchableOpacity>
          </HStack>
          <View style={styles.sportsContainer}>
            {user?.sports && user.sports.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sportsScrollContent}
              >
                {user.sports.map((sport) => {
                  const iconName = (SPORT_ICONS[sport.slug] || 'run') as any;
                  const isDeleting = deletingSportId === sport.id;
                  return (
                    <View key={sport.id} style={[styles.sportChip, { backgroundColor: sport.color || Colors.light.text }]}>
                      <MaterialCommunityIcons name={iconName} size={14} color="#ffffff" style={styles.sportIcon} />
                      <Text style={styles.sportLabel}>{sport.labelFr}</Text>
                      {isDeleting ? (
                        <ActivityIndicator size="small" color="#ffffff" style={{ marginLeft: 6, transform: [{ scale: 0.8 }] }} />
                      ) : (
                        <TouchableOpacity
                          onPress={() => handleRemoveSport(sport.id)}
                          disabled={deletingSportId !== null}
                          style={styles.removeSportButton}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons name="close-circle" size={14} color="rgba(255, 255, 255, 0.75)" />
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            ) : (
              <View style={styles.emptySportsContainer}>
                <MaterialCommunityIcons name="trophy-outline" size={32} color={Colors.light.ink3} style={{ marginBottom: 8 }} />
                <Text style={styles.noSportsText}>{t('profile.noSportsSelected')}</Text>
                <Text style={styles.noSportsSubtitle}>{t('profile.noSportsSelectedSubtitle')}</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/sports' as any)}
                  style={styles.addSportsButtonInline}
                >
                  <Ionicons name="add" size={16} color="#ffffff" style={{ marginRight: 4 }} />
                  <Text style={styles.addSportsButtonLabelInline}>{t('profile.addSports')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* MES CLUBS */}
          <HStack align="center" justify="space-between" style={[styles.sectionHeaderRow, { marginTop: Spacing.space24 }]}>
            <Text style={[styles.sectionHeader, { color: theme.ink3 }]}>{t('profile.myClubs')}</Text>
            <TouchableOpacity onPress={() => router.push('/club/create' as any)} hitSlop={8} accessibilityRole="button">
              <Text style={styles.editSportsText}>{t('profile.create')}</Text>
            </TouchableOpacity>
          </HStack>
          <View style={styles.sportsContainer}>
            {isLoadingClubs ? (
              <ActivityIndicator size="small" color={AccentColors.bissap} style={{ padding: 20 }} />
            ) : myClubs && myClubs.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sportsScrollContent}
              >
                {myClubs.map((club) => (
                  <TouchableOpacity
                    key={club.id}
                    activeOpacity={0.8}
                    onPress={() => router.push(`/club/${club.id}` as any)}
                    style={styles.clubCard}
                  >
                    {club.logoUrl ? (
                      <Image source={{ uri: club.logoUrl }} style={styles.clubLogo} />
                    ) : (
                      <View style={[styles.clubLogo, styles.clubLogoPlaceholder]}>
                        <Text style={styles.clubLogoText}>{club.name.substring(0, 2).toUpperCase()}</Text>
                      </View>
                    )}
                    <Text style={styles.clubName} numberOfLines={1}>{club.name}</Text>
                    <Text style={styles.clubRole}>
                      {club.role === 'OWNER' ? t('profile.owner') : club.role === 'ADMIN' ? t('profile.admin') : t('profile.member')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptySportsContainer}>
                <Ionicons name="people-outline" size={32} color={Colors.light.ink3} style={{ marginBottom: 8 }} />
                <Text style={styles.noSportsText}>{t('profile.noClubsJoined')}</Text>
                <Text style={styles.noSportsSubtitle}>{t('profile.noClubsSubtitle')}</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/club/create' as any)}
                  style={styles.addSportsButtonInline}
                >
                  <Ionicons name="add" size={16} color="#ffffff" style={{ marginRight: 4 }} />
                  <Text style={styles.addSportsButtonLabelInline}>{t('profile.createClub')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* PRÉFÉRENCES */}
          <Text style={[styles.sectionHeader, { marginTop: Spacing.space24 }]}>{t('profile.preferences')}</Text>
          <SettingsRow
            iconName="notifications-outline"
            title={t('profile.notifications')}
            subtitle={t('profile.notificationsDesc')}
            type="toggle"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <SettingsRow
            iconName="location-outline"
            title={t('profile.location')}
            subtitle={t('profile.locationDesc')}
            type="toggle"
            value={locationEnabled}
            onValueChange={setLocationEnabled}
          />
          <SettingsRow
            iconName="flash-outline"
            title={t('profile.ecoMode')}
            subtitle={t('profile.ecoModeDesc')}
            type="toggle"
            value={ecoModeEnabled}
            onValueChange={setEcoModeEnabled}
          />
          <SettingsRow
            iconName="heart-circle-outline"
            title={provider === 'apple_health' ? 'Apple Santé' : 'Google Santé Connect'}
            subtitle={healthData?.isConnected ? 'Synchronisé' : 'Non connecté'}
            onPress={() => setShowHealthModal(true)}
          />
          <SettingsRow
            iconName="globe-outline"
            title={t('profile.language')}
            subtitle={i18n.language.startsWith('fr') ? 'Français' : 'English'}
            onPress={() => {
              const nextLang = i18n.language.startsWith('fr') ? 'en' : 'fr';
              i18n.changeLanguage(nextLang);
              updateLanguage(nextLang);
              registerForPushNotificationsAsync().catch(() => {});
            }}
          />

          {/* SUPPORT */}
          <Text style={[styles.sectionHeader, { marginTop: Spacing.space24 }]}>{t('profile.support')}</Text>
          <SettingsRow
            iconName="help-outline"
            title={t('profile.helpAndContact')}
            subtitle="contact@musatech.tech"
            onPress={handleContactSupport}
          />
          <SettingsRow
            iconName="shield-checkmark-outline"
            title={t('profile.termsAndPrivacy')}
            onPress={handleOpenPrivacy}
          />

          {/* COMPTE */}
          <Text style={[styles.sectionHeader, { marginTop: Spacing.space24 }]}>{t('profile.account')}</Text>
          <SettingsRow
            iconName="log-out-outline"
            title={t('profile.logout')}
            type="none"
            isDestructive={true}
            isLoading={isLoggingOut}
            onPress={handleLogout}
          />
          <SettingsRow
            iconName="trash-outline"
            title={t('profile.deleteAccount')}
            subtitle={t('profile.deleteAccountDesc')}
            type="none"
            isDestructive={true}
            isLoading={isDeletingAccount}
            onPress={handleDeleteAccount}
          />

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>RunHub v1.0.0 (Dakar)</Text>
          </View>
        </View>
      )}

      <HealthConnectModal
        visible={showHealthModal}
        onClose={() => setShowHealthModal(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f0',
  },
  scrollContent: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space20,
  },
  sectionHeader: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space12,
  },
  editSportsText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 11,
    color: '#b8324f',
    marginRight: 4,
  },
  sportsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: Spacing.space16,
    marginBottom: Spacing.space8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sportsScrollContent: {
    flexDirection: 'row',
    gap: 8,
  },
  emptySportsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.space12,
  },
  noSportsSubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.space16,
    paddingHorizontal: Spacing.space12,
  },
  addSportsButtonInline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b8324f', // bissap color
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addSportsButtonLabelInline: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 12,
    color: '#ffffff',
  },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  sportIcon: {
    marginRight: 6,
  },
  sportLabel: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 12,
    color: '#ffffff',
  },
  removeSportButton: {
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSportsText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
  clubCard: {
    width: 100,
    marginRight: Spacing.space12,
    alignItems: 'center',
  },
  clubLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    backgroundColor: '#f2f2f0',
  },
  clubLogoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AccentColors.bissap,
  },
  clubLogoText: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 20,
    color: '#ffffff',
  },
  clubName: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: Colors.light.text,
    textAlign: 'center',
  },
  clubRole: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textAlign: 'center',
    marginTop: 2,
  },
  navBar: {
    paddingHorizontal: Spacing.space4,
    paddingVertical: Spacing.space8,
    marginBottom: Spacing.space8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
  },
  versionContainer: {
    paddingVertical: Spacing.space24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    letterSpacing: 0.5,
  },
});
