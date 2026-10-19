import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

import { MaxContentWidth, Spacing } from '@/constants/theme';

type SpacingKey = keyof typeof Spacing;

export interface ContainerProps extends ViewProps {
  children?: ReactNode;
  paddingHorizontal?: number | SpacingKey;
  maxWidth?: number;
  style?: ViewStyle | ViewStyle[];
}

function resolvePadding(padding?: number | SpacingKey): number {
  if (padding === undefined) return Spacing.space16;
  if (typeof padding === 'number') return padding;
  return Spacing[padding] ?? Spacing.space16;
}

export function Container({
  children,
  paddingHorizontal,
  maxWidth = MaxContentWidth,
  style,
  ...rest
}: ContainerProps) {
  const resolvedPadding = resolvePadding(paddingHorizontal);

  return (
    <View
      style={[
        styles.container,
        {
          maxWidth,
          paddingHorizontal: resolvedPadding,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
  },
});
