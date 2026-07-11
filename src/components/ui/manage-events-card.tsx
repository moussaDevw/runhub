import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors,  AccentColors, Spacing, Typography } from '@/constants/theme';

interface ManageEventsCardProps {
  count: number;
  onPress?: () => void;
}

export function ManageEventsCard({ count, onPress }: ManageEventsCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.container}>
      
      {/* Icon Area */}
      <View style={styles.iconWrapper}>
        <Ionicons name="menu" size={20} color="#ffffff" />
      </View>
      
      {/* Text Area */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Mes events créés</Text>
        <Text style={styles.subtitle}>Gérer, check-in & participants</Text>
      </View>
      
      {/* Right Area */}
      <Text style={styles.count}>{count}</Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.light.ink3} />
      
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 20,
    paddingHorizontal: Spacing.space16,
    paddingVertical: Spacing.space16,
    marginBottom: Spacing.space24,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: AccentColors.bissap,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  subtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: '#65625e',
    marginTop: 2,
  },
  count: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: AccentColors.bissap,
    marginRight: 8,
  },
});
