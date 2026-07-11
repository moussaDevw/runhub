import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface FormInputProps extends TextInputProps {
  label: string;
  rightLabel?: string;
  onRightLabelPress?: () => void;
  rightSuffix?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function FormInput({ 
  label, 
  style, 
  rightLabel,
  onRightLabelPress,
  rightSuffix,
  containerStyle,
  ...rest 
}: FormInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Labels Row */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        
        {rightLabel && (
          <TouchableOpacity activeOpacity={0.7} onPress={onRightLabelPress}>
            <Text style={styles.rightLabel}>{rightLabel}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Input Container */}
      <View style={[styles.inputContainer, rest.multiline && styles.multilineContainer]}>
        <TextInput
          style={[styles.input, rest.multiline && styles.multilineInput, style]}
          placeholderTextColor={Colors.light.ink3}
          {...rest}
        />
        
        {rightSuffix && (
          <Text style={styles.suffix}>{rightSuffix}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.space24,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space8,
    marginLeft: 4,
  },
  label: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rightLabel: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: '#65625e',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: Spacing.space16,
    minHeight: 52,
  },
  multilineContainer: {
    alignItems: 'flex-start',
    paddingVertical: Spacing.space16,
  },
  input: {
    flex: 1,
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    height: '100%',
    paddingVertical: 0, // Reset default padding for android
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    height: undefined,
  },
  suffix: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    marginLeft: 8,
  },
});
