import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FormInput } from '@/components/ui/form-input';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

interface PricingSectionProps {
  isPaid: boolean;
  setIsPaid: (val: boolean) => void;
  price: number;
  capacity: number | undefined;
  onChangePrice: (val: number) => void;
  onChangeCapacity: (val: number | undefined) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  isPaid,
  setIsPaid,
  price,
  capacity,
  onChangePrice,
  onChangeCapacity,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('creation.tarifLabel').toUpperCase()}</Text>
      
      <View style={styles.toggleRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setIsPaid(false);
            onChangePrice(0);
          }}
          style={[styles.toggleButton, !isPaid && styles.toggleButtonActive]}
        >
          <Text style={[styles.toggleButtonText, !isPaid && styles.toggleButtonTextActive]}>
            {t('creation.tarifFree')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setIsPaid(true);
            onChangePrice(2000); // Default to a standard price
          }}
          style={[styles.toggleButton, isPaid && styles.toggleButtonActive]}
        >
          <Text style={[styles.toggleButtonText, isPaid && styles.toggleButtonTextActive]}>
            {t('creation.tarifPaid')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <FormInput
          label={t('creation.capacityLabel').toUpperCase()}
          placeholder={t('creation.capacityPlaceholder')}
          value={capacity ? capacity.toString() : ''}
          onChangeText={(val) => onChangeCapacity(val ? parseInt(val, 10) : undefined)}
          rightSuffix={t('creation.capacitySuffix')}
          keyboardType="numeric"
          containerStyle={{ flex: 1 }}
        />
        {isPaid && (
          <FormInput
            label={t('creation.priceLabel').toUpperCase()}
            placeholder={t('creation.pricePlaceholder')}
            value={price ? price.toString() : ''}
            onChangeText={(val) => onChangePrice(val ? parseInt(val, 10) : 0)}
            keyboardType="numeric"
            containerStyle={{ flex: 1, marginLeft: Spacing.space12 }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.space8,
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
  row: {
    flexDirection: 'row',
    gap: Spacing.space12,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: Radius.btn,
    padding: 4,
    marginBottom: Spacing.space24,
    borderWidth: 1,
    borderColor: '#e3e3e1',
  },
  toggleButton: {
    flex: 1,
    height: 44,
    borderRadius: Radius.btn - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.light.text,
  },
  toggleButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: '#65625e',
  },
  toggleButtonTextActive: {
    color: '#ffffff',
  },
});
