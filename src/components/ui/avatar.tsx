import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Typography, SportsColors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface AvatarProps {
  uri?: string | null;
  initials?: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  borderWidth?: number;
  borderColor?: string;
}

export function Avatar({
  uri,
  initials = '',
  size = 40,
  backgroundColor = SportsColors.yoga, // Default pleasant accent
  textColor = '#ffffff',
  borderWidth = 0,
  borderColor,
}: AvatarProps) {
  const theme = useTheme();
  const [imageFailed, setImageFailed] = useState(false);

  const effectiveBorderColor = borderColor ?? theme.background;
  const showImage = Boolean(uri && !imageFailed);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: showImage ? theme.backgroundElement : backgroundColor,
          borderWidth,
          borderColor: effectiveBorderColor,
        },
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri: uri! }}
          style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
          contentFit="cover"
          transition={200}
          onError={() => setImageFailed(true)}
        />
      ) : initials ? (
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontSize: Math.max(10, Math.floor(size * 0.38)),
            },
          ]}
        >
          {initials.toUpperCase()}
        </Text>
      ) : null}
    </View>
  );
}

export interface AvatarGroupUser {
  id: string;
  initials: string;
  bgColor?: string;
  avatarUrl?: string | null;
}

export interface AvatarGroupProps {
  users: AvatarGroupUser[];
  max?: number;
  size?: number;
  borderColor?: string;
}

export function AvatarGroup({
  users,
  max = 4,
  size = 28,
  borderColor,
}: AvatarGroupProps) {
  const theme = useTheme();
  const visibleUsers = users.slice(0, max);
  const overflow = users.length - max;
  const effectiveBorderColor = borderColor ?? theme.background;

  return (
    <View style={styles.groupContainer}>
      {visibleUsers.map((user, index) => (
        <View
          key={user.id}
          style={[
            styles.avatarWrapper,
            { zIndex: users.length - index },
          ]}
        >
          <Avatar
            uri={user.avatarUrl}
            initials={user.initials}
            size={size}
            backgroundColor={user.bgColor || SportsColors.yoga}
            borderWidth={2}
            borderColor={effectiveBorderColor}
          />
        </View>
      ))}
      {overflow > 0 && (
        <View style={[styles.avatarWrapper, { zIndex: 0 }]}>
          <Avatar
            initials={`+${overflow}`}
            size={size}
            backgroundColor={theme.surfaceGhost}
            textColor={theme.text}
            borderWidth={2}
            borderColor={effectiveBorderColor}
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
    fontWeight: '700',
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    marginRight: -8, // subtle overlap
  },
});
