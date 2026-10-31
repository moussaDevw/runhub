import { IconButton } from '@/components/ui/icon-button';
import { BackgroundThemes, Colors, Spacing, Typography, AccentColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FormInput } from '@/components/ui/form-input';
import { ImageUploadPlaceholder } from '@/components/ui/image-upload-placeholder';
import { LocationPickerModal } from '@/features/creation/components/LocationPickerModal';
import { HStack, Screen, Spacer } from '@/components/layout';
import { useTheme } from '@/hooks/use-theme';
import { useCreateClubForm } from '../hooks/useCreateClubForm';
import { useTranslation } from 'react-i18next';

export function CreateClubScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const { state, actions, status } = useCreateClubForm();

  const header = (
    <HStack align="center" justify="space-between" style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.line }]}>
      <IconButton iconName="close" onPress={() => router.back()} />
      <Text style={[styles.headerTitle, { color: theme.text }]}>{t('createClub.headerTitle')}</Text>
      <View style={{ width: 40 }} />
    </HStack>
  );

  return (
    <Screen
      safeTop
      safeBottom
      scrollable
      keyboardAvoiding
      header={header}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('createClub.appearance')}</Text>
      <ImageUploadPlaceholder
        title={t('createClub.coverPhoto')}
        imageUrl={state.coverUrl}
        onPress={actions.handleSelectCover}
        isUploading={status.isUploading && !state.coverUrl}
      />
      <Spacer size="space16" />
      <ImageUploadPlaceholder
        title={t('createClub.logo')}
        imageUrl={state.logoUrl}
        onPress={actions.handleSelectLogo}
        isUploading={status.isUploading && !state.logoUrl}
      />

      <Spacer size="space32" />

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('createClub.basicInfo')}</Text>
      
      <FormInput
        label={t('createClub.nameLabel')}
        value={state.name}
        onChangeText={actions.setName}
        placeholder={t('createClub.namePlaceholder')}
      />
      
      <FormInput
        label={t('createClub.handleLabel')}
        value={state.handle}
        onChangeText={actions.setHandle}
        placeholder={t('createClub.handlePlaceholder')}
        autoCapitalize="none"
      />

      <FormInput
        label={t('createClub.descLabel')}
        value={state.bio}
        onChangeText={actions.setBio}
        placeholder={t('createClub.descPlaceholder')}
        multiline
      />

      <FormInput
        label="GROUPE WHATSAPP (OPTIONNEL)"
        value={state.whatsappGroupUrl}
        onChangeText={actions.setWhatsappGroupUrl}
        placeholder="https://chat.whatsapp.com/..."
        autoCapitalize="none"
        keyboardType="url"
      />

      <Spacer size="space32" />
      
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('createClub.locationTitle')}</Text>
      <TouchableOpacity 
        style={[styles.locationSelector, { backgroundColor: theme.backgroundElement }]}
        onPress={() => actions.setIsLocationModalVisible(true)}
        accessibilityRole="button"
      >
        <Text style={state.baseName ? [styles.locationText, { color: theme.text }] : [styles.locationPlaceholder, { color: theme.ink3 }]}>
          {state.baseName || t('createClub.locationPlaceholder')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.submitButton, status.isPending && styles.submitButtonDisabled]}
        onPress={actions.handleSubmit}
        disabled={status.isPending || status.isUploading}
        accessibilityRole="button"
      >
        {status.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>{t('createClub.submitButton')}</Text>
        )}
      </TouchableOpacity>

      <LocationPickerModal
        isVisible={state.isLocationModalVisible}
        onDismiss={() => actions.setIsLocationModalVisible(false)}
        onSelectLocation={actions.handleLocationSelect}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundThemes.Ivoire,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.space20,
    paddingBottom: Spacing.space16,
    backgroundColor: BackgroundThemes.Ivoire,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.line,
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  content: {
    padding: Spacing.space20,
  },
  sectionTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: Spacing.space16,
  },
  spacer: {
    height: Spacing.space16,
  },
  spacerLarge: {
    height: Spacing.space32,
  },
  locationSelector: {
    backgroundColor: Colors.light.backgroundElement,
    padding: Spacing.space16,
    borderRadius: 12,
    marginBottom: Spacing.space32,
  },
  locationText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
  },
  locationPlaceholder: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 16,
    color: Colors.light.ink3,
  },
  submitButton: {
    backgroundColor: AccentColors.bissap,
    paddingVertical: Spacing.space16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: '#ffffff',
  },
});
