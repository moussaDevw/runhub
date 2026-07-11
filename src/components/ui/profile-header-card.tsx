import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './avatar';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface ProfileHeaderCardProps {
  name: string;
  username: string;
  email?: string;
  phone?: string;
  initials: string;
  avatarColor?: string;
  onPress?: () => void;
}

export function ProfileHeaderCard({
  name,
  username,
  email,
  phone,
  initials,
  avatarColor = '#b8324f',
  onPress,
}: ProfileHeaderCardProps) {
  const info = email || phone || '';
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress} 
      style={styles.cardContainer}
      disabled={!onPress}
    >
      <Avatar initials={initials} size={64} backgroundColor={avatarColor} />
      
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.subtitle}>{username}{info ? ` · ${info}` : ''}</Text>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={Colors.light.ink3} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: Spacing.space20,
    marginBottom: Spacing.space32,
    // Add subtle shadow matching screenshot
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    marginLeft: Spacing.space16,
    justifyContent: 'center',
  },
  name: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: '#65625e',
    letterSpacing: 0.2,
  },
});
