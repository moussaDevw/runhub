import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';

import { AccentColors } from '@/constants/theme';
import { useCreateModal } from '@/features/creation/store/useCreateModal';
import { useTheme } from '@/hooks/use-theme';

export type BottomTabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { open } = useCreateModal();

  const bottomInset = Math.max(insets.bottom, 6);

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.cardBackground,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: theme.cardBorder,
        height: 49 + bottomInset,
        paddingBottom: bottomInset,
        paddingTop: 4,
        elevation: 0,
      }}
    >
      {state.routes
        .filter((route) => {
          if (route.name === 'index') return false;
          const options = descriptors[route.key]?.options;
          if ((options as any)?.href === null) return false;
          return true;
        })
        .map((route) => {
          const descriptor = descriptors[route.key];
          const options = descriptor?.options;
          if (!options) return null;

          const isFocused = state.routes[state.index]?.name === route.name;
          const color = isFocused ? AccentColors.bissap : theme.ink3;

          const onPress = () => {
            if (route.name === 'creer') {
              open();
              return;
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.6 : 1,
              })}
            >
              {options.tabBarIcon?.({ focused: isFocused, color, size: 24 })}
              <Text
                style={{
                  fontSize: 10,
                  marginTop: 2,
                  fontWeight: isFocused ? '600' : '500',
                  color,
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
}
