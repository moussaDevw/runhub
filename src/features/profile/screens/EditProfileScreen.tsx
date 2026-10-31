import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/components/ui/avatar';
import { FormInput } from '@/components/ui/form-input';
import { Colors, AccentColors, Spacing, Typography } from '@/constants/theme';
import { HStack, Screen } from '@/components/layout';
import { useTheme } from '@/hooks/use-theme';
import { useEditProfile } from '@/features/profile/hooks/useEditProfile';

export function EditProfileScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    name,
    setName,
    username,
    setUsername,
    location,
    setLocation,
    bio,
    setBio,
    email,
    setEmail,
    avatarUrl,
    isUploadingAvatar,
    handlePickAvatar,
    isSaving,
    initials,
    handleSave,
    router,
  } = useEditProfile();

  const header = (
    <HStack align="center" justify="space-between" style={[styles.header, { backgroundColor: theme.backgroundElement, borderBottomColor: theme.line }]}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.headerButton}
        disabled={isSaving}
        hitSlop={8}
        accessibilityRole="button"
      >
        <Text style={[styles.cancelText, { color: theme.textSecondary }]}>{t('common.cancel')}</Text>
      </TouchableOpacity>

      <Text style={[styles.headerTitle, { color: theme.text }]}>{t('editProfile.title')}</Text>

      <TouchableOpacity
        onPress={handleSave}
        style={[styles.headerButton, { alignItems: 'flex-end' }]}
        disabled={isSaving}
        hitSlop={8}
        accessibilityRole="button"
      >
        {isSaving ? (
          <ActivityIndicator size="small" color={AccentColors.bissap} />
        ) : (
          <Text style={styles.saveText}>{t('editProfile.save')}</Text>
        )}
      </TouchableOpacity>
    </HStack>
  );

  return (
    <Screen
      safeTop
      safeBottom
      scrollable
      keyboardAvoiding
      header={header}
      backgroundColor={theme.backgroundElement}
      contentContainerStyle={styles.scrollContent}
    >
      <Stack.Screen options={{ headerShown: false, presentation: 'modal' }} />

      {/* AVATAR SECTION */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          style={styles.avatarWrapper}
          activeOpacity={0.8}
          onPress={handlePickAvatar}
          disabled={isUploadingAvatar}
        >
          <Avatar uri={avatarUrl} initials={initials} size={96} backgroundColor={AccentColors.bissap} />
          <View style={styles.cameraBadge}>
            {isUploadingAvatar ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Ionicons name="camera" size={16} color="#ffffff" />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.changePhotoButton}
          accessibilityRole="button"
          onPress={handlePickAvatar}
          disabled={isUploadingAvatar}
        >
          <Text style={styles.changePhotoText}>
            {isUploadingAvatar ? t('common.loading', { defaultValue: 'Chargement...' }) : t('editProfile.changePhoto')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* FORM FIELDS */}
      <FormInput
        label={t('editProfile.nameLabel')}
        value={name}
        onChangeText={setName}
      />
      <FormInput
        label={t('editProfile.usernameLabel')}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <FormInput
        label={t('editProfile.locationLabel')}
        value={location}
        onChangeText={setLocation}
      />
      <FormInput
        label={t('editProfile.bioLabel')}
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <FormInput
        label={t('editProfile.emailLabel')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </Screen>
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
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e1',
    backgroundColor: Colors.light.backgroundElement,
  },
  headerButton: {
    minWidth: 60,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
  },
  cancelText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 16,
    color: '#65625e',
  },
  saveText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: AccentColors.bissap,
    textAlign: 'right',
  },
  scrollContent: {
    padding: Spacing.space20,
    paddingBottom: 60,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.space32,
    marginTop: Spacing.space12,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: Spacing.space12,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.text,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.light.backgroundElement,
  },
  changePhotoButton: {
    paddingVertical: 4,
  },
  changePhotoText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: AccentColors.bissap,
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
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.space8,
  },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.text,
    borderRadius: 99,
    paddingHorizontal: Spacing.space16,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  sportDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  sportChipText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: '#ffffff',
  },
  addSportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3e3e1',
    borderRadius: 99,
    paddingHorizontal: Spacing.space16,
    paddingVertical: 10,
    marginBottom: 8,
  },
  addSportText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: '#65625e',
  },
});
