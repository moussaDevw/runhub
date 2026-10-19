import { HStack, VStack } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { AccentColors, Colors, NeutralColors, Radius, Spacing, Typography } from '@/constants/theme';
import { PRICE_FILTER_KEYS, WHEN_FILTER_KEYS } from '@/features/events/constants/filter.constants';
import { BottomSheetModal, BottomSheetScrollView } from '@expo/ui/community/bottom-sheet';
import { Host, Slider } from '@expo/ui/swift-ui';
import { tint } from '@expo/ui/swift-ui/modifiers';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);

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
    distance,
    setDistance,
    handleReset,
    handleClose,
  } = useFilterModalNative({
    activeDateFilter,
    activeSportId,
    activePriceFilter,
    activeNeighborhood,
    onApplyDateFilter,
    onApplyFilters,
    onDismiss: () => {
      bottomSheetRef.current?.dismiss();
      onDismiss();
    },
  });

  // Sync visibility with the bottom sheet ref
  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isVisible]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={['85%']}
      index={0}
      enablePanDownToClose
      backgroundStyle={styles.modalBackground}
      handleIndicatorStyle={styles.handleIndicator}
      onDismiss={onDismiss}
    >
      <View style={styles.container}>
        {/* Header */}
        <HStack align="center" justify="space-between" style={styles.header}>
          <Text style={styles.headerTitle}>{t('filter.title')}</Text>
          <IconButton
            iconName="close"
            variant="ghost"
            size={20}
            onPress={handleClose}
            style={styles.closeButton}
          />
        </HStack>

        <BottomSheetScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <VStack gap="space4">
            {/* QUAND */}
            <SectionLabel title={t('filter.when')} />
            <ChipRow options={whenOptions} selected={when} onSelect={setWhen} />

            {/* SPORT (2 lignes horizontales défilantes) */}
            {sportOptions.length > 1 && (
              <>
                <SectionLabel title={t('filter.sport')} />
                <HorizontalChipRow options={sportOptions} selected={sport} onSelect={setSport} numRows={2} />
              </>
            )}

            {/* QUARTIER (1 ligne horizontale défilante) */}
            {neighborhoodOptions.length > 1 && (
              <>
                <SectionLabel title={t('filter.neighborhood')} />
                <HorizontalChipRow options={neighborhoodOptions} selected={neighborhood} onSelect={setNeighborhood} />
              </>
            )}

            {/* PRIX */}
            <SectionLabel title={t('filter.price')} />
            <ChipRow options={priceOptions} selected={price} onSelect={setPrice} />

            {/* DISTANCE */}
            <HStack align="center" style={styles.distanceHeader}>
              <Text style={styles.sectionLabel}>{t('filter.distance')}</Text>
              <Text style={styles.distanceValue}>· {Math.round(distance)} KM</Text>
            </HStack>

            {/* Native SwiftUI Slider */}
            <Host style={styles.sliderHost}>
              <Slider
                value={distance}
                min={1}
                max={20}
                step={1}
                onValueChange={setDistance}
                modifiers={[tint(AccentColors.bissap)]}
              />
            </Host>
          </VStack>
        </BottomSheetScrollView>

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
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalBackground: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Radius.lg,
  },
  handleIndicator: {
    backgroundColor: Colors.light.line,
    width: 40,
  },
  header: {
    paddingHorizontal: Spacing.space20,
    paddingVertical: Spacing.space12,
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 24,
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
    paddingTop: Spacing.space12,
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
  distanceHeader: {
    marginTop: Spacing.space16,
    marginBottom: Spacing.space8,
  },
  distanceValue: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    letterSpacing: 1,
    marginLeft: Spacing.space8,
    textTransform: 'uppercase',
  },
  sliderHost: {
    width: '100%',
    height: 44,
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space16,
    paddingBottom: Spacing.space24,
    borderTopWidth: 1,
    borderTopColor: Colors.light.backgroundElement,
  },
  resetButton: {
    width: 'auto',
    paddingHorizontal: Spacing.space12,
  },
  applyButton: {
    flex: 1,
  },
});
