import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormInput } from '@/components/ui/form-input';
import { ImageUploadPlaceholder } from '@/components/ui/image-upload-placeholder';
import { AccentColors, Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { LocationPickerModal } from '../components/LocationPickerModal';
import { SportPickerModal } from '../components/SportPickerModal';
import { DateTimeSection } from '../components/DateTimeSection';
import { PricingSection } from '../components/PricingSection';
import { useCreationScreen } from '../hooks/useCreationScreen';

export function CreationScreen() {
  const insets = useSafeAreaInsets();
  const {
    editingEventId,
    title,
    description,
    sportId,
    startsAt,
    venueName,
    capacity,
    price,
    coords,
    coverUrl,
    sportsList,
    selectedSport,
    isUploading,
    pickAndUploadImage,
    removeCover,
    updateField,
    isPaid,
    setIsPaid,
    isSaving,
    handleSave,
    showLocationModal,
    setShowLocationModal,
    showSportModal,
    setShowSportModal,
    handleSelectLocation,
    handleSelectSport,
    isFormValid,
    isLoadingData,
    goBack,
    goToPreview,
    t,
  } = useCreationScreen();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.iconButton} onPress={goBack}>
          <Ionicons name="close" size={20} color={Colors.light.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {editingEventId ? t('creation.headerTitleEdit') : t('creation.headerTitle')}
        </Text>

        <Text style={styles.stepText}>1/2</Text>
      </View>

      {isLoadingData ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={AccentColors.bissap} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 }]}
          showsVerticalScrollIndicator={false}
        >
          <ImageUploadPlaceholder
            badgeText={t('creation.coverPhoto')}
            imageUrl={coverUrl}
            isUploading={isUploading}
            onPress={pickAndUploadImage}
            onRemove={coverUrl ? removeCover : undefined}
          />

          <FormInput
            label={t('creation.titleLabel').toUpperCase()}
            placeholder={t('creation.titlePlaceholder')}
            value={title}
            onChangeText={(val) => updateField('title', val)}
          />

          <FormInput
            label={t('creation.descLabel').toUpperCase()}
            placeholder={t('creation.descPlaceholder')}
            value={description}
            onChangeText={(val) => updateField('description', val)}
            multiline
          />

          <Text style={[styles.label, { marginTop: Spacing.space16 }]}>{t('creation.sportLabel').toUpperCase()}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setShowSportModal(true);
            }}
            style={styles.sportDropdownTrigger}
          >
            {selectedSport ? (
              <View style={styles.selectedSportContainer}>
                <View style={[styles.sportDot, { backgroundColor: selectedSport.color }]} />
                <Text style={styles.selectedSportText}>{selectedSport.labelFr}</Text>
              </View>
            ) : (
              <Text style={styles.dropdownPlaceholder}>{t('creation.sportPlaceholder')}</Text>
            )}
            <Ionicons name="chevron-down" size={20} color={Colors.light.ink3} />
          </TouchableOpacity>

          <DateTimeSection
            startsAt={startsAt}
            onChangeStartsAt={(val) => updateField('startsAt', val)}
            minimumDate={new Date()}
          />

          <View style={styles.labelRow}>
            <Text style={styles.label}>{t('creation.locationLabel')}</Text>
            <Text style={styles.rightLabel}>{t('creation.locationRequired')}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowLocationModal(true)}
            style={[styles.locationSelectorField, venueName ? styles.locationSelectorFieldSelected : null]}
          >
            <View style={{ flex: 1, marginRight: 8, justifyContent: 'center' }}>
              {venueName ? (
                <>
                  <Text style={styles.locationSelectorText} numberOfLines={1}>
                    {venueName.includes(',') ? venueName.substring(0, venueName.indexOf(',')) : venueName}
                  </Text>
                  <Text style={styles.locationSelectorSubtext} numberOfLines={1}>
                    {venueName.includes(',') ? venueName.substring(venueName.indexOf(',') + 1).trim() : ''}
                  </Text>
                </>
              ) : (
                <Text style={styles.locationSelectorPlaceholder}>{t('creation.locationPlaceholder')}</Text>
              )}
            </View>
            <Ionicons name="search" size={18} color={Colors.light.ink3} />
          </TouchableOpacity>

          <PricingSection
            isPaid={isPaid}
            setIsPaid={setIsPaid}
            price={price}
            capacity={capacity}
            onChangePrice={(val) => updateField('price', val)}
            onChangeCapacity={(val) => updateField('capacity', val)}
          />
        </ScrollView>
      )}

      {/* BOTTOM BUTTON */}
      <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity
          style={[styles.primaryButton, (!isFormValid || isSaving) && styles.disabledButton]}
          activeOpacity={0.8}
          disabled={!isFormValid || isSaving}
          onPress={editingEventId ? handleSave : goToPreview}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {editingEventId ? t('creation.buttonEdit') : t('creation.buttonPreview')}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* LOCATION PICKER MODAL */}
      <LocationPickerModal
        isVisible={showLocationModal}
        onDismiss={() => setShowLocationModal(false)}
        onSelectLocation={handleSelectLocation}
        initialVenueName={venueName}
        initialCoords={coords}
      />

      {/* ALL SPORTS PICKER MODAL */}
      <SportPickerModal
        isVisible={showSportModal}
        onDismiss={() => setShowSportModal(false)}
        sportsList={sportsList}
        onSelectSport={handleSelectSport}
      />


    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundElement,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  label: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.space8,
    marginLeft: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space8,
    marginLeft: 4,
  },
  rightLabel: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: '#65625e',
  },
  sportDropdownTrigger: {
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: Radius.btn,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space16,
    borderWidth: 1,
    borderColor: '#e3e3e1',
    marginBottom: Spacing.space24,
  },
  selectedSportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sportDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedSportText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  dropdownPlaceholder: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: Colors.light.ink3,
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space16,
    backgroundColor: 'transparent',
  },
  primaryButton: {
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
    opacity: 0.5,
    backgroundColor: Colors.light.ink3,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: '#ffffff',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Spacing.space20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    maxHeight: '70%',
    padding: Spacing.space20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalContentCompact: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    maxHeight: '70%',
    padding: Spacing.space20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space20,
  },
  modalTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f0',
    borderRadius: Radius.btn,
    paddingHorizontal: Spacing.space12,
    height: 48,
    marginBottom: Spacing.space16,
  },
  modalSearchInput: {
    flex: 1,
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
    paddingVertical: 0,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f0',
  },
  sportModalDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  locationName: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  locationAddress: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: '#65625e',
    marginTop: 2,
  },
  pickerItem: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f0',
  },
  pickerItemText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
    textTransform: 'capitalize',
  },
  modalEmptyState: {
    paddingVertical: 48,
    alignItems: 'center',
    paddingHorizontal: Spacing.space24,
  },
  modalEmptyTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 6,
  },
  modalEmptySubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: '#65625e',
    textAlign: 'center',
    lineHeight: 18,
  },
  fullscreenModalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalMapWrapper: {
    flex: 1,
    backgroundColor: '#e6e3da',
  },
  modalBottomPanel: {
    padding: Spacing.space20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f2f2f0',
  },
  modalAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f0',
    borderRadius: 12,
    padding: Spacing.space12,
    marginBottom: Spacing.space16,
  },
  modalAddressText: {
    flex: 1,
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
  modalAddressPlaceholder: {
    flex: 1,
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: '#65625e',
    textAlign: 'center',
  },
  locationSelectorField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: Spacing.space16,
    height: 52,
    marginBottom: Spacing.space24,
  },
  locationSelectorText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  locationSelectorPlaceholder: {
    color: Colors.light.ink3,
    fontFamily: Typography.corps.fontFamily,
  },
  locationSelectorFieldSelected: {
    height: 64,
  },
  locationSelectorSubtext: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginTop: 2,
  }
});
