import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { AccentColors, Radius, Typography } from '@/constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary';
  label: string;
}

export function Button({ variant = 'primary', label, style, ...props }: ButtonProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        style
      ]}
      {...props}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: Radius.btn,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primary: {
    backgroundColor: AccentColors.bissap,
  },
  secondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glass/Ghost effect over dark backgrounds
  },
  label: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: Typography.corpsGras.fontSize,
    color: '#ffffff',
  },
});
