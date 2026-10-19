import { AccentColors } from '@/constants/theme';
import { useCreateModal } from '@/features/creation/store/useCreateModal';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabBar } from '@/components/layout';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const { t } = useTranslation();
  const { open } = useCreateModal();
  const theme = useTheme();

  if (Platform.OS === 'android') {
    return (
      <Tabs
        tabBar={(props) => <BottomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="explorer"
          options={{
            title: t('tabs.explore'),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'compass' : 'compass-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="carte"
          options={{
            title: t('tabs.map'),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'map' : 'map-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="creer"
          options={{
            title: t('tabs.create'),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'add-circle' : 'add-circle-outline'}
                size={25}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="agenda"
          options={{
            title: t('tabs.agenda'),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'calendar' : 'calendar-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profil"
          options={{
            title: t('tabs.profile'),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />
      </Tabs>
    );
  }

  return (
    <NativeTabs
      backgroundColor={theme.cardBackground}
      blurEffect="none"
      disableTransparentOnScrollEdge={true}
      minimizeBehavior="never"
      shadowColor="transparent"
      disableIndicator={true}
      indicatorColor="transparent"
      rippleColor="transparent"
      labelVisibilityMode="labeled"
      iconColor={{ default: theme.ink3, selected: AccentColors.bissap }}
      labelStyle={{
        selected: { color: AccentColors.bissap, fontWeight: 'bold', fontSize: 11 },
        default: { color: theme.ink3, fontWeight: '500', fontSize: 11 },
      }}
      screenListeners={{
        tabPress: (e) => {
          // The disabled "creer" tab fires tabPress with isPrevented=true
          // We intercept it to open the creation modal
          if ((e.data as any)?.isPrevented) {
            open();
          }
        },
      }}
    >
      <NativeTabs.Trigger name="explorer">
        <NativeTabs.Trigger.Label>{t('tabs.explore')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'safari', selected: 'safari.fill' }}
          md={{ default: 'explore', selected: 'explore' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="carte">
        <NativeTabs.Trigger.Label>{t('tabs.map')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'map', selected: 'map.fill' }}
          md={{ default: 'map', selected: 'map' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="creer" disabled>
        <NativeTabs.Trigger.Label>{t('tabs.create')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }}
          md={{ default: 'add_circle_outline', selected: 'add_circle' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="agenda">
        <NativeTabs.Trigger.Label>{t('tabs.agenda')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'calendar', selected: 'calendar' }}
          md={{ default: 'calendar_today', selected: 'calendar_today' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profil">
        <NativeTabs.Trigger.Label>{t('tabs.profile')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person', selected: 'person.fill' }}
          md={{ default: 'person_outline', selected: 'person' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
