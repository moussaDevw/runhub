import { Colors, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ExploreViewToggleProps {
  viewMode: 'list' | 'map';
  onToggle: () => void;
  bottomInset?: number;
}

export function ExploreViewToggle({ viewMode, onToggle, bottomInset = 24 }: ExploreViewToggleProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={[styles.floatingToggle, { bottom: bottomInset }]}
      activeOpacity={0.85}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={viewMode === 'list' ? 'Afficher la carte' : 'Afficher la liste'}
    >
      <Ionicons
        name={viewMode === 'list' ? 'map' : 'list'}
        size={16}
        color="#ffffff"
        style={{ marginRight: 6 }}
      />
      <Text style={styles.floatingToggleText}>
        {viewMode === 'list'
          ? t('explore.toggleMap', { defaultValue: 'Carte' })
          : t('explore.toggleList', { defaultValue: 'Liste' })}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingToggle: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: Colors.light.text,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  floatingToggleText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
});
