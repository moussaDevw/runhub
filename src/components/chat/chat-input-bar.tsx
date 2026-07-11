import { View, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors,  AccentColors, BackgroundThemes, Spacing, Typography } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ChatInputBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, Spacing.space12) }]}>
      {/* Plus Button */}
      <TouchableOpacity style={styles.plusButton}>
        <Ionicons name="add" size={24} color="#65625e" />
      </TouchableOpacity>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message..."
          placeholderTextColor={Colors.light.ink3}
          multiline
        />
      </View>

      {/* Send Button */}
      <TouchableOpacity style={styles.sendButton}>
        <Ionicons name="arrow-forward" size={20} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.space16,
    paddingTop: Spacing.space12,
    backgroundColor: BackgroundThemes.Ivoire, // Maybe transparent or solid depending on design, seems solid white in screenshot
    borderTopWidth: 1,
    borderTopColor: Colors.light.backgroundElement,
  },
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space12,
    marginBottom: 4, // Align with text input bottom
  },
  inputContainer: {
    flex: 1,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 20,
    minHeight: 40,
    maxHeight: 100,
    justifyContent: 'center',
    paddingHorizontal: Spacing.space16,
    paddingVertical: 10,
    marginRight: Spacing.space12,
    marginBottom: 4,
  },
  input: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    padding: 0, // Reset default padding
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AccentColors.bissap,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
});
