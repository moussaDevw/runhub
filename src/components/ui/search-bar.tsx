import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export function SearchBar({ placeholder = 'Sport, lieu, quartier...', value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={Colors.light.ink3} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.ink3}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundElement, // Paper-2
    borderRadius: Radius.pill,
    height: 48,
    paddingHorizontal: Spacing.space16,
    flex: 1, // To take up remaining space
  },
  icon: {
    marginRight: Spacing.space8,
  },
  input: {
    flex: 1,
    fontFamily: Typography.corps.fontFamily,
    fontSize: Typography.corps.fontSize,
    color: '#232220', // Ink
    paddingVertical: 0,
  },
});
