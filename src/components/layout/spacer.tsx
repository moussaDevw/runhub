import React from 'react';
import { View, ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';

type SpacingKey = keyof typeof Spacing;

export interface SpacerProps {
  size?: number | SpacingKey;
  horizontal?: boolean;
  flex?: number;
  style?: ViewStyle;
}

function resolveSize(size?: number | SpacingKey): number {
  if (size === undefined) return Spacing.space16;
  if (typeof size === 'number') return size;
  return Spacing[size] ?? Spacing.space16;
}

export function Spacer({ size = 'space16', horizontal = false, flex, style }: SpacerProps) {
  if (flex !== undefined) {
    return <View style={[{ flex }, style]} />;
  }

  const resolved = resolveSize(size);

  const spacerStyle: ViewStyle = horizontal
    ? { width: resolved, height: 1 }
    : { height: resolved, width: 1 };

  return <View style={[spacerStyle, style]} />;
}
