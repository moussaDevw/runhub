import { Colors,  AccentColors, BackgroundThemes } from '@/constants/theme';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

export default function TabsLayout() {
  return (
    <NativeTabs
      // On iOS, a translucent background color naturally applies the native glass effect
      backgroundColor={Platform.OS === 'ios' ? 'rgba(248, 248, 248, 0.7)' : BackgroundThemes.Ivoire}
      iconColor={{ default: Colors.light.ink3, selected: AccentColors.bissap }}
      labelStyle={{
        selected: { color: AccentColors.bissap, fontWeight: 'bold' },
        default: { color: Colors.light.ink3 }
      }}
    >
      <NativeTabs.Trigger name="explorer">
        <NativeTabs.Trigger.Label>Explorer</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'safari', selected: 'safari.fill' }}
          md="explore"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="carte">
        <NativeTabs.Trigger.Label>Carte</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'map', selected: 'map.fill' }}
          md="map"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="creer">
        <NativeTabs.Trigger.Label>Créer</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }}
          md="add_circle"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="agenda">
        <NativeTabs.Trigger.Label>Agenda</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'calendar', selected: 'calendar' }}
          md="calendar_today"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profil">
        <NativeTabs.Trigger.Label>Profil</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person', selected: 'person.fill' }}
          md="person"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
