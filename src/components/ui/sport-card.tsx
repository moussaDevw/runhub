import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SportCardProps {
  slug: string;
  label: string;
  color: string;
  isSelected: boolean;
  onToggle: () => void;
}

export const SPORT_ICONS: Record<string, string> = {
  // Course & Athlétisme
  'running': 'run',
  'trail': 'terrain',
  'marathon': 'routes',
  'sprint': 'lightning-bolt',
  'triathlon': 'timer',
  'marche-rapide': 'walk',

  // Sports collectifs
  'football': 'soccer',
  'futsal': 'soccer',
  'basketball': 'basketball',
  'streetball': 'basketball',
  'volleyball': 'volleyball',
  'beach-volley': 'beach',
  'handball': 'handball',
  'rugby': 'rugby',
  'touch-rugby': 'rugby',

  // Sports de raquette
  'tennis': 'tennis-ball',
  'padel': 'tennis',
  'badminton': 'badminton',
  'squash': 'tennis',
  'tennis-de-table': 'table-tennis',

  // Fitness, Musculation & Bien-être
  'musculation': 'weight-lifter',
  'crossfit': 'dumbbell',
  'fitness': 'heart-pulse',
  'calisthenics': 'dumbbell',
  'yoga': 'yoga',
  'pilates': 'yoga',
  'stretching': 'human',

  // Sports de combat
  'boxe-anglaise': 'boxing-glove',
  'boxe-thai': 'boxing-glove',
  'mma': 'karate',
  'judo': 'karate',
  'jiu-jitsu': 'karate',
  'karate': 'karate',
  'taekwondo': 'karate',

  // Cyclisme & Glisse urbaine
  'cyclisme-route': 'bike',
  'vtt': 'bike-fast',
  'gravel': 'bike',
  'roller': 'roller-skate',
  'skate': 'skateboard',

  // Natation & Sports nautiques
  'natation': 'swim',
  'surf': 'surfing',
  'kitesurf': 'water',
  'paddle': 'rowing',
  'aviron': 'rowing',

  // Outdoor
  'randonnee': 'hiking',
  'escalade': 'climbing',
  'alpinisme': 'image-filter-hdr',

  // Danse & Autre
  'danse': 'human-female-dance',
  'golf': 'golf',
  'equitation': 'horse-variant',
  'petanque': 'bowling',
};

export function SportCard({ slug, label, color, isSelected, onToggle }: SportCardProps) {
  const iconName = (SPORT_ICONS[slug] || 'run') as any;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      style={[
        styles.card,
        { backgroundColor: color || Colors.light.text },
        isSelected && styles.cardSelected
      ]}
    >
      {/* Icon container */}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={iconName}
          size={36}
          color="rgba(255, 255, 255, 0.8)"
        />
      </View>

      {/* Dark overlay for text readability at the bottom */}
      <View style={styles.overlay} />

      {/* Selection Indicator */}
      <View style={styles.indicatorContainer}>
        <View style={[styles.indicator, isSelected && styles.indicatorSelected]}>
          {isSelected && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </View>

      {/* Sport Label */}
      <Text style={styles.sportName}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 110,
    borderRadius: Radius.card,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: Spacing.space12,
    opacity: 0.9,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    height: '40%',
  },
  indicatorContainer: {
    position: 'absolute',
    top: Spacing.space12,
    right: Spacing.space12,
  },
  indicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  indicatorSelected: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  checkmark: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  sportName: {
    position: 'absolute',
    bottom: Spacing.space8,
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: Typography.corpsGras.fontSize,
    color: '#ffffff',
    textAlign: 'center',
    width: '90%',
  },
});
