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

export interface FilterModalNativeProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const WHEN_OPTIONS = ["Aujourd'hui", "Cette semaine", "Ce week-end", "Plus tard"];
const SPORT_OPTIONS = ['Running', 'Foot', 'Yoga', 'Basket', 'Cyclisme', 'Fitness'];
const NEIGHBORHOOD_OPTIONS = ['Médina', 'Plateau', 'Yoff', 'Almadies', 'Ngor'];
const PRICE_OPTIONS = ['Tous', 'Gratuit', 'Payant'];

function SectionChips({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: string[];
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
            key={option}
            selected={selected === option}
            onClick={() => onSelect(option)}
            colors={{
              selectedContainerColor: Colors.light.text,
              selectedLabelColor: '#ffffff',
              containerColor: 'transparent',
              labelColor: Colors.light.text,
            }}
            border={{
              width: 1,
              color: selected === option ? Colors.light.text : '#e3e2df',
            }}
          >
            <FilterChip.Label>
              <Text>{option}</Text>
            </FilterChip.Label>
          </FilterChip>
        ))}
      </FlowRow>
    </>
  );
}

export function FilterModalNative({ isVisible, onDismiss }: FilterModalNativeProps) {
  const [when, setWhen] = useState("Aujourd'hui");
  const [sport, setSport] = useState('Running');
  const [neighborhood, setNeighborhood] = useState('Médina');
  const [price, setPrice] = useState('Tous');
  const [distance, setDistance] = useState(5);

  if (!isVisible) return null;

  const handleReset = () => {
    setWhen("Aujourd'hui");
    setSport('Running');
    setNeighborhood('Médina');
    setPrice('Tous');
    setDistance(5);
  };

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
        <SectionChips title="QUAND" options={WHEN_OPTIONS} selected={when} onSelect={setWhen} />

        {/* SPORT */}
        <SectionChips title="SPORT" options={SPORT_OPTIONS} selected={sport} onSelect={setSport} />

        {/* QUARTIER */}
        <SectionChips
          title="QUARTIER"
          options={NEIGHBORHOOD_OPTIONS}
          selected={neighborhood}
          onSelect={setNeighborhood}
        />

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
            onClick={onDismiss}
            colors={{
              containerColor: AccentColors.bissap,
              contentColor: '#ffffff',
            }}
          >
            <Text>Voir 24 events</Text>
          </Button>
        </Row>
      </Column>
    </ModalBottomSheet>
  );
}
