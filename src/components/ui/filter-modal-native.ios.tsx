import { Colors,  AccentColors, Spacing, Typography } from '@/constants/theme';
import { BottomSheetModal, BottomSheetScrollView } from '@expo/ui/community/bottom-sheet';
import { Host, Slider } from '@expo/ui/swift-ui';
import { tint } from '@expo/ui/swift-ui/modifiers';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface FilterModalNativeProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const WHEN_OPTIONS = ["Aujourd'hui", 'Cette semaine', 'Ce week-end', 'Plus tard'];
const SPORT_OPTIONS = ['Running', 'Foot', 'Yoga', 'Basket', 'Cyclisme', 'Fitness'];
const NEIGHBORHOOD_OPTIONS = ['Médina', 'Plateau', 'Yoff', 'Almadies', 'Ngor'];
const PRICE_OPTIONS = ['Tous', 'Gratuit', 'Payant'];

function ChipRow({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.chipRow}>
      {options.map((option) => {
        const isActive = selected === option;
        return (
          <TouchableOpacity
            key={option}
            activeOpacity={0.8}
            onPress={() => onSelect(option)}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function SectionLabel({ title }: { title: string }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

export function FilterModalNative({ isVisible, onDismiss }: FilterModalNativeProps) {
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const [when, setWhen] = useState("Aujourd'hui");
  const [sport, setSport] = useState('Running');
  const [neighborhood, setNeighborhood] = useState('Médina');
  const [price, setPrice] = useState('Tous');
  const [distance, setDistance] = useState(5);

  // Sync visibility with the bottom sheet ref
  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isVisible]);

  const handleReset = () => {
    setWhen("Aujourd'hui");
    setSport('Running');
    setNeighborhood('Médina');
    setPrice('Tous');
    setDistance(5);
  };

  const handleClose = () => {
    bottomSheetRef.current?.dismiss();
    onDismiss();
  };

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
        <ChipRow options={SPORT_OPTIONS} selected={sport} onSelect={setSport} />

        {/* QUARTIER */}
        <SectionLabel title="QUARTIER" />
        <ChipRow options={NEIGHBORHOOD_OPTIONS} selected={neighborhood} onSelect={setNeighborhood} />

        {/* PRIX */}
        <SectionLabel title="PRIX" />
        <ChipRow options={PRICE_OPTIONS} selected={price} onSelect={setPrice} />

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

        {/* Footer inside ScrollView to guarantee visibility */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetText}>Réinitialiser</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleClose}>
            <Text style={styles.applyText}>Voir 24 events</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
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
