import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface SystemMessageProps {
  text: string;
}

export function SystemMessage({ text }: SystemMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: Colors.light.backgroundElement,
    paddingHorizontal: Spacing.space16,
    paddingVertical: 6,
    borderRadius: 16,
    marginVertical: Spacing.space12,
  },
  text: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
