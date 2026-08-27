import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors,  Spacing, Typography, AccentColors } from '@/constants/theme';
import { FavoriteItem } from '@/components/ui/favorite-item';
import { useFavoritesScreen } from '@/features/profile/hooks/useFavoritesScreen';

export function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const {
    favoriteEvents,
    handleUnlike,
    isLoading,
    router,
  } = useFavoritesScreen();

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="heart-outline" size={32} color={Colors.light.ink3} />
      </View>
      <Text style={styles.emptyTitle}>{t('favorites.emptyTitle')}</Text>
      <Text style={styles.emptySubtitle}>{t('favorites.emptySubtitle')}</Text>
      
      <TouchableOpacity style={styles.exploreButton} onPress={() => router.back()}>
        <Text style={styles.exploreButtonText}>{t('favorites.explore')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.space12) }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('favorites.title')}</Text>
        </View>
        <Text style={styles.headerActionText}>{favoriteEvents.length} {t('favorites.saved')}</Text>
      </View>

      {/* CONTENT */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={AccentColors.bissap} />
        </View>
      ) : favoriteEvents.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {favoriteEvents.map(fav => (
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
          ))}
        </ScrollView>
      )}
    </View>
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
