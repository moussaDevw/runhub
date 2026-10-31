import React, { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { Spacing } from '@/constants/theme';

type SpacingKey = keyof typeof Spacing;

export interface StackProps extends ViewProps {
  children?: ReactNode;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  gap?: number | SpacingKey;
  align?: ViewStyle['alignItems'];
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  wrap?: boolean | 'wrap' | 'nowrap' | 'wrap-reverse';
  flex?: number;
  style?: ViewStyle | ViewStyle[];
}

function resolveGap(gap?: number | SpacingKey): number | undefined {
  if (gap === undefined) return undefined;
  if (typeof gap === 'number') return gap;
  return Spacing[gap] ?? undefined;
}

export function Stack({
  children,
  direction = 'column',
  gap,
  align,
  justify,
  wrap,
  flex,
  style,
  ...rest
}: StackProps) {
  const resolvedGap = resolveGap(gap);

  const stackStyle: ViewStyle = {
    flexDirection: direction,
    gap: resolvedGap,
    alignItems: align,
    justifyContent: justify,
    flexWrap: typeof wrap === 'boolean' ? (wrap ? 'wrap' : 'nowrap') : wrap,
    flex,
  };

  return (
    <View style={[stackStyle, style]} {...rest}>
      {children}
    </View>
  );
}

export function HStack(props: Omit<StackProps, 'direction'>) {
  return <Stack direction="row" {...props} />;
}

export function VStack(props: Omit<StackProps, 'direction'>) {
  return <Stack direction="column" {...props} />;
}
