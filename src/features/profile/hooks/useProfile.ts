import { useAuth } from '@/features/auth/context/AuthContext';
import { ProfileApi } from '@/features/profile/api/profile.api';
import { useUpdateUserSports } from '@/features/sports/hooks/useSports';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

export function useProfile() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();
  const updateSportsMutation = useUpdateUserSports();

  // deletingSportId is the only piece of local UI state needed
  const [deletingSportId, setDeletingSportId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Derive toggle states directly from user — avoids useState+useEffect anti-pattern
  const notificationsEnabled = user?.notifEnabled ?? true;
  const locationEnabled = !!user?.coords;
  const ecoModeEnabled = user?.ecoData ?? false;

  const handleRemoveSport = async (sportId: string) => {
    if (!user?.sports) return;
    if (user.sports.length <= 2) {
      Alert.alert(
        t('common.actionImpossible'),
        t('profile.minSportsError')
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
    try {
      await ProfileApi.updateSettings({ notifEnabled: val });
      await refreshUser();
    } catch (err) {
      console.error('Erreur mise à jour notifications:', err);
    }
  };

  const setEcoModeEnabled = async (val: boolean) => {
    try {
      await ProfileApi.updateSettings({ ecoData: val });
      await refreshUser();
    } catch (err) {
      console.error('Erreur mise à jour mode éco:', err);
    }
  };

  const updateLanguage = async (locale: string) => {
    try {
      await ProfileApi.updateSettings({ locale });
      await refreshUser();
    } catch (err) {
      console.error('Erreur mise à jour langue:', err);
    }
  };

  const setLocationEnabled = async (_val: boolean) => {
    // Si désactivé, on pourrait par exemple envoyer une coordonnée par défaut ou gérer côté app
  };

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Tidiane Diop';
  const displayUsername = user?.username ? `@${user.username}` : '@tidiane';
  const displayEmail = user?.email || 'coureur@runhub.app';
  const initials = ((user?.firstName?.[0] || fullName[0] || 'T') + (user?.lastName?.[0] || fullName.split(' ')[1]?.[0] || 'D')).toUpperCase();

  const handleLogout = async () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              // Stack.Protected redirige automatiquement vers l'écran d'accueil
              await logout();
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ],
    );
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
    updateLanguage,
    handleLogout,
    isLoggingOut,
    handleRemoveSport,
    deletingSportId,
    router,
  };
}
