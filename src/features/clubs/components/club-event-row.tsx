import { AvatarColors, Colors, NeutralColors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ClubEventRowProps {
  dateDay?: string;
  dateTime?: string;
  day?: string;
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
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.container} accessibilityRole="button">
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
            const color = AvatarColors[index % AvatarColors.length];
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
    backgroundColor: Colors.light.cardBackground,
    padding: Spacing.space12,
    borderRadius: Radius.md,
    marginBottom: Spacing.space8,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    ...Shadows.sm,
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
    fontSize: 12,
    color: Colors.light.text,
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    marginRight: Spacing.space12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginLeft: 4,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatar: {
    width: 24,
    height: 24,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: NeutralColors.white,
  },
  participantText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 9,
    color: NeutralColors.white,
  },
  chevron: {
    marginLeft: Spacing.space8,
  },
});

