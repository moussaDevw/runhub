import { View, Text, StyleSheet } from 'react-native';
import { AccentColors, Typography } from '@/constants/theme';

export function YallaaLogo() {
  return (
    <View style={styles.container}>
      <View style={styles.dot} />
      <Text style={styles.text}>Yallaa</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AccentColors.bissap,
  },
  text: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 20, // slightly smaller than titre for the top corner
    color: '#ffffff',
  },
});
