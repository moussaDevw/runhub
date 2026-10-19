import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { AccentColors, BackgroundThemes, Colors, Spacing, SportsColors, Typography } from '@/constants/theme';
import { HStack, Screen, Spacer } from '@/components/layout';
import { useTheme } from '@/hooks/use-theme';
import { useJoinRequests, useRespondToJoinRequest } from '../hooks/useJoinRequests';
import { ClubJoinRequest } from '../types/clubs.types';

export function ClubRequestsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
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
      <HStack align="center" justify="space-between" style={styles.card}>
        <HStack align="center" style={styles.cardLeft}>
          {item.user.avatarUrl ? (
            <Image source={{ uri: item.user.avatarUrl }} style={styles.avatar} />
          ) : (
            <Avatar initials={initials} size={44} backgroundColor={SportsColors.yoga} />
          )}
          <View style={styles.cardInfo}>
            <Text style={[styles.userName, { color: theme.text }]}>{fullName}</Text>
            <Text style={[styles.userHandle, { color: theme.textSecondary }]}>@{item.user.username}</Text>
          </View>
        </HStack>

        <HStack align="center" style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => handleRespond(item.id, 'REJECTED')}
            disabled={isPending}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Ionicons name="close" size={18} color="#e06666" />
          </TouchableOpacity>
          <Spacer size="space8" horizontal />
          <TouchableOpacity
            style={[styles.actionBtn, styles.approveBtn]}
            onPress={() => handleRespond(item.id, 'APPROVED')}
            disabled={isPending}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Ionicons name="checkmark" size={18} color="#ffffff" />
          </TouchableOpacity>
        </HStack>
      </HStack>
    );
  };

  const header = (
    <HStack align="center" justify="space-between" style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.line }]}>
      <IconButton iconName="chevron-back" variant="ghost" onPress={() => router.back()} />
      <Text style={[styles.headerTitle, { color: theme.text }]}>{t('club.joinRequests')}</Text>
      <View style={{ width: 40 }} />
    </HStack>
  );

  return (
    <Screen safeTop safeBottom header={header}>
      <Stack.Screen options={{ headerShown: false }} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={AccentColors.bissap} />
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="people-outline" size={56} color={theme.ink3} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('club.noPendingRequests')}</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>{t('club.allRequestsProcessed')}</Text>
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
    </Screen>
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
