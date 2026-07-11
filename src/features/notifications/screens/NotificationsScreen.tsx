import { NotificationItem } from '@/components/ui/notification-item';
import { Colors,  AccentColors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.space12) }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.headerActionText}>TOUT LIRE</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <NotificationItem
          type="system"
          isRead={false}
          iconName="time-outline"
          iconBgColor="#b8324f"
          text="Ton run commence dans 2h. RDV au Monument à 18h30."
          time="Il y a 12 min"
        />

        <NotificationItem
          type="user"
          isRead={false}
          userInitials="AD"
          userBgColor="#f2784f"
          subIconName="add"
          subIconBgColor={Colors.light.text}
          text={<Text><Text style={styles.boldText}>Aïssatou Diallo</Text> a rejoint Sunset Run · Corniche.</Text>}
          time="Il y a 40 min"
        />

        <NotificationItem
          type="system"
          isRead={false}
          iconName="checkmark"
          iconBgColor="#2c7a55"
          text="Une place s'est libérée sur Yoga au lever du soleil 🧘"
          time="Il y a 2h"
        />

        <NotificationItem
          type="user"
          isRead={true}
          userInitials="MS"
          userBgColor="#c64a86"
          subIconName="chatbubble"
          subIconBgColor={Colors.light.text}
          text={<Text><Text style={styles.boldText}>Moussa Sow</Text> a écrit dans la discussion : « Quelqu'un fait le 10k ? »</Text>}
          time="Il y a 5h"
        />

        <NotificationItem
          type="system"
          isRead={true}
          iconName="card-outline"
          iconBgColor="#3b82f6"
          text="Paiement de 2 000 F confirmé pour Foot à 5 du jeudi."
          time="Hier"
        />

        <NotificationItem
          type="user"
          isRead={true}
          userInitials="FN"
          userBgColor="#2c7a55"
          subIconName="add"
          subIconBgColor="#b78ad6"
          text={<Text><Text style={styles.boldText}>Fatou Ndiaye</Text> t'a invité à Playground 3v3.</Text>}
          time="Hier"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space20,
    paddingBottom: Spacing.space16,
    backgroundColor: '#f5f5f4',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.backgroundElement,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: Spacing.space12,
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 20,
    color: Colors.light.text,
  },
  headerActionText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 10,
    color: AccentColors.bissap,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.light.text,
  },
});
