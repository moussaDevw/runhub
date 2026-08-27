import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

import { AccentColors, Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { formatDate, formatTime } from '@/core/utils/locale';

interface DateTimeSectionProps {
  startsAt: string;
  onChangeStartsAt: (val: string) => void;
  minimumDate?: Date;
}

export const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  startsAt,
  onChangeStartsAt,
  minimumDate,
}) => {
  const { t } = useTranslation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      const newDate = new Date(startsAt);
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      onChangeStartsAt(newDate.toISOString());
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      const newDate = new Date(startsAt);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
      onChangeStartsAt(newDate.toISOString());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('creation.whenLabel').toUpperCase()}</Text>
      
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowDatePicker(true)}
          style={styles.datePickerTrigger}
        >
          <Text style={styles.datePickerText}>
            {formatDate(startsAt) || t('creation.datePlaceholder')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowTimePicker(true)}
          style={styles.timePickerTrigger}
        >
          <Text style={styles.datePickerText}>
            {formatTime(startsAt) || t('creation.timePlaceholder')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* iOS Date Picker Modal */}
      {Platform.OS === 'ios' && showDatePicker && (
        <Modal visible={showDatePicker} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentCompact}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('creation.modalChooseDate')}</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Ionicons name="close" size={24} color={Colors.light.text} />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={new Date(startsAt)}
                mode="date"
                display="inline"
                minimumDate={minimumDate}
                accentColor={AccentColors.bissap}
                themeVariant="light"
                textColor={Colors.light.text}
                onChange={handleDateChange}
              />
              <View style={{ marginTop: Spacing.space16 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowDatePicker(false)}
                  style={styles.primaryButton}
                >
                  <Text style={styles.primaryButtonText}>{t('creation.modalConfirmDate')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* iOS Time Picker Modal */}
      {Platform.OS === 'ios' && showTimePicker && (
        <Modal visible={showTimePicker} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentCompact}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('creation.modalChooseTime')}</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Ionicons name="close" size={24} color={Colors.light.text} />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={new Date(startsAt)}
                mode="time"
                display="spinner"
                accentColor={AccentColors.bissap}
                themeVariant="light"
                textColor={Colors.light.text}
                onChange={handleTimeChange}
              />
              <View style={{ marginTop: Spacing.space16 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowTimePicker(false)}
                  style={styles.primaryButton}
                >
                  <Text style={styles.primaryButtonText}>{t('creation.modalConfirmTime')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Android Native Picker Dialogs */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={new Date(startsAt)}
          mode="date"
          display="default"
          minimumDate={minimumDate}
          onChange={handleDateChange}
        />
      )}

      {Platform.OS === 'android' && showTimePicker && (
        <DateTimePicker
          value={new Date(startsAt)}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.space24,
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
  datePickerTrigger: {
    flex: 1.5,
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: Radius.btn,
    justifyContent: 'center',
    paddingHorizontal: Spacing.space16,
    borderWidth: 1,
    borderColor: '#e3e3e1',
  },
  timePickerTrigger: {
    flex: 1,
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: Radius.btn,
    justifyContent: 'center',
    paddingHorizontal: Spacing.space16,
    borderWidth: 1,
    borderColor: '#e3e3e1',
  },
  datePickerText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Spacing.space20,
  },
  modalContentCompact: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    maxHeight: '70%',
    padding: Spacing.space20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space20,
  },
  modalTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  primaryButton: {
    backgroundColor: AccentColors.bissap,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: '#ffffff',
  },
});
