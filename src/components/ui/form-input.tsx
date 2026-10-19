import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface FormInputProps extends TextInputProps {
  label: string;
  rightLabel?: string;
  onRightLabelPress?: () => void;
  rightSuffix?: string;
  error?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export function FormInput({
  label,
  style,
  rightLabel,
  onRightLabelPress,
  rightSuffix,
  error,
  disabled = false,
  containerStyle,
  onFocus,
  onBlur,
  ...rest
}: FormInputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getBorderColor = () => {
    if (error) return theme.danger;
    if (isFocused) return theme.inputBorderFocus;
    return theme.inputBorder;
  };

  return (
    <View style={[styles.container, containerStyle, disabled && styles.disabled]}>
      {/* Labels Row */}
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: error ? theme.danger : theme.ink3 }]}>
          {label}
        </Text>

        {rightLabel && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onRightLabelPress}
            disabled={disabled}
          >
            <Text style={[styles.rightLabel, { color: theme.textSecondary }]}>
              {rightLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.inputBackground,
            borderColor: getBorderColor(),
            borderWidth: isFocused || error ? 1.5 : 1,
          },
          rest.multiline && styles.multilineContainer,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { color: theme.text },
            rest.multiline && styles.multilineInput,
            style,
          ]}
          placeholderTextColor={theme.ink3}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />

        {rightSuffix && (
          <Text style={[styles.suffix, { color: theme.ink3 }]}>{rightSuffix}</Text>
        )}
      </View>

      {/* Error Message */}
      {error ? (
        <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.space20,
  },
  disabled: {
    opacity: 0.55,
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
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  rightLabel: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 11,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.sm,
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
    height: '100%',
    paddingVertical: 0,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    height: undefined,
  },
  suffix: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 11,
    marginLeft: 8,
  },
  errorText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
