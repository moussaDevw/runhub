import { AccentColors, BackgroundThemes, Colors } from '@/constants/theme';
import { useCreateModal } from '@/features/creation/store/useCreateModal';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const { open } = useCreateModal();

  return (
    <NativeTabs
      backgroundColor={Platform.OS === 'ios' ? 'rgba(248, 248, 248, 0.7)' : BackgroundThemes.Ivoire}
      iconColor={{ default: Colors.light.ink3, selected: AccentColors.bissap }}
      labelStyle={{
        selected: { color: AccentColors.bissap, fontWeight: 'bold' },
        default: { color: Colors.light.ink3 }
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

      <NativeTabs.Trigger name="creer" disabled>
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

