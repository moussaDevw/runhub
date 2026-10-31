import { useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import {
  AccentColors,
  Colors,
  Spacing,
  SportsColors,
  Typography,
} from '@/constants/theme';
import { HStack, Screen, Spacer } from '@/components/layout';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useClubDetails } from '../hooks/useClubDetails';
import { useClubMembers, useRemoveClubMember } from '../hooks/useClubMembers';
import { ClubMember } from '../types/clubs.types';

export function ClubMembersScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user: currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');

  const { data: club } = useClubDetails(id);
  const { data: members = [], isLoading, isRefetching, refetch } = useClubMembers(id);
  const removeMemberMutation = useRemoveClubMember(id);

  const isCurrentUserAdminOrOwner =
    club?.myRole === 'OWNER' || club?.myRole === 'ADMIN';

  const filteredMembers = useMemo(() => {
    if (!Array.isArray(members)) return [];
    if (!searchQuery.trim()) return members;
    const q = searchQuery.toLowerCase().trim();
    return members.filter((m) => {
      const firstName = m?.user?.firstName || '';
      const lastName = m?.user?.lastName || '';
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const username = (m?.user?.username || '').toLowerCase();
      return fullName.includes(q) || username.includes(q);
    });
  }, [members, searchQuery]);

  const handleRemoveMember = (member: ClubMember) => {
    const memberName =
      `${member?.user?.firstName || ''} ${member?.user?.lastName || ''}`.trim() ||
      (member?.user?.username ? `@${member.user.username}` : '') ||
      'Membre';

    Alert.alert(
      t('club.removeMember'),
      t('club.removeMemberConfirm', { name: memberName }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('club.removeMember'),
          style: 'destructive',
          onPress: () => {
            removeMemberMutation.mutate(member.userId, {
              onError: (err: any) => {
                Alert.alert(t('common.error'), err?.message || t('common.genericError'));
              },
            });
          },
        },
      ],
    );
  };

  const getRoleBadge = (role: 'OWNER' | 'ADMIN' | 'MEMBER') => {
    switch (role) {
      case 'OWNER':
        return {
          label: t('club.roleOwner'),
          bgColor: '#FDE8E8',
          textColor: AccentColors.bissap,
          icon: 'shield-checkmark' as const,
        };
      case 'ADMIN':
        return {
          label: t('club.roleAdmin'),
          bgColor: '#EBF5FF',
          textColor: '#2563EB',
          icon: 'ribbon-outline' as const,
        };
      default:
        return {
          label: t('club.roleMember'),
          bgColor: '#F3F4F6',
          textColor: '#4B5563',
          icon: null,
        };
    }
  };

  const renderItem = ({ item }: { item: ClubMember }) => {
    const user = item?.user;
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    const username = user?.username;

    const initials =
      `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() ||
      username?.[0]?.toUpperCase() ||
      '?';

    const fullName =
      `${firstName} ${lastName}`.trim() ||
      (username ? `@${username}` : 'Membre');

    const roleBadge = getRoleBadge(item.role || 'MEMBER');

    // Can remove if: currentUser is OWNER/ADMIN, item is NOT owner, and item is NOT self
    const canRemove =
      isCurrentUserAdminOrOwner &&
      item.role !== 'OWNER' &&
      item.userId !== currentUser?.id;

    return (
      <HStack align="center" justify="space-between" style={styles.card}>
        <HStack align="center" style={styles.cardLeft}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <Avatar initials={initials} size={46} backgroundColor={SportsColors.running} />
          )}

          <View style={styles.cardInfo}>
            <HStack align="center" style={styles.nameRow}>
              <Text style={[styles.userName, { color: theme.text }]} numberOfLines={1}>
                {fullName}
              </Text>
              {item.userId === currentUser?.id && (
                <Text style={styles.youBadge}>({t('common.you') || 'Vous'})</Text>
              )}
            </HStack>
            {username ? (
              <Text style={[styles.userHandle, { color: theme.textSecondary }]} numberOfLines={1}>
                @{username}
              </Text>
            ) : null}
          </View>
        </HStack>

        <HStack align="center">
          <View style={[styles.roleBadge, { backgroundColor: roleBadge.bgColor }]}>
            {roleBadge.icon && (
              <Ionicons
                name={roleBadge.icon}
                size={12}
                color={roleBadge.textColor}
                style={{ marginRight: 3 }}
              />
            )}
            <Text style={[styles.roleText, { color: roleBadge.textColor }]}>
              {roleBadge.label}
            </Text>
          </View>

          {canRemove && (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => handleRemoveMember(item)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={t('club.removeMember')}
            >
              <Ionicons name="trash-outline" size={17} color="#e06666" />
            </TouchableOpacity>
          )}
        </HStack>
      </HStack>
    );
  };

  const header = (
    <HStack
      align="center"
      justify="space-between"
      style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.line }]}
    >
      <IconButton iconName="chevron-back" variant="ghost" onPress={() => router.back()} />
      <View style={styles.headerTitleContainer}>
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
          {t('club.membersTitle')}
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          {t('club.membersCount', { count: members.length })}
        </Text>
      </View>
      <View style={{ width: 40 }} />
    </HStack>
  );

  return (
    <Screen safeTop safeBottom header={header}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: '#F3F4F6' }]}>
          <Ionicons name="search" size={18} color={Colors.light.ink3} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={t('club.searchMembers')}
            placeholderTextColor={Colors.light.ink3}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={Colors.light.ink3} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={AccentColors.bissap} />
        </View>
      ) : filteredMembers.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="people-outline" size={56} color={theme.ink3} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            {searchQuery ? t('club.noMembersFound') : t('club.noMembers')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => `${item.clubId}_${item.userId}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={Boolean(isRefetching)}
          onRefresh={refetch}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: Spacing.space12,
    borderBottomWidth: 1,
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 17,
  },
  headerSubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
  },
  searchContainer: {
    paddingHorizontal: Spacing.space16,
    paddingVertical: Spacing.space12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: Spacing.space12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    height: '100%',
  },
  listContent: {
    paddingHorizontal: Spacing.space16,
    paddingTop: Spacing.space12,
    paddingBottom: Spacing.space32,
  },
  card: {
    paddingVertical: Spacing.space12,
    paddingHorizontal: Spacing.space12,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    marginBottom: Spacing.space8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardLeft: {
    flex: 1,
    marginRight: Spacing.space12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  cardInfo: {
    marginLeft: Spacing.space12,
    flex: 1,
  },
  nameRow: {
    marginBottom: 2,
  },
  userName: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 15,
  },
  youBadge: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 11,
    color: AccentColors.bissap,
    marginLeft: 4,
  },
  userHandle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  roleText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 11,
    fontWeight: '600',
  },
  removeBtn: {
    padding: 6,
    marginLeft: Spacing.space8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.space32,
  },
  emptyTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 16,
    marginTop: Spacing.space16,
    textAlign: 'center',
  },
});

