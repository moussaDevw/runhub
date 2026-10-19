import { AccentColors, BackgroundThemes, Colors, NeutralColors } from '@/constants/theme';
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
import { useTranslation } from 'react-i18next';
import { useFilterModalNative, AppliedFilters } from './hooks/useFilterModalNative';
import { WHEN_FILTER_KEYS, PRICE_FILTER_KEYS } from '@/features/events/constants/filter.constants';

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

function SectionChips({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: { id: string; label: string }[];
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
              selectedLabelColor: NeutralColors.white,
              containerColor: 'transparent',
              labelColor: Colors.light.text,
            }}
            border={{
              width: 1,
              color: selected === option.id ? Colors.light.text : Colors.light.line,
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

function SectionHorizontalChips({
  title,
  options,
  selected,
  onSelect,
  numRows = 1,
}: {
  title: string;
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
      <>
        <Text
          style={{ typography: 'labelSmall', letterSpacing: 1.5 }}
          color={Colors.light.ink3}
          modifiers={[padding(0, 16, 0, 4)]}
        >
          {title}
        </Text>
        <Column verticalArrangement={{ spacedBy: 8 }} modifiers={[padding(0, 0, 0, 8)]}>
          <Row horizontalArrangement={{ spacedBy: 8 }}>
            {row1.map((option) => (
              <FilterChip
                key={option.id}
                selected={selected === option.id}
                onClick={() => onSelect(option.id)}
                colors={{
                  selectedContainerColor: Colors.light.text,
                  selectedLabelColor: NeutralColors.white,
                  containerColor: 'transparent',
                  labelColor: Colors.light.text,
                }}
                border={{
                  width: 1,
                  color: selected === option.id ? Colors.light.text : Colors.light.line,
                }}
              >
                <FilterChip.Label>
                  <Text>{option.label}</Text>
                </FilterChip.Label>
              </FilterChip>
            ))}
          </Row>
          <Row horizontalArrangement={{ spacedBy: 8 }}>
            {row2.map((option) => (
              <FilterChip
                key={option.id}
                selected={selected === option.id}
                onClick={() => onSelect(option.id)}
                colors={{
                  selectedContainerColor: Colors.light.text,
                  selectedLabelColor: NeutralColors.white,
                  containerColor: 'transparent',
                  labelColor: Colors.light.text,
                }}
                border={{
                  width: 1,
                  color: selected === option.id ? Colors.light.text : Colors.light.line,
                }}
              >
                <FilterChip.Label>
                  <Text>{option.label}</Text>
                </FilterChip.Label>
              </FilterChip>
            ))}
          </Row>
        </Column>
      </>
    );
  }

  return (
    <>
      <Text
        style={{ typography: 'labelSmall', letterSpacing: 1.5 }}
        color={Colors.light.ink3}
        modifiers={[padding(0, 16, 0, 4)]}
      >
        {title}
      </Text>
      <Row horizontalArrangement={{ spacedBy: 8 }} modifiers={[padding(0, 0, 0, 8)]}>
        {options.map((option) => (
          <FilterChip
            key={option.id}
            selected={selected === option.id}
            onClick={() => onSelect(option.id)}
            colors={{
              selectedContainerColor: Colors.light.text,
              selectedLabelColor: NeutralColors.white,
              containerColor: 'transparent',
              labelColor: Colors.light.text,
            }}
            border={{
              width: 1,
              color: selected === option.id ? Colors.light.text : Colors.light.line,
            }}
          >
            <FilterChip.Label>
              <Text>{option.label}</Text>
            </FilterChip.Label>
          </FilterChip>
        ))}
      </Row>
    </>
  );
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
            {t('filter.title')}
          </Text>
        </Row>

        {/* QUAND */}
        <SectionChips title={t('filter.when')} options={whenOptions} selected={when} onSelect={setWhen} />

        {/* SPORT (2 lignes horizontales) */}
        {sportOptions.length > 1 && (
          <SectionHorizontalChips title={t('filter.sport')} options={sportOptions} selected={sport} onSelect={setSport} numRows={2} />
        )}

        {/* QUARTIER (1 seule ligne horizontale) */}
        {neighborhoodOptions.length > 1 && (
          <SectionHorizontalChips
            title={t('filter.neighborhood')}
            options={neighborhoodOptions}
            selected={neighborhood}
            onSelect={setNeighborhood}
          />
        )}

        {/* PRIX */}
        <SectionChips title={t('filter.price')} options={priceOptions} selected={price} onSelect={setPrice} />

        {/* DISTANCE */}
        <Row verticalAlignment="center" modifiers={[padding(0, 12, 0, 0)]}>
          <Text style={{ typography: 'labelSmall', letterSpacing: 1.5 }} color={Colors.light.ink3}>
            {t('filter.distance')}
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
            thumbColor: NeutralColors.white,
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
            colors={{ contentColor: Colors.light.textSecondary }}
          >
            <Text>{t('filter.reset')}</Text>
          </TextButton>

          <Button
            onClick={handleClose}
            colors={{
              containerColor: AccentColors.bissap,
              contentColor: NeutralColors.white,
            }}
          >
            <Text>{t('filter.apply')}</Text>
          </Button>
        </Row>
      </Column>
    </ModalBottomSheet>
  );
}
