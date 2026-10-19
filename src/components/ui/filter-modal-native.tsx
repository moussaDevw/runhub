import { HStack, VStack } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { Colors, NeutralColors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { PRICE_FILTER_KEYS, WHEN_FILTER_KEYS } from '@/features/events/constants/filter.constants';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppliedFilters, useFilterModalNative } from './hooks/useFilterModalNative';

export interface FilterModalNativeProps {
  isVisible: boolean;
  onDismiss: () => void;
  activeDateFilter?: 'today' | 'weekend' | 'week' | 'month';
  activeSportId?: string;
  activePriceFilter?: string;
  activeNeighborhood?: string;
  onApplyDateFilter?: (filter?: 'today' | 'weekend' | 'week' | 'month') => void;
  onApplyFilters?: (filters: AppliedFilters) => void;
  availableSports?: { id: string; label: string }[];
  availableNeighborhoods?: string[];
}

function ChipRow({
  options,
  selected,
  onSelect,
}: {
  options: { id: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <HStack wrap="wrap" gap="space8">
      {options.map((option) => (
        <Chip
          key={option.id}
          label={option.label}
          isActive={selected === option.id}
          onPress={() => onSelect(option.id)}
          style={styles.chipResetMargin}
        />
      ))}
    </HStack>
  );
}

function HorizontalChipRow({
  options,
  selected,
  onSelect,
  numRows = 1,
}: {
  options: { id: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
  numRows?: number;
}) {
  if (numRows === 2) {
    const half = Math.ceil(options.length / 2);
    const row1 = options.slice(0, half);
    const row2 = options.slice(half);

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={styles.horizontalScrollContent}
      >
        <VStack gap="space8">
          <HStack gap="space8">
            {row1.map((option) => (
              <Chip
                key={option.id}
                label={option.label}
                isActive={selected === option.id}
                onPress={() => onSelect(option.id)}
                style={styles.chipResetMargin}
              />
            ))}
          </HStack>
          <HStack gap="space8">
            {row2.map((option) => (
              <Chip
                key={option.id}
                label={option.label}
                isActive={selected === option.id}
                onPress={() => onSelect(option.id)}
                style={styles.chipResetMargin}
              />
            ))}
          </HStack>
        </VStack>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.horizontalScroll}
      contentContainerStyle={styles.horizontalScrollContent}
    >
      <HStack gap="space8">
        {options.map((option) => (
          <Chip
            key={option.id}
            label={option.label}
            isActive={selected === option.id}
            onPress={() => onSelect(option.id)}
            style={styles.chipResetMargin}
          />
        ))}
      </HStack>
    </ScrollView>
  );
}

function SectionLabel({ title }: { title: string }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

export function FilterModalNative({
  isVisible,
  onDismiss,
  activeDateFilter,
  activeSportId,
  activePriceFilter,
  activeNeighborhood,
  onApplyDateFilter,
  onApplyFilters,
  availableSports = [],
  availableNeighborhoods = [],
}: FilterModalNativeProps) {
  const { t } = useTranslation();

  const whenOptions = WHEN_FILTER_KEYS.map((opt) => ({ id: opt.id, label: t(opt.labelKey) }));
  const priceOptions = PRICE_FILTER_KEYS.map((opt) => ({ id: opt.id, label: t(opt.labelKey) }));
  const sportOptions = [
    { id: 'all', label: t('explore.filterAll', { defaultValue: 'Tous les sports' }) },
    ...availableSports.map((s) => ({ id: s.id, label: s.label })),
  ];
  const neighborhoodOptions = [
    { id: 'all', label: t('explore.filterAll', { defaultValue: 'Tous les quartiers' }) },
    ...availableNeighborhoods.map((n) => ({ id: n, label: n })),
  ];

  const {
    when,
    setWhen,
    sport,
    setSport,
    neighborhood,
    setNeighborhood,
    price,
    setPrice,
    handleReset,
    handleClose,
  } = useFilterModalNative({
    activeDateFilter,
    activeSportId,
    activePriceFilter,
    activeNeighborhood,
    onApplyDateFilter,
    onApplyFilters,
    onDismiss,
  });

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onDismiss} />

        <View style={styles.sheetContainer}>
          {/* Header */}
          <HStack align="center" justify="space-between" style={styles.header}>
            <Text style={styles.headerTitle}>{t('filter.title')}</Text>
            <IconButton
              iconName="close"
              variant="ghost"
              size={20}
              onPress={onDismiss}
              style={styles.closeButton}
            />
          </HStack>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <VStack gap="space4">
              {/* QUAND */}
              <SectionLabel title={t('filter.when')} />
              <ChipRow options={whenOptions} selected={when} onSelect={setWhen} />

              {/* SPORT (2 lignes défilantes horizontalement) */}
              {sportOptions.length > 1 && (
                <>
                  <SectionLabel title={t('filter.sport')} />
                  <HorizontalChipRow options={sportOptions} selected={sport} onSelect={setSport} numRows={2} />
                </>
              )}

              {/* QUARTIER (1 ligne défilante horizontalement) */}
              {neighborhoodOptions.length > 1 && (
                <>
                  <SectionLabel title={t('filter.neighborhood')} />
                  <HorizontalChipRow options={neighborhoodOptions} selected={neighborhood} onSelect={setNeighborhood} />
                </>
              )}

              {/* PRIX */}
              <SectionLabel title={t('filter.price')} />
              <ChipRow options={priceOptions} selected={price} onSelect={setPrice} />
            </VStack>
          </ScrollView>

          {/* Footer */}
          <HStack align="center" justify="space-between" gap="space12" style={styles.footer}>
            <Button
              variant="ghost"
              size="md"
              label={t('filter.reset')}
              onPress={handleReset}
              style={styles.resetButton}
            />
            <Button
              variant="primary"
              size="md"
              label={t('filter.apply')}
              onPress={handleClose}
              style={styles.applyButton}
            />
          </HStack>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: NeutralColors.overlay40,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: Colors.light.cardBackground,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    maxHeight: '85%',
    paddingBottom: Spacing.space24,
    ...Shadows.lg,
  },
  header: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space20,
    paddingBottom: Spacing.space12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.line,
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 22,
    color: Colors.light.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    backgroundColor: Colors.light.backgroundElement,
  },
  scrollContent: {
    paddingHorizontal: Spacing.space20,
    paddingVertical: Spacing.space12,
  },
  sectionLabel: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: Spacing.space16,
    marginBottom: Spacing.space8,
  },
  chipResetMargin: {
    marginRight: 0,
  },
  horizontalScroll: {
    marginHorizontal: -Spacing.space20,
  },
  horizontalScrollContent: {
    paddingHorizontal: Spacing.space20,
    paddingVertical: 2,
  },
  footer: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.line,
  },
  resetButton: {
    width: 'auto',
    paddingHorizontal: Spacing.space12,
  },
  applyButton: {
    flex: 1,
  },
});
