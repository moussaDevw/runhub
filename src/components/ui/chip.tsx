import { ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ChipProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Chip({ label, isActive = false, onPress, icon, style }: ChipProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isActive ? theme.text : theme.cardBackground,
          borderColor: isActive ? theme.text : theme.line,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text
          style={[
            styles.text,
            {
              color: isActive ? theme.background : theme.textSecondary,
              fontWeight: isActive ? '700' : '500',
            },
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    paddingHorizontal: Spacing.space12,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space8,
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
  },
});
