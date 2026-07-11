import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface SectionTitleProps {
  title: string;
  style?: StyleProp<TextStyle>;
}

export function SectionTitle({ title, style }: SectionTitleProps) {
  return (
    <Text style={[styles.title, style]}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 11,
    color: Colors.light.ink3, // Gray text
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.space12,
    marginTop: Spacing.space20, // To give space from previous sections
  },
});
