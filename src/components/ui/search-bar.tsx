import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
}

export function SearchBar({
  placeholder = 'Sport, lieu, quartier...',
  value = '',
  onChangeText,
  onClear,
}: SearchBarProps) {
  const theme = useTheme();

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChangeText) {
      onChangeText('');
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.line,
        },
      ]}
    >
      <Ionicons name="search" size={18} color={theme.ink3} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.ink3}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleClear}
          style={styles.clearButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-circle" size={18} color={theme.ink3} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.pill,
    height: 44,
    paddingHorizontal: Spacing.space16,
    flex: 1,
    borderWidth: 1,
  },
  icon: {
    marginRight: Spacing.space8,
  },
  input: {
    flex: 1,
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: Spacing.space4,
  },
});
