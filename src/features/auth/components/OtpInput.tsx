import { useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { Colors,  AccentColors, Spacing, Typography } from '@/constants/theme';

interface OtpInputProps {
  value: string;
  onChangeCode: (code: string) => void;
  length?: number;
  error?: string;
}

export function OtpInput({ value, onChangeCode, length = 6, error }: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const digits = value.split('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>CODE DE VÉRIFICATION</Text>
      
      <Pressable style={styles.boxesContainer} onPress={handlePress}>
        {Array.from({ length }).map((_, index) => {
          const char = digits[index] || '';
          const isCurrent = index === value.length && value.length < length;
          
          return (
            <View
              key={index}
              style={[
                styles.box,
                isCurrent && styles.boxActive,
                error ? styles.boxError : null,
              ]}
            >
              <Text style={styles.char}>{char}</Text>
            </View>
          );
        })}
      </Pressable>

      {/* Hidden real input capturing keyboard events */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={(text) => onChangeCode(text.replace(/[^0-9]/g, '').slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.space24,
    width: '100%',
  },
  label: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.space12,
    marginLeft: 4,
  },
  boxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  box: {
    width: 48,
    height: 58,
    backgroundColor: '#2b212a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4a3a49',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: {
    borderColor: AccentColors.bissap,
    borderWidth: 2,
    backgroundColor: '#3d2f3c',
  },
  boxError: {
    borderColor: '#C8392F',
  },
  char: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 22,
    color: '#ffffff',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  errorText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: '#C8392F',
    marginTop: 8,
    marginLeft: 4,
  },
});
