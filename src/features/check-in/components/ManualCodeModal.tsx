import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';

export interface ManualCodeModalProps {
  visible: boolean;
  value: string;
  onChangeValue: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function ManualCodeModal({
  visible,
  value,
  onChangeValue,
  onSubmit,
  onClose,
}: ManualCodeModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Saisir le code du billet</Text>
          <Text style={styles.modalSubtitle}>
            Entrez le code alphanumérique à 8 caractères visible sur le billet du participant.
          </Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Ex: 7KB9QD2A"
            placeholderTextColor={Colors.light.ink3}
            value={value}
            onChangeText={onChangeValue}
            autoCapitalize="characters"
            autoCorrect={false}
            autoFocus
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
              <Text style={styles.modalCancelText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalSubmitBtn, !value.trim() && styles.modalSubmitDisabled]}
              disabled={!value.trim()}
              onPress={onSubmit}
            >
              <Text style={styles.modalSubmitText}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.space24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: Spacing.space24,
  },
  modalTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
    marginBottom: Spacing.space16,
    lineHeight: 18,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#e3e3e1',
    borderRadius: 12,
    paddingHorizontal: Spacing.space16,
    height: 48,
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    letterSpacing: 2,
    color: Colors.light.text,
    marginBottom: Spacing.space20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.space12,
  },
  modalCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3e3e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
  modalSubmitBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: AccentColors.bissap,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitDisabled: {
    opacity: 0.5,
  },
  modalSubmitText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: '#ffffff',
  },
});
