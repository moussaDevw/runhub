import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export interface ClubEventRowProps {
  dateDay?: string; // Support older code
  dateTime?: string; 
  day?: string; // Support carte.tsx
  time?: string;
  title: string;
  location: string;
  imageSource?: any;
  participants?: string[];
  onPress?: () => void;
}

export function ClubEventRow({
  dateDay,
  dateTime,
  day,
  time,
  title,
  location,
  imageSource,
  participants,
  onPress,
}: ClubEventRowProps) {
  const finalDay = day || dateDay;
  const finalTime = time || dateTime;
  const finalImage = imageSource || require('@/assets/images/onboarding_bg.png');

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.container}>
      {/* Date Column */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateDay}>{finalDay}</Text>
        <Text style={styles.dateTime}>{finalTime}</Text>
      </View>

      {/* Image */}
      <Image source={finalImage} style={styles.image} contentFit="cover" />

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color={Colors.light.ink3} />
          <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
        </View>
      </View>

      {/* Right Column (Participants or Chevron) */}
      {participants && participants.length > 0 ? (
        <View style={styles.participantsContainer}>
          {participants.map((initials, index) => {
            // Assign colors based on index for the mockup
            const colors = ['#f2784f', '#2f6b4d', '#b78ad6', '#d4a373'];
            const color = colors[index % colors.length];
            return (
              <View 
                key={index} 
                style={[
                  styles.participantAvatar, 
                  { backgroundColor: color, marginLeft: index > 0 ? -8 : 0, zIndex: participants.length - index }
                ]}
              >
                <Text style={styles.participantText}>{initials}</Text>
              </View>
            );
          })}
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={18} color={Colors.light.ink3} style={styles.chevron} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.space12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f4', // subtle separator
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44, // fixed width for alignment
    marginRight: Spacing.space12,
  },
  dateDay: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dateTime: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: Radius.card,
    marginRight: Spacing.space12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: Spacing.space8,
  },
  title: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
    marginLeft: 4,
    flexShrink: 1,
  },
  chevron: {
    marginLeft: 'auto',
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  participantAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 8,
    color: '#ffffff',
  },
});
