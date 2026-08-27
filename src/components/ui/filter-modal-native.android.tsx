import { Colors,  AccentColors, BackgroundThemes } from '@/constants/theme';
import {
  Button,
  Column,
  FilterChip,
  FlowRow,
  HorizontalDivider,
  ModalBottomSheet,
  Row,
  Slider,
  Text,
  TextButton,
} from '@expo/ui/jetpack-compose';
import { padding } from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';
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
] as const;

const SPORT_OPTIONS = [
  { id: 'Running', label: 'Running' },
  { id: 'Foot', label: 'Foot' },
  { id: 'Yoga', label: 'Yoga' },
  { id: 'Basket', label: 'Basket' },
  { id: 'Cyclisme', label: 'Cyclisme' },
  { id: 'Fitness', label: 'Fitness' }
];



const PRICE_OPTIONS = [
  { id: 'Tous', label: 'Tous' },
  { id: 'Gratuit', label: 'Gratuit' },
  { id: 'Payant', label: 'Payant' }
];

function SectionChips({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: { id: string, label: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <>
      <Text
        style={{ typography: 'labelSmall', letterSpacing: 1.5 }}
        color={Colors.light.ink3}
        modifiers={[padding(0, 16, 0, 4)]}
      >
        {title}
      </Text>
      <FlowRow horizontalArrangement={{ spacedBy: 8 }} modifiers={[padding(0, 0, 0, 8)]}>
        {options.map((option) => (
          <FilterChip
            key={option.id}
            selected={selected === option.id}
            onClick={() => onSelect(option.id)}
            colors={{
              selectedContainerColor: Colors.light.text,
              selectedLabelColor: '#ffffff',
              containerColor: 'transparent',
              labelColor: Colors.light.text,
            }}
            border={{
              width: 1,
              color: selected === option.id ? Colors.light.text : '#e3e2df',
            }}
          >
            <FilterChip.Label>
              <Text>{option.label}</Text>
            </FilterChip.Label>
          </FilterChip>
        ))}
      </FlowRow>
    </>
  );
}

export function FilterModalNative({ isVisible, onDismiss, activeDateFilter, onApplyDateFilter, availableNeighborhoods = [] }: FilterModalNativeProps) {
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
    onDismiss,
  });

  if (!isVisible) return null;

  return (
    <ModalBottomSheet
      onDismissRequest={onDismiss}
      skipPartiallyExpanded
      containerColor={BackgroundThemes.Ivoire}
      showDragHandle
    >
      <Column
        verticalArrangement={{ spacedBy: 4 }}
        modifiers={[padding(20, 0, 20, 0)]}
      >
        {/* Header */}
        <Row
          horizontalArrangement="spaceBetween"
          verticalAlignment="center"
          modifiers={[padding(0, 0, 0, 8)]}
        >
          <Text style={{ typography: 'headlineMedium', fontWeight: 'bold' }} color={Colors.light.text}>
            Filtres
          </Text>
        </Row>

        {/* QUAND */}
        <SectionChips title="QUAND" options={WHEN_OPTIONS as any} selected={when} onSelect={setWhen} />

        {/* SPORT */}
        <SectionChips title="SPORT" options={SPORT_OPTIONS} selected={sport} onSelect={setSport} />

        {/* QUARTIER */}
        {availableNeighborhoods.length > 0 && (
          <SectionChips
            title="QUARTIER"
            options={availableNeighborhoods.map(n => ({ id: n, label: n }))}
            selected={neighborhood}
            onSelect={setNeighborhood}
          />
        )}

        {/* PRIX */}
        <SectionChips title="PRIX" options={PRICE_OPTIONS} selected={price} onSelect={setPrice} />

        {/* DISTANCE */}
        <Row verticalAlignment="center" modifiers={[padding(0, 12, 0, 0)]}>
          <Text style={{ typography: 'labelSmall', letterSpacing: 1.5 }} color={Colors.light.ink3}>
            DISTANCE
          </Text>
          <Text style={{ typography: 'labelSmall', letterSpacing: 1 }} color={Colors.light.ink3}>
            {' '}
            · {Math.round(distance)} KM
          </Text>
        </Row>

        <Slider
          value={distance}
          min={1}
          max={20}
          steps={19}
          onValueChange={setDistance}
          colors={{
            thumbColor: '#ffffff',
            activeTrackColor: AccentColors.bissap,
            inactiveTrackColor: Colors.light.backgroundElement,
          }}
        />

        <HorizontalDivider color={Colors.light.backgroundElement} />

        {/* Footer */}
        <Row
          horizontalArrangement="spaceBetween"
          verticalAlignment="center"
          modifiers={[padding(0, 8, 0, 16)]}
        >
          <TextButton
            onClick={handleReset}
            colors={{ contentColor: '#65625e' }}
          >
            <Text>Réinitialiser</Text>
          </TextButton>

          <Button
            onClick={handleClose}
            colors={{
              containerColor: AccentColors.bissap,
              contentColor: '#ffffff',
            }}
          >
            <Text>Afficher les résultats</Text>
          </Button>
        </Row>
      </Column>
    </ModalBottomSheet>
  );
}
