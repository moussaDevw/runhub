import { View, Text, StyleSheet } from 'react-native';
import { Radius, Spacing, Typography, BackgroundThemes } from '@/constants/theme';

interface AvatarProps {
  initials?: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  borderWidth?: number;
}

export function Avatar({
  initials = '',
  size = 40,
  backgroundColor = '#b78ad6', // Default yoga purple
  textColor = '#ffffff',
  borderWidth = 0,
}: AvatarProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          borderWidth,
          borderColor: BackgroundThemes.Creme,
        },
      ]}
    >
      {initials ? (
        <Text
          style={[
            styles.text,
            { color: textColor, fontSize: size * 0.4 },
          ]}
        >
          {initials}
        </Text>
      ) : null}
    </View>
  );
}

interface AvatarGroupProps {
  users: Array<{ id: string; initials: string; bgColor: string }>;
  max?: number;
  size?: number;
}

export function AvatarGroup({ users, max = 4, size = 28 }: AvatarGroupProps) {
  const visibleUsers = users.slice(0, max);
  const overflow = users.length - max;

  return (
    <View style={styles.groupContainer}>
      {visibleUsers.map((user, index) => (
        <View key={user.id} style={[styles.avatarWrapper, { zIndex: users.length - index }]}>
          <Avatar
            initials={user.initials}
            size={size}
            backgroundColor={user.bgColor}
            borderWidth={2}
          />
        </View>
      ))}
      {overflow > 0 && (
        <View style={[styles.avatarWrapper, { zIndex: 0 }]}>
          <Avatar
            initials={`+${overflow}`}
            size={size}
            backgroundColor="#232220"
            borderWidth={2}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    fontFamily: Typography.corpsGras.fontFamily,
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    marginRight: -10, // overlap
  },
});
