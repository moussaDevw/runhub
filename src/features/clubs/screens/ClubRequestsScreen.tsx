import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { AccentColors, BackgroundThemes, Colors, Spacing, Typography } from '@/constants/theme';
import { useJoinRequests, useRespondToJoinRequest } from '../hooks/useJoinRequests';
import { ClubJoinRequest } from '../types/clubs.types';

export function ClubRequestsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: requests = [], isLoading, refetch } = useJoinRequests(id);
  const respondMutation = useRespondToJoinRequest(id);

  const handleRespond = (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    respondMutation.mutate({ requestId, status });
  };

  const renderItem = ({ item }: { item: ClubJoinRequest }) => {
    const initials = `${item.user.firstName?.[0] ?? ''}${item.user.lastName?.[0] ?? ''}`.toUpperCase() || '?';
    const fullName = `${item.user.firstName ?? ''} ${item.user.lastName ?? ''}`.trim() || item.user.username;
    const isPending = respondMutation.isPending;

    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          {item.user.avatarUrl ? (
            <Image source={{ uri: item.user.avatarUrl }} style={styles.avatar} />
          ) : (
            <Avatar initials={initials} size={44} backgroundColor="#b78ad6" />
          )}
          <View style={styles.cardInfo}>
            <Text style={styles.userName}>{fullName}</Text>
            <Text style={styles.userHandle}>@{item.user.username}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => handleRespond(item.id, 'REJECTED')}
            disabled={isPending}
          >
            <Ionicons name="close" size={18} color="#e06666" />
          </TouchableOpacity>
          <View style={{ width: 8 }} />
          <TouchableOpacity
            style={[styles.actionBtn, styles.approveBtn]}
            onPress={() => handleRespond(item.id, 'APPROVED')}
            disabled={isPending}
          >
            <Ionicons name="checkmark" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <IconButton iconName="chevron-back" variant="ghost" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Demandes d'adhésion</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={AccentColors.bissap} />
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="people-outline" size={56} color={Colors.light.ink3} />
          <Text style={styles.emptyTitle}>Aucune demande en attente</Text>
          <Text style={styles.emptySubtitle}>Toutes les demandes ont été traitées.</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundThemes.Ivoire,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space20,
    paddingVertical: Spacing.space12,
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 17,
    color: Colors.light.text,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.space20,
  },
  emptyTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 17,
    color: Colors.light.text,
    marginTop: Spacing.space16,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: Colors.light.ink3,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.space20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: Spacing.space16,
    marginBottom: Spacing.space12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0ede9',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  cardInfo: {
    marginLeft: Spacing.space12,
    flex: 1,
  },
  userName: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  userHandle: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.space12,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveBtn: {
    backgroundColor: AccentColors.bissap,
  },
  rejectBtn: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
});
