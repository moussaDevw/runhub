import { IconButton } from '@/components/ui/icon-button';
import { BackgroundThemes, Colors, Spacing, Typography, AccentColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormInput } from '@/components/ui/form-input';
import { ImageUploadPlaceholder } from '@/components/ui/image-upload-placeholder';
import { LocationPickerModal } from '@/features/creation/components/LocationPickerModal';
import { useCreateClubForm } from '../hooks/useCreateClubForm';

export function CreateClubScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, actions, status } = useCreateClubForm();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <IconButton iconName="close" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Créer un club</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.space24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Apparence</Text>
        <ImageUploadPlaceholder
          title="Photo de couverture (16:9)"
          imageUrl={state.coverUrl}
          onPress={actions.handleSelectCover}
          isUploading={status.isUploading && !state.coverUrl}
        />
        <View style={styles.spacer} />
        <ImageUploadPlaceholder
          title="Logo du club (1:1)"
          imageUrl={state.logoUrl}
          onPress={actions.handleSelectLogo}
          isUploading={status.isUploading && !state.logoUrl}
        />

        <View style={styles.spacerLarge} />

        <Text style={styles.sectionTitle}>Informations de base</Text>
        
        <FormInput
          label="Nom du club *"
          value={state.name}
          onChangeText={actions.setName}
          placeholder="ex: Dakar Runners"
        />
        
        <FormInput
          label="Identifiant unique *"
          value={state.handle}
          onChangeText={actions.setHandle}
          placeholder="ex: dakar_runners"
          autoCapitalize="none"
        />

        <FormInput
          label="Description"
          value={state.bio}
          onChangeText={actions.setBio}
          placeholder="Décrivez votre club..."
          multiline
        />

        <View style={styles.spacerLarge} />
        
        <Text style={styles.sectionTitle}>Localisation</Text>
        <TouchableOpacity 
          style={styles.locationSelector}
          onPress={() => actions.setIsLocationModalVisible(true)}
        >
          <Text style={state.baseName ? styles.locationText : styles.locationPlaceholder}>
            {state.baseName || 'Sélectionner la base du club...'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.submitButton, status.isPending && styles.submitButtonDisabled]}
          onPress={actions.handleSubmit}
          disabled={status.isPending || status.isUploading}
        >
          {status.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Créer mon club</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <LocationPickerModal
        isVisible={state.isLocationModalVisible}
        onDismiss={() => actions.setIsLocationModalVisible(false)}
        onSelectLocation={actions.handleLocationSelect}
      />
    </View>
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
