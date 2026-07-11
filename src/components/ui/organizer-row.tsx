import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from './avatar';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface OrganizerRowProps {
  name: string;
  initials: string;
  avatarColor: string;
  meta: string;
  onPress?: () => void;
}

export function OrganizerRow({ name, initials, avatarColor, meta, onPress }: OrganizerRowProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.container}>
      <Avatar initials={initials} size={48} backgroundColor={avatarColor} />
      
      <View style={styles.textContainer}>
        <Text style={styles.name}>Organisé par {name}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={Colors.light.ink3} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.space16,
  },
  textContainer: {
    flex: 1,
    marginLeft: Spacing.space16,
    marginRight: Spacing.space8,
  },
  name: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 2,
  },
  meta: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: '#65625e',
  },
});
