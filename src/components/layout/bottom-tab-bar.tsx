import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';

import { AccentColors } from '@/constants/theme';
import { useCreateModal } from '@/features/creation/store/useCreateModal';
import { useTheme } from '@/hooks/use-theme';

const ALLOWED_TABS = ['explorer', 'creer', 'courir'];

export function BottomTabBar({ state, descriptors, emitter, navigateToTab }: BottomTabBarProps) {
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
        height: 52 + bottomInset,
        paddingBottom: bottomInset,
        paddingTop: 6,
        elevation: 0,
      }}
    >
      {state.routes
        .filter((route) => ALLOWED_TABS.includes(route.name))
        .sort((a, b) => ALLOWED_TABS.indexOf(a.name) - ALLOWED_TABS.indexOf(b.name))
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

            const event = emitter.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigateToTab(route.key);
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
                  fontSize: 11,
                  marginTop: 2,
                  fontWeight: isFocused ? '700' : '500',
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
