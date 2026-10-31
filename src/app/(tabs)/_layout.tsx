import { BottomTabBar } from '@/components/layout';
import { AccentColors } from '@/constants/theme';
import { useCreateModal } from '@/features/creation/store/useCreateModal';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
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
                color={color as string}
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
                color={color as string}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="courir"
          options={{
            title: t('tabs.run'),
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                name="directions-run"
                size={25}
                color={color as string}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="agenda"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="carte"
          options={{
            href: null,
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

      <NativeTabs.Trigger name="creer" disabled>
        <NativeTabs.Trigger.Label>{t('tabs.create')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }}
          md={{ default: 'add_circle_outline', selected: 'add_circle' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="courir">
        <NativeTabs.Trigger.Label>{t('tabs.run')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'figure.run', selected: 'figure.run' }}
          md={{ default: 'directions_run', selected: 'directions_run' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
