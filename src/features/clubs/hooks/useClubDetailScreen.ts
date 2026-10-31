import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, Linking } from 'react-native';

import { useAuth } from '@/features/auth/context/AuthContext';
import { useEventsList } from '@/features/events/hooks/useEvents';
import { ClubsApi } from '../api/clubs.api';
import { useClubDetails } from './useClubDetails';
import { useClubMembers } from './useClubMembers';
import { useJoinRequests } from './useJoinRequests';

export function useClubDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: club, isLoading, isError } = useClubDetails(id);

  // Fetch pending requests only if admin/owner (skip otherwise)
  const isAdminOrOwner = club?.myRole === 'OWNER' || club?.myRole === 'ADMIN';
  const { data: pendingRequests = [] } = useJoinRequests(isAdminOrOwner ? id : '');
  const pendingCount = pendingRequests.length;

  // Fetch upcoming events for this club
  const { data: clubEventsData, isLoading: isLoadingEvents } = useEventsList({ clubId: id });
  const clubEvents = clubEventsData?.data ?? [];

  // Fetch club members
  const { data: members = [] } = useClubMembers(id);

  const followMutation = useMutation({
    mutationFn: () => {
      if (club?.isFollower) {
        return ClubsApi.unfollowClub(id);
      } else {
        return ClubsApi.followClub(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', id] });
    },
  });

  const joinMutation = useMutation({
    mutationFn: () => {
      if (club?.isMember) {
        if (!user?.id) throw new Error('Utilisateur non connecté');
        return ClubsApi.leaveClub(id, user.id);
      } else if (club?.joinRequestStatus === 'PENDING') {
        return ClubsApi.cancelJoinRequest(id);
      } else {
        return ClubsApi.joinClub(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', id] });
      queryClient.invalidateQueries({ queryKey: ['my-clubs'] });
    },
    onError: (err: any) => {
      const message = err?.message || t('club.errorLoad');
      Alert.alert(t('common.error'), message);
    },
  });

  const handleJoinPress = () => {
    if (club?.isMember) {
      Alert.alert(
        t('club.leave'),
        t('club.leaveConfirm'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('club.leave'),
            style: 'destructive',
            onPress: () => joinMutation.mutate(),
          },
        ],
      );
    } else if (club?.joinRequestStatus === 'PENDING') {
      Alert.alert(
        t('club.cancelRequest'),
        t('club.cancelRequestConfirm'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('club.cancelRequest'),
            style: 'destructive',
            onPress: () => joinMutation.mutate(),
          },
        ],
      );
    } else {
      joinMutation.mutate();
    }
  };

  const handleFollowPress = () => {
    followMutation.mutate();
  };

  const handleOpenWhatsapp = async () => {
    if (!club?.whatsappGroupUrl) return;
    try {
      const canOpen = await Linking.canOpenURL(club.whatsappGroupUrl);
      if (canOpen) {
        await Linking.openURL(club.whatsappGroupUrl);
        return;
      }
    } catch (e) {
      console.warn('Cannot open WhatsApp url:', e);
    }
    Linking.openURL(club.whatsappGroupUrl);
  };

  const handleCreateEvent = () => {
    router.push(`/event/create?clubId=${id}` as any);
  };

  const handleViewRequests = () => {
    router.push(`/club/${id}/requests` as any);
  };

  const handleViewMembers = () => {
    router.push(`/club/${id}/members` as any);
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}` as any);
  };

  const goBack = () => {
    router.back();
  };

  return {
    id,
    club,
    isLoading,
    isError,
    isAdminOrOwner,
    pendingCount,
    clubEvents,
    isLoadingEvents,
    members,
    isJoinPending: joinMutation.isPending,
    isFollowPending: followMutation.isPending,
    handleJoinPress,
    handleFollowPress,
    handleOpenWhatsapp,
    handleCreateEvent,
    handleViewRequests,
    handleViewMembers,
    handleEventPress,
    goBack,
  };
}

