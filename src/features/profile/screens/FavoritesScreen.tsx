import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, Typography, AccentColors } from '@/constants/theme';
import { FavoriteItem, FavoriteItemSkeleton } from '@/features/profile/components';
import { HStack, Screen } from '@/components/layout';
import { useTheme } from '@/hooks/use-theme';
import { useFavoritesScreen } from '@/features/profile/hooks/useFavoritesScreen';

export function FavoritesScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    favoriteEvents,
    handleUnlike,
    isLoading,
    router,
  } = useFavoritesScreen();

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="heart-outline" size={32} color={theme.ink3} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('favorites.emptyTitle')}</Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>{t('favorites.emptySubtitle')}</Text>
      
      <TouchableOpacity
        style={[styles.exploreButton, { backgroundColor: theme.cardBackground, borderColor: theme.line }]}
        onPress={() => router.back()}
        accessibilityRole="button"
      >
        <Text style={[styles.exploreButtonText, { color: theme.text }]}>{t('favorites.explore')}</Text>
      </TouchableOpacity>
    </View>
  );

  const header = (
    <HStack align="center" justify="space-between" style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.line }]}>
      <HStack align="center">
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t('common.back', { defaultValue: 'Retour' })}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('favorites.title')}</Text>
      </HStack>
      <Text style={styles.headerActionText}>{favoriteEvents.length} {t('favorites.saved')}</Text>
    </HStack>
  );

  return (
    <Screen
      safeTop
      safeBottom
      scrollable
      header={header}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* CONTENT */}
      {isLoading ? (
        <View style={{ paddingTop: Spacing.space12 }}>
          <FavoriteItemSkeleton />
          <FavoriteItemSkeleton />
          <FavoriteItemSkeleton />
        </View>
      ) : favoriteEvents.length === 0 ? (
        renderEmptyState()
      ) : (
        favoriteEvents.map(fav => (
          <FavoriteItem
            key={fav.id}
            title={fav.title}
            time={fav.time}
            location={fav.location}
            price={fav.price}
            imageSource={fav.imageSource}
            onPress={() => router.push(`/event/${fav.id}` as any)}
            onUnlike={() => handleUnlike(fav.id)}
          />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f4',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.space32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.space26,
  },
  emptyTitle: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: Spacing.space8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: '#65625e',
    textAlign: 'center',
    marginBottom: Spacing.space32,
  },
  exploreButton: {
    backgroundColor: AccentColors.bissap,
    paddingVertical: Spacing.space16,
    paddingHorizontal: Spacing.space32,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  exploreButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#ffffff',
  },
});
