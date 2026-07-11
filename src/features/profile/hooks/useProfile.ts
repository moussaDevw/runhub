import { useAuth } from '@/features/auth/context/AuthContext';
import { ProfileApi } from '@/features/profile/api/profile.api';
import { useUpdateUserSports } from '@/features/sports/hooks/useSports';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useProfile() {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();
  const updateSportsMutation = useUpdateUserSports();

  // States for toggles
  const [notificationsEnabled, setNotificationsEnabledState] = useState(user?.notifEnabled ?? true);
  const [locationEnabled, setLocationEnabledState] = useState(!!user?.coords);
  const [ecoModeEnabled, setEcoModeEnabledState] = useState(user?.ecoData ?? false);
  const [deletingSportId, setDeletingSportId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.notifEnabled !== undefined) setNotificationsEnabledState(user.notifEnabled);
      if (user.ecoData !== undefined) setEcoModeEnabledState(user.ecoData);
      if (user.coords !== undefined) setLocationEnabledState(!!user.coords);
    }
  }, [user]);

  const handleRemoveSport = async (sportId: string) => {
    if (!user?.sports) return;
    if (user.sports.length <= 2) {
      Alert.alert(
        'Action impossible',
        'Vous devez garder au moins 2 sports favoris pour personnaliser votre expérience.'
      );
      return;
    }
    const newSportIds = user.sports.filter((s) => s.id !== sportId).map((s) => s.id);
    setDeletingSportId(sportId);
    try {
      await updateSportsMutation.mutateAsync(newSportIds);
      await refreshUser();
    } catch (err) {
      console.error('Erreur suppression sport:', err);
    } finally {
      setDeletingSportId(null);
    }
  };

  const setNotificationsEnabled = async (val: boolean) => {
    setNotificationsEnabledState(val);
    try {
      await ProfileApi.updateSettings({ notifEnabled: val });
      await refreshUser();
    } catch (err) {
      console.error('Erreur mise à jour notifications:', err);
    }
  };

  const setEcoModeEnabled = async (val: boolean) => {
    setEcoModeEnabledState(val);
    try {
      await ProfileApi.updateSettings({ ecoData: val });
      await refreshUser();
    } catch (err) {
      console.error('Erreur mise à jour mode éco:', err);
    }
  };

  const setLocationEnabled = async (val: boolean) => {
    setLocationEnabledState(val);
    // Si désactivé, on pourrait par exemple envoyer une coordonnée par défaut ou gérer côté app
  };

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Tidiane Diop';
  const displayUsername = user?.username ? `@${user.username}` : '@tidiane';
  const displayEmail = user?.email || 'coureur@runhub.app';
  const initials = ((user?.firstName?.[0] || fullName[0] || 'T') + (user?.lastName?.[0] || fullName.split(' ')[1]?.[0] || 'D')).toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login' as any);
  };

  return {
    user,
    fullName,
    displayUsername,
    displayEmail,
    initials,
    notificationsEnabled,
    setNotificationsEnabled,
    locationEnabled,
    setLocationEnabled,
    ecoModeEnabled,
    setEcoModeEnabled,
    handleLogout,
    handleRemoveSport,
    deletingSportId,
    router,
  };
}
