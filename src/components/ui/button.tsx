import { ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Radius, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  label: string;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  label,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  ...props
}: ButtonProps) {
  const theme = useTheme();

  const getContainerVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: theme.primary };
      case 'secondary':
        return { backgroundColor: theme.backgroundElement };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: theme.line,
        };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'danger':
        return { backgroundColor: theme.danger };
      default:
        return { backgroundColor: theme.primary };
    }
  };

  const getTextColor = (): string => {
    if (variant === 'primary' || variant === 'danger') {
      return '#ffffff';
    }
    if (variant === 'secondary') {
      return theme.text;
    }
    return theme.text;
  };

  const getSizeContainerStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return styles.smContainer;
      case 'lg':
        return styles.lgContainer;
      case 'md':
      default:
        return styles.mdContainer;
    }
  };

  const getSizeTextStyle = (): TextStyle => {
    switch (size) {
      case 'sm':
        return styles.smText;
      case 'lg':
        return styles.lgText;
      case 'md':
      default:
        return styles.mdText;
    }
  };

  const textColor = getTextColor();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        styles.base,
        getSizeContainerStyle(),
        getContainerVariantStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[styles.label, getSizeTextStyle(), { color: textColor }]}>
            {label}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.btn,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  label: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontWeight: '700',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.55,
  },
  // Sizes container
  smContainer: {
    height: 38,
    paddingHorizontal: 14,
  },
  mdContainer: {
    height: 48,
    paddingHorizontal: 20,
  },
  lgContainer: {
    height: 54,
    paddingHorizontal: 24,
  },
  // Sizes text
  smText: {
    fontSize: 13,
  },
  mdText: {
    fontSize: 15,
  },
  lgText: {
    fontSize: 17,
  },
});
