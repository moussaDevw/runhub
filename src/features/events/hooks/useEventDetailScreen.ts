import { Alert, Platform, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useFavoriteIds, useToggleFavorite } from '@/features/events/hooks/useFavorites';
import { getDeviceLocale, isEnglish } from '@/core/utils/locale';
import { getOrganizerDisplay } from '@/core/utils/user';
import { 
  useEventDetail, 
  useEventParticipants, 
  useRegistrationStatus, 
  useRegister, 
  useCancelRegistration 
} from './useEvents';
import { getEventImageSource } from '../utils/event.utils';

export function useEventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: favoriteIds = [] } = useFavoriteIds();
  const toggleMutation = useToggleFavorite();
  const { user } = useAuth();
  const { t } = useTranslation();

  const liked = id ? favoriteIds.includes(id) : false;

  const handleToggleFavorite = () => {
    if (id) {
      toggleMutation.mutate({ eventId: id, isFavorited: liked });
    }
  };

  // Fetch real event details
  const { data: event, isLoading, error } = useEventDetail(id || '');

  // Fetch participants
  const { data: participants = [] } = useEventParticipants(id || '');

  // Registration status
  const { data: regStatus } = useRegistrationStatus(id || '');
  const isRegistered = regStatus?.isRegistered ?? false;

  const isOrganizer = event?.organizerId === user?.id;

  // Mutations
  const registerMutation = useRegister();
  const cancelMutation = useCancelRegistration();

  const handleParticipate = () => {
    if (!id) return;

    if (isRegistered) {
      Alert.alert(
        'Annuler l\'inscription',
        'Êtes-vous sûr de vouloir annuler votre inscription à cet événement ?',
        [
          { text: 'Non', style: 'cancel' },
          {
            text: 'Oui, annuler',
            style: 'destructive',
            onPress: () => cancelMutation.mutate(id),
          },
        ],
      );
    } else {
      registerMutation.mutate(id, {
        onSuccess: (data) => {
          Alert.alert(
            'Inscription confirmée ! 🎉',
            `Votre code ticket : ${data.ticketCode}`,
            [{ text: 'Super !' }],
          );
        },
        onError: (err) => {
          const message = err instanceof Error ? err.message : "Impossible de s'inscrire pour le moment.";
          Alert.alert('Erreur', message);
        },
      });
    }
  };

  const handleOpenDirections = async () => {
    if (event?.coords) {
      const lat = event.coords.lat;
      const lng = event.coords.lng;
      const placeId = event.googlePlaceId || '';
      
      const googleMapsWebUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}${placeId ? `&query_place_id=${placeId}` : ''}`;
      
      try {
        if (Platform.OS === 'ios') {
          await Linking.openURL(`comgooglemaps://?q=${lat},${lng}`);
        } else {
          await Linking.openURL(`google.navigation:q=${lat},${lng}`);
        }
      } catch (_) {
        await Linking.openURL(googleMapsWebUrl).catch((webErr) => {
          console.log('Error opening maps web URL:', webErr);
        });
      }
    }
  };

  // Date and time formatting helper
  const getFormattedDate = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const locale = getDeviceLocale();
    const day = date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
    const weekday = date.toLocaleDateString(locale, { weekday: 'short' }).replace('.', '');
    return `${weekday.toUpperCase()}.\n${day}`;
  };

  const getWeekdaySubValue = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const en = isEnglish();
    if (isToday) return en ? "Today" : "Aujourd'hui";
    if (isTomorrow) return en ? "Tomorrow" : "Demain";
    return date.toLocaleDateString(getDeviceLocale(), { weekday: 'long' });
  };

  // Calculated values based on loaded event
  const organizerFullName = event ? getOrganizerDisplay(event.organizer).name : '';
  const organizerInitials = event ? getOrganizerDisplay(event.organizer).initials : '';

  const spotsCount = event?.capacity;
  const registrationsCount = event?._count?.registrations || 0;
  const spotsLeft = spotsCount ? spotsCount - registrationsCount : null;
  const placesText = spotsLeft !== null ? `${spotsLeft} restants` : 'illimité';
  const capacityLabel = spotsCount ? `${spotsCount} places max` : 'Libre accès';

  // Build participants avatar list from real data
  const participantAvatars = event
    ? participants.slice(0, 6).map((p) => ({
        id: p.user.id,
        initials: `${(p.user.firstName || '?')[0]}${(p.user.lastName || '?')[0]}`.toUpperCase(),
        bgColor: event.sport.color,
        avatarUrl: p.user.avatarUrl || undefined,
      }))
    : [];

  const imageSource = event ? getEventImageSource(event.coverUrl) : null;
  const isMutating = registerMutation.isPending || cancelMutation.isPending;

  return {
    id,
    event,
    isLoading,
    error,
    liked,
    toggleLiked: handleToggleFavorite,
    isOrganizer,
    isRegistered,
    isMutating,
    registrationsCount,
    spotsLeft,
    placesText,
    capacityLabel,
    participantAvatars,
    imageSource,
    organizerFullName,
    organizerInitials,
    formattedDate: event ? getFormattedDate(event.startsAt) : '',
    weekdaySubValue: event ? getWeekdaySubValue(event.startsAt) : '',
    handleParticipate,
    handleOpenDirections,
    goBack: () => router.back(),
    t,
  };
}
