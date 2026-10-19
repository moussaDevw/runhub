import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { HStack, Screen } from '@/components/layout';
import { EventPreviewCard } from '@/features/events/components';
import { FeatureCheckItem } from '@/components/ui/feature-check-item';
import { Colors, AccentColors, Spacing, Typography } from '@/constants/theme';
import { formatTime, getDayLabel, formatPrice } from '@/core/utils/locale';
import { useTheme } from '@/hooks/use-theme';
import { useEventPreview } from '../hooks/useEventPreview';

export function EventPreviewScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
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

  const header = (
    <HStack align="center" justify="space-between" style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.line }]}>
      <TouchableOpacity
        style={[styles.iconButton, { borderColor: theme.line, backgroundColor: theme.cardBackground }]}
        onPress={goBack}
        disabled={isPublishing}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t('common.back', { defaultValue: 'Retour' })}
      >
        <Ionicons name="chevron-back" size={20} color={theme.text} />
      </TouchableOpacity>

      <Text style={[styles.headerTitle, { color: theme.text }]}>{t('creation.previewTitle')}</Text>

      <Text style={[styles.stepText, { color: theme.ink3 }]}>2/2</Text>
    </HStack>
  );

  return (
    <Screen
      scrollable
      safeTop
      safeBottom={false}
      header={header}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 }]}
      style={{ backgroundColor: theme.backgroundElement }}
    >
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
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
        sportColor={selectedSport?.color || theme.text}
        dateLabel={getDayLabel(startsAt)}
        timeLabel={formatTime(startsAt)}
        coverUrl={coverUrl || undefined}
      />

      <View style={styles.featuresList}>
        <FeatureCheckItem label={t('creation.previewFeature1')} />
        <FeatureCheckItem label={price > 0 ? t('creation.previewFeature2Paid', { price: formatPrice(price) }) : t('creation.previewFeature2Free')} />
        <FeatureCheckItem label={t('creation.previewFeature3')} />
      </View>

      {/* BOTTOM ACTIONS */}
      <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 24), backgroundColor: theme.backgroundElement }]}>
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: theme.cardBackground, borderColor: theme.line }]}
          activeOpacity={0.8}
          onPress={goBack}
          disabled={isPublishing}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>{t('creation.previewButtonModify')}</Text>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.space16,
    paddingVertical: Spacing.space12,
    borderBottomWidth: 1,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
  },
  stepText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
  },
  scrollContent: {
    padding: Spacing.space20,
  },
  subtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.space20,
  },
  featuresList: {
    paddingHorizontal: Spacing.space8,
    marginTop: Spacing.space8,
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
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
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
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: '#ffffff',
  },
});
