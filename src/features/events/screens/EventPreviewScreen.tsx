import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { EventPreviewCard } from '@/components/ui/event-preview-card';
import { FeatureCheckItem } from '@/components/ui/feature-check-item';
import { Colors,  AccentColors, Spacing, Typography } from '@/constants/theme';
import { formatTime, getDayLabel, formatPrice } from '@/core/utils/locale';
import { useEventPreview } from '../hooks/useEventPreview';

export function EventPreviewScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    title,
    price,
    startsAt,
    venueName,
    capacity,
    coverUrl,
    selectedSport,
    organizerName,
    organizerInitials,
    isPublishing,
    handlePublish,
    goBack,
  } = useEventPreview();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.iconButton} onPress={goBack} disabled={isPublishing}>
          <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t('creation.previewTitle')}</Text>

        <Text style={styles.stepText}>2/2</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          {t('creation.previewSubtitle')}
        </Text>

        <EventPreviewCard
          title={title}
          price={formatPrice(price)}
          time={formatTime(startsAt)}
          location={venueName}
          organizerInitials={organizerInitials}
          organizerName={organizerName}
          places={capacity ? `${capacity}` : t('creation.capacityUnlimited')}
          sportLabel={selectedSport?.labelFr || 'Sport'}
          sportColor={selectedSport?.color || Colors.light.text}
          dateLabel={getDayLabel(startsAt)}
          timeLabel={formatTime(startsAt)}
          coverUrl={coverUrl || undefined}
        />

        <View style={styles.featuresList}>
          <FeatureCheckItem label={t('creation.previewFeature1')} />
          <FeatureCheckItem label={price > 0 ? t('creation.previewFeature2Paid', { price: formatPrice(price) }) : t('creation.previewFeature2Free')} />
          <FeatureCheckItem label={t('creation.previewFeature3')} />
        </View>
      </ScrollView>

      {/* BOTTOM ACTIONS */}
      <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
          onPress={goBack}
          disabled={isPublishing}
        >
          <Text style={styles.secondaryButtonText}>{t('creation.previewButtonModify')}</Text>
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
            <Text style={styles.primaryButtonText}>{t('creation.previewButtonPublish')}</Text>
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
