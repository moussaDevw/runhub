import { ProfileHeaderCard } from '@/components/ui/profile-header-card';
import { SettingsRow } from '@/components/ui/settings-row';
import { SPORT_ICONS } from '@/components/ui/sport-card';
import { Colors, Spacing, Typography, AccentColors } from '@/constants/theme';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useMyClubs } from '@/features/clubs/hooks/useMyClubs';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
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
    handleLogout,
    handleRemoveSport,
    deletingSportId,
    router,
  } = useProfile();

  const { data: myClubs, isLoading: isLoadingClubs } = useMyClubs();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
      >
        <ProfileHeaderCard
          name={fullName}
          username={displayUsername}
          email={displayEmail}
          initials={initials}
          avatarColor="#b8324f"
          onPress={() => router.push('/edit-profile' as any)}
        />

        {/* MES SPORTS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>{t('profile.mySports')}</Text>
          <TouchableOpacity onPress={() => router.push('/sports' as any)}>
            <Text style={styles.editSportsText}>{t('profile.modify')}</Text>
          </TouchableOpacity>
        </View>
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
        <View style={[styles.sectionHeaderRow, { marginTop: Spacing.space24 }]}>
          <Text style={styles.sectionHeader}>Mes Clubs</Text>
          <TouchableOpacity onPress={() => router.push('/club/create' as any)}>
            <Text style={styles.editSportsText}>Créer</Text>
          </TouchableOpacity>
        </View>
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
                  <Text style={styles.clubRole}>{club.role === 'OWNER' ? 'Propriétaire' : club.role === 'ADMIN' ? 'Admin' : 'Membre'}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptySportsContainer}>
              <Ionicons name="people-outline" size={32} color={Colors.light.ink3} style={{ marginBottom: 8 }} />
              <Text style={styles.noSportsText}>Aucun club rejoint</Text>
              <Text style={styles.noSportsSubtitle}>Trouvez un club ou créez le vôtre !</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/club/create' as any)}
                style={styles.addSportsButtonInline}
              >
                <Ionicons name="add" size={16} color="#ffffff" style={{ marginRight: 4 }} />
                <Text style={styles.addSportsButtonLabelInline}>Créer un club</Text>
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
          iconName="globe-outline"
          title={t('profile.language')}
          subtitle={i18n.language.startsWith('fr') ? 'Français' : 'English'}
          onPress={() => {
            const nextLang = i18n.language.startsWith('fr') ? 'en' : 'fr';
            i18n.changeLanguage(nextLang);
          }}
        />

        {/* COMPTE */}
        <Text style={[styles.sectionHeader, { marginTop: Spacing.space24 }]}>{t('profile.account')}</Text>
        <SettingsRow
          iconName="card-outline"
          title={t('profile.paymentMethods')}
          subtitle="Wave · 77 123 45 67"
          onPress={() => { }}
        />
        <SettingsRow
          iconName="lock-closed-outline"
          title={t('profile.privacy')}
          subtitle={t('profile.privacyDesc')}
          onPress={() => { }}
        />
        <SettingsRow
          iconName="shield-checkmark-outline"
          title={t('profile.securityAndPassword')}
          onPress={() => { }}
        />

        {/* SUPPORT */}
        <Text style={[styles.sectionHeader, { marginTop: Spacing.space24 }]}>{t('profile.support')}</Text>
        <SettingsRow
          iconName="help-outline"
          title={t('profile.helpAndContact')}
          onPress={() => { }}
        />
        <SettingsRow
          iconName="arrow-forward-outline"
          title={t('profile.termsAndPrivacy')}
          onPress={() => { }}
        />
        <SettingsRow
          iconName="log-out-outline"
          title={t('profile.logout')}
          type="none"
          isDestructive={true}
          onPress={handleLogout}
        />

      </ScrollView>
    </View>
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
});
