import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors,  Spacing, Typography, AccentColors } from '@/constants/theme';

export interface SettingsRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  type?: 'chevron' | 'toggle' | 'none';
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  isDestructive?: boolean;
  onPress?: () => void;
}

export function SettingsRow({
  iconName,
  title,
  subtitle,
  type = 'chevron',
  value = false,
  onValueChange,
  isDestructive = false,
  onPress,
}: SettingsRowProps) {
  
  const content = (
    <>
      {/* Left Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={20} color={Colors.light.text} />
      </View>
      
      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, isDestructive && styles.destructiveText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
      
      {/* Right Element */}
      {type === 'toggle' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#e3e3e1', true: AccentColors.bissap }}
          thumbColor="#ffffff"
          ios_backgroundColor="#e3e3e1"
        />
      ) : type === 'chevron' ? (
        <Ionicons name="chevron-forward" size={18} color={Colors.light.ink3} />
      ) : null}
    </>
  );

  if (type === 'toggle' || !onPress) {
    return <View style={styles.container}>{content}</View>;
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onPress} 
      style={styles.container}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.space12,
    marginBottom: Spacing.space8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: Spacing.space12,
  },
  title: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
  },
  destructiveText: {
    color: AccentColors.bissap, // The red color for destructive actions
  },
  subtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
    marginTop: 2,
  },
});
