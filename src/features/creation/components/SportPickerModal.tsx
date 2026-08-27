import React, { useState } from 'react';
import {
  Modal,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';

interface Sport {
  id: string;
  slug: string;
  labelFr: string;
  color: string;
}

interface SportPickerModalProps {
  isVisible: boolean;
  onDismiss: () => void;
  sportsList: Sport[];
  onSelectSport: (id: string) => void;
}

export function SportPickerModal({
  isVisible,
  onDismiss,
  sportsList,
  onSelectSport,
}: SportPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSports = sportsList.filter((s) =>
    s.labelFr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (id: string) => {
    onSelectSport(id);
    setSearchQuery('');
  };

  const handleClose = () => {
    setSearchQuery('');
    onDismiss();
  };

  return (
    <Modal visible={isVisible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choisir un sport</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.modalSearchContainer}>
            <Ionicons name="search-outline" size={20} color={Colors.light.ink3} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Rechercher un sport..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.light.ink3}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={Colors.light.ink3} />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredSports}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSelect(item.id)}
                style={styles.sportItem}
              >
                <View style={[styles.sportModalDot, { backgroundColor: item.color }]} />
                <Text style={styles.sportName}>{item.labelFr}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.modalEmptyState}>
                <Ionicons name="search-outline" size={40} color={Colors.light.ink3} style={{ marginBottom: Spacing.space12 }} />
                <Text style={styles.modalEmptyTitle}>Aucun sport trouvé</Text>
                <Text style={styles.modalEmptySubtitle}>Essayez de rechercher un autre mot-clé ou vérifiez l&apos;orthographe.</Text>
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Spacing.space20,
  },
  modalContent: {
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
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f0',
    borderRadius: Radius.btn,
    paddingHorizontal: Spacing.space12,
    height: 48,
    marginBottom: Spacing.space16,
  },
  modalSearchInput: {
    flex: 1,
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
    paddingVertical: 0,
  },
  sportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f0',
  },
  sportModalDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  sportName: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  modalEmptyState: {
    paddingVertical: 48,
    alignItems: 'center',
    paddingHorizontal: Spacing.space24,
  },
  modalEmptyTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 6,
  },
  modalEmptySubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: '#65625e',
    textAlign: 'center',
    lineHeight: 18,
  },
});
