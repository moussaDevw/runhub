import { View, StyleSheet } from 'react-native';
import { AccentColors, Radius } from '@/constants/theme';

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
  variant?: 'light' | 'dark';
}

export function PaginationDots({ total, activeIndex, variant = 'light' }: PaginationDotsProps) {
  const isDark = variant === 'dark';

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              isActive 
                ? (isDark ? styles.activeDotDark : styles.activeDotLight)
                : (isDark ? styles.inactiveDotDark : styles.inactiveDotLight),
            ]}
          />
        );
      })}
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
    height: 6,
    borderRadius: Radius.pill,
  },
  activeDotLight: {
    width: 24,
    backgroundColor: '#ffffff',
  },
  inactiveDotLight: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDotDark: {
    width: 24,
    backgroundColor: AccentColors.bissap,
  },
  inactiveDotDark: {
    width: 6,
    backgroundColor: 'rgba(194, 70, 106, 0.2)', // Light bissap for inactive
  },
});
