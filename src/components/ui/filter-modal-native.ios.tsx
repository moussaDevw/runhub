import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { BottomSheetModal, BottomSheetScrollView } from '@expo/ui/community/bottom-sheet';
import { Host, Slider } from '@expo/ui/swift-ui';
import { tint } from '@expo/ui/swift-ui/modifiers';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFilterModalNative } from './hooks/useFilterModalNative';

export interface FilterModalNativeProps {
  isVisible: boolean;
  onDismiss: () => void;
  activeDateFilter?: 'today' | 'weekend' | 'week' | 'month';
  onApplyDateFilter?: (filter?: 'today' | 'weekend' | 'week' | 'month') => void;
  availableNeighborhoods?: string[];
}

const WHEN_OPTIONS = [
  { id: 'all', label: 'Tous' },
  { id: 'today', label: "Aujourd'hui" },
  { id: 'week', label: 'Cette semaine' },
  { id: 'weekend', label: 'Ce week-end' },
  { id: 'month', label: 'Ce mois-ci' }
];

const SPORT_OPTIONS = ['Running', 'Foot', 'Yoga', 'Basket', 'Cyclisme', 'Fitness'];
const PRICE_OPTIONS = ['Tous', 'Gratuit', 'Payant'];

function ChipRow({
  options,
  selected,
  onSelect,
}: {
  options: { id: string, label: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.chipRow}>
      {options.map((option) => {
        const isActive = selected === option.id;
        return (
          <TouchableOpacity
            key={option.id}
            activeOpacity={0.8}
            onPress={() => onSelect(option.id)}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function SectionLabel({ title }: { title: string }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

export function FilterModalNative({ isVisible, onDismiss, activeDateFilter, onApplyDateFilter, availableNeighborhoods = [] }: FilterModalNativeProps) {
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);

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
    onApplyDateFilter,
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
      snapPoints={['90%']}
      index={0}
      enablePanDownToClose
      backgroundStyle={styles.modalBackground}
      handleIndicatorStyle={styles.handleIndicator}
      onDismiss={onDismiss}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filtres</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={20} color={Colors.light.ink3} />
          </TouchableOpacity>
        </View>

        <BottomSheetScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* QUAND */}
          <SectionLabel title="QUAND" />
          <ChipRow options={WHEN_OPTIONS} selected={when} onSelect={setWhen} />

          {/* SPORT */}
          <SectionLabel title="SPORT" />
          <View style={styles.chipRow}>
            {SPORT_OPTIONS.map((option) => {
              const isActive = sport === option;
              return (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.8}
                  onPress={() => setSport(option)}
                  style={[styles.chip, isActive && styles.chipActive]}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* QUARTIER */}
          {availableNeighborhoods.length > 0 && (
            <>
              <SectionLabel title="QUARTIER" />
              <View style={styles.chipRow}>
                {availableNeighborhoods.map((option) => {
                  const isActive = neighborhood === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      activeOpacity={0.8}
                      onPress={() => setNeighborhood(option)}
                      style={[styles.chip, isActive && styles.chipActive]}
                    >
                      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* PRIX */}
          <SectionLabel title="PRIX" />
          <View style={styles.chipRow}>
            {PRICE_OPTIONS.map((option) => {
              const isActive = price === option;
              return (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.8}
                  onPress={() => setPrice(option)}
                  style={[styles.chip, isActive && styles.chipActive]}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* DISTANCE */}
          <View style={styles.distanceHeader}>
            <Text style={styles.sectionLabel}>DISTANCE</Text>
            <Text style={styles.distanceValue}>· {Math.round(distance)} KM</Text>
          </View>

          {/* Native SwiftUI Slider */}
          <Host style={{ width: '100%', height: 44, justifyContent: 'center' }}>
            <Slider
              value={distance}
              min={1}
              max={20}
              step={1}
              onValueChange={setDistance}
              modifiers={[tint(AccentColors.bissap)]}
            />
          </Host>
        </BottomSheetScrollView>

        <View style={[styles.footer, { paddingHorizontal: Spacing.space20, paddingBottom: 2 }]}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetText}>Réinitialiser</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleClose}>
            <Text style={styles.applyText}>Afficher les résultats</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: '#FAFAF9', // Ivory/white background like the design
    borderRadius: 24,
  },
  handleIndicator: {
    backgroundColor: '#e3e2df',
    width: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 16,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e3e2df',
    backgroundColor: '#ffffff', // White by default
  },
  chipActive: {
    backgroundColor: Colors.light.text,
    borderColor: Colors.light.text,
  },
  chipText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: '#65625e',
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  distanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  distanceValue: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    letterSpacing: 1,
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.space24,
    paddingBottom: Spacing.space24,
    marginTop: Spacing.space24,
    borderTopWidth: 1,
    borderTopColor: Colors.light.backgroundElement,
  },
  resetButton: {
    paddingVertical: Spacing.space12,
    paddingRight: Spacing.space16,
  },
  resetText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#65625e',
  },
  applyButton: {
    flex: 1,
    marginLeft: Spacing.space12,
    backgroundColor: AccentColors.bissap, // The red button color
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: '#ffffff',
  },
});
